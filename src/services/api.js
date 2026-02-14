import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem("accessToken", access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
  logout: () => api.post("/logout"),
  logout: () => api.post("/logout"),
  getMe: () => api.get("/me"),
  updateProfile: (data) => api.put("/me", data),
  verifyEmail: (token) => 
    api.post("/verify-email", {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  forgotPassword: (email) => api.post("/forgot-password", { email }),
  resetPassword: (token, password) => 
    api.post("/reset-password", { password }, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateDestination: (id, data) => api.patch(`/orders/${id}/destination`, data),
  cancel: (id) => api.delete(`/orders/${id}`),
};

// Courier APIs
export const courierAPI = {
  getAssignedOrders: () => api.get("/courier/orders"),
  updateLocation: (id, data) => api.patch(`/courier/orders/${id}/location`, data),
  updateStatus: (id, data) => api.patch(`/courier/orders/${id}/status`, data),
  getStats: () => api.get("/courier/stats"),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getOrders: (params) => api.get("/admin/orders", { params }),
  getCouriers: () => api.get("/admin/couriers"),
  assignCourier: (orderId, courierId) =>
    api.patch(`/admin/orders/${orderId}/assign-courier`, {
      courier_id: courierId,
    }),
  updateOrderStatus: (orderId, status) =>
    api.patch(`/admin/orders/${orderId}/status`, { status }),
  toggleUserActive: (userId) =>
    api.patch(`/admin/users/${userId}/toggle-active`),
  getReports: () => api.get("/admin/reports"),
  changeUserRole: (userId, role) =>
    api.patch(`/admin/users/${userId}/role`, { role }),
};

// Payment APIs
export const paymentAPI = {
  initiate: (data) => api.post("/payments/pay", data),
};

export default api;
