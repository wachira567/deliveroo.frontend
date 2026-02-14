import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";
import OrderMap from "../components/OrderMap";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ orderId: "", courierId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, couriersRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getCouriers(),
      ]);
      setStats(dashboardRes.data.stats);
      setRecentOrders(dashboardRes.data.recent_orders);
      setCouriers(couriersRes.data.couriers);
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCourier = async (e) => {
    e.preventDefault();

    try {
      await adminAPI.assignCourier(assignForm.orderId, assignForm.courierId);
      toast.success("Courier assigned successfully");
      setShowAssignModal(false);
      setAssignForm({ orderId: "", courierId: "" });
      fetchData();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to assign courier";
      toast.error(message);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success("Status updated successfully");
      fetchData();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update status";
      toast.error(message);
    }
  };

  const handleToggleUserActive = async (userId) => {
    try {
      await adminAPI.toggleUserActive(userId);
      toast.success("User status toggled");
      fetchData();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to toggle user";
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      in_transit: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-3xl font-bold text-orange-500">
                {stats.total_users}
              </p>
              <p className="text-gray-600">Total Users</p>
              <p className="text-sm text-gray-500">
                {stats.total_customers} customers, {stats.total_couriers}{" "}
                couriers
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-3xl font-bold text-blue-500">
                {stats.total_orders}
              </p>
              <p className="text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-3xl font-bold text-green-500">
                {stats.delivered_orders}
              </p>
              <p className="text-gray-600">Delivered</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-3xl font-bold text-purple-500">
                KES {stats.total_revenue}
              </p>
              <p className="text-gray-600">Revenue</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Orders
            </h2>

            {recentOrders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          #{order.id} - {order.parcel_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer_name || "Unknown"} • KES {order.price}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        View Map
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => {
                            setAssignForm({ ...assignForm, orderId: order.id });
                            setShowAssignModal(true);
                          }}
                          className="text-sm text-green-500 hover:text-green-600"
                        >
                          Assign
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleUpdateStatus(order.id, "cancelled")
                        }
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Couriers */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Active Couriers
            </h2>

            {couriers.length === 0 ? (
              <p className="text-gray-500">No couriers registered</p>
            ) : (
              <div className="space-y-3">
                {couriers.map((courier) => (
                  <div key={courier.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{courier.full_name}</p>
                        <p className="text-sm text-gray-500">
                          {courier.vehicle_type} • {courier.plate_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {courier.total_deliveries} deliveries •{" "}
                          {courier.active_orders} active
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleUserActive(courier.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          courier.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {courier.is_active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Order Map */}
        {selectedOrder && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Order #{selectedOrder.id} Map
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-600"
              >
                ✕ Close
              </button>
            </div>
            <OrderMap order={selectedOrder} />
          </div>
        )}

        {/* Assign Courier Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Assign Courier
              </h2>

              <form onSubmit={handleAssignCourier}>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    Order ID: {assignForm.orderId}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Courier
                  </label>
                  <select
                    value={assignForm.courierId}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        courierId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select courier...</option>
                    {couriers
                      .filter((c) => c.is_active)
                      .map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.full_name} ({courier.vehicle_type})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                  >
                    Assign
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignModal(false);
                      setAssignForm({ orderId: "", courierId: "" });
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
