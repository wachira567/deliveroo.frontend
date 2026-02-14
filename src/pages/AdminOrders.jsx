import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";
import { Search, Filter, MapPin, Package, User } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [couriers, setCouriers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ orderId: "", courierId: "" });

  useEffect(() => {
    fetchOrders();
    fetchCouriers();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: 20,
        ...(statusFilter && { status: statusFilter }),
      };
      const response = await adminAPI.getOrders(params);
      setOrders(response.data.orders);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchCouriers = async () => {
    try {
      const response = await adminAPI.getCouriers();
      setCouriers(response.data.couriers);
    } catch (error) {
      console.error("Failed to fetch couriers", error);
    }
  };

  const handleAssignCourier = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.assignCourier(assignForm.orderId, assignForm.courierId);
      toast.success("Courier assigned successfully");
      setShowAssignModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to assign courier");
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

  const filteredOrders = orders.filter((order) =>
    order.id.toString().includes(search) ||
    order.parcel_name.toLowerCase().includes(search.toLowerCase()) ||
    (order.customer_name && order.customer_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
            
            <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>
                
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
                <div className="p-12 text-center text-gray-500">Loading orders...</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No orders found</div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col sm:flex-row gap-4">
                                     {/* Image */}
                                    <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        {order.parcel_image_url ? (
                                            <img src={order.parcel_image_url} alt="Parcel" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                                                <Package size={24} />
                                                <span className="text-xs mt-1">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-1">{order.parcel_name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">KES {order.price}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <User size={14} />
                                                <span>Customer: {order.customer?.full_name || 'Unknown'}</span>
                                            </div>
                                            {order.courier && (
                                                <div className="flex items-center gap-2">
                                                    <User size={14} />
                                                    <span>Courier: {order.courier.full_name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 sm:col-span-2">
                                                <MapPin size={14} />
                                                <span className="truncate">{order.pickup_address} → {order.destination_address}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex gap-2">
                                            <Link 
                                                to={`/admin/orders/${order.id}`}
                                                className="text-sm px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                                            >
                                                View Details
                                            </Link>
                                            {(order.status === 'pending' || order.status === 'assigned') && (
                                                <button
                                                    onClick={() => {
                                                        setAssignForm({ orderId: order.id, courierId: "" });
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="text-sm px-3 py-1 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 text-orange-700"
                                                >
                                                    Assign Courier
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
        
        {/* Pagination (Simplified) */}
        {totalPages > 1 && (
            <div className="flex justify-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-600">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Assign Courier</h2>
                    <form onSubmit={handleAssignCourier}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Courier</label>
                            <select
                                value={assignForm.courierId}
                                onChange={(e) => setAssignForm({ ...assignForm, courierId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value="">Select courier...</option>
                                {couriers.filter(c => c.is_active).map(courier => (
                                    <option key={courier.id} value={courier.id}>
                                        {courier.full_name} ({courier.vehicle_type})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">Assign</button>
                            <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminOrders;
