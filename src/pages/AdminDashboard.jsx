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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-3xl font-bold text-orange-500">
              {stats.total_users}
            </p>
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.total_customers} customers, {stats.total_couriers}{" "}
              couriers
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-3xl font-bold text-blue-500">
              {stats.total_orders}
            </p>
            <p className="text-gray-600 text-sm">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-3xl font-bold text-green-500">
              {stats.delivered_orders}
            </p>
            <p className="text-gray-600 text-sm">Delivered</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-3xl font-bold text-purple-500">
              KES {stats.total_revenue}
            </p>
            <p className="text-gray-600 text-sm">Revenue</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
             <Link to="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700">View All</Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No orders yet</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Image Thumbnail */}
                    <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                        {order.parcel_image_url ? (
                            <img src={order.parcel_image_url} alt="Parcel" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs text-center p-1">No Image</div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-gray-900 truncate">
                                #{order.id} - {order.parcel_name}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <span>👤 {order.customer_name || "Unknown"}</span>
                                    <span>•</span>
                                    <span>KES {order.price}</span>
                                </p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                                {order.status}
                            </span>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                                            <Link 
                                                to={`/admin/orders/${order.id}`}
                                                className="text-xs border border-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-50"
                                            >
                                                Details
                                            </Link>
                        {order.status === "pending" && (
                            <button
                            onClick={() => {
                                setAssignForm({ ...assignForm, orderId: order.id });
                                setShowAssignModal(true);
                            }}
                            className="text-xs border border-green-200 text-green-600 px-2 py-1 rounded hover:bg-green-50"
                            >
                            Assign Courier
                            </button>
                        )}
                        <button
                            onClick={() =>
                            handleUpdateStatus(order.id, "cancelled")
                            }
                            className="text-xs border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50"
                        >
                            Cancel
                        </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Order Map (Sidebar) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-fit">
            <div className="p-4 border-b border-gray-100">
                 <h2 className="text-lg font-semibold text-gray-800">
                    {selectedOrder ? `Order #${selectedOrder.id} Map` : 'Select Order'}
                 </h2>
            </div>
            <div className="p-4">
                 {selectedOrder ? (
                     <div className="space-y-4">
                         <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <OrderMap order={selectedOrder} />
                         </div>
                         <button
                            onClick={() => setSelectedOrder(null)}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
                        >
                            Clear Selection
                        </button>
                     </div>
                 ) : (
                     <div className="h-48 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">
                         Select an order to view map
                     </div>
                 )}
            </div>
            
            {/* Quick Links */}
            <div className="p-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                    <Link to="/admin/users" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">Manage Users</Link>
                    <Link to="/admin/reports" className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">View Reports</Link>
                </div>
            </div>
        </div>
      </div>

      {/* Assign Courier Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignForm({ orderId: "", courierId: "" });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
