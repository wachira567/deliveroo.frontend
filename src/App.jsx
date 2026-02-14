import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateOrder from "./pages/CreateOrder";
import OrdersList from "./pages/OrdersList";
import OrderDetail from "./pages/OrderDetail";
import CourierOrders from "./pages/CourierOrders";
import CourierDashboard from "./pages/CourierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import AdminLayout from "./layouts/AdminLayout";
import CourierLayout from "./layouts/CourierLayout";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminOrders from "./pages/AdminOrders";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Component to handle root redirect based on role
const HomeRedirect = () => {
    const { user, isAuthenticated, loading } = useAuth();
    
    if (loading) return null;

    if (isAuthenticated) {
        if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user?.role === 'courier') return <Navigate to="/courier/dashboard" replace />;
    }
    
    return <Home />;
};

const App = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Helper to check if we should show main navbar
  const showNavbar = !user || user.role === 'customer';

  return (
    <div className="min-h-screen bg-gray-100">
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Customer Routes */}
        <Route
          path="/create-order"
          element={
            <ProtectedRoute roles={["customer"]}>
              <CreateOrder />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["customer"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Shared Order Routes (Customer view) */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["customer"]}>
              <OrdersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute roles={["customer", "courier", "admin"]}>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Courier Routes */}
        <Route
          path="/courier"
          element={
            <ProtectedRoute roles={["courier"]}>
              <CourierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CourierDashboard />} />
          <Route path="orders" element={<CourierOrders />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
