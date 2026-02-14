import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courierAPI } from "../services/api";
import toast from "react-hot-toast";
import { MapPin, Package, Clock, ArrowRight } from "lucide-react";

const CourierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await courierAPI.getAssignedOrders();
      setOrders(response.data.orders);
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch orders";
      toast.error(message);
    } finally {
      setLoading(false);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Deliveries</h1>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {orders.length} Assigned
        </span>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Deliveries Assigned</h3>
            <p className="text-gray-500">You don't have any orders assigned to you right now.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                   {/* Image Thumbnail */}
                   <div className="w-full md:w-48 flex-shrink-0">
                      {order.parcel_image_url ? (
                        <img 
                            src={order.parcel_image_url} 
                            alt={order.parcel_name}
                            className="w-full h-32 object-cover rounded-lg bg-gray-100"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <Package size={32} />
                        </div>
                      )}
                   </div>

                   {/* Order Info */}
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                #{order.id} - {order.parcel_name}
                            </h3>
                            <p className="text-sm text-gray-500">{order.weight}kg • {order.weight_category}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                            {order.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-orange-500"><MapPin size={16} /></div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold">Pickup</p>
                                <p className="text-gray-700 text-sm line-clamp-2">{order.pickup_address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-blue-500"><MapPin size={16} /></div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold">Destination</p>
                                <p className="text-gray-700 text-sm line-clamp-2">{order.destination_address}</p>
                            </div>
                        </div>
                      </div>
                      
                      {order.created_at && (
                          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                              <Clock size={14} />
                              <span>Posted {new Date(order.created_at).toLocaleString()}</span>
                          </div>
                      )}
                   </div>

                   {/* Actions */}
                   <div className="flex flex-col justify-center items-end border-l pl-6 border-gray-100">
                        <Link 
                            to={`/orders/${order.id}`}
                            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm whitespace-nowrap"
                        >
                            View Details <ArrowRight size={16} />
                        </Link>
                        {order.status === 'in_transit' && (
                            <p className="mt-2 text-xs text-orange-600 font-medium animate-pulse">
                                ● In Transit
                            </p>
                        )}
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourierOrders;
