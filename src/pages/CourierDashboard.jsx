import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courierAPI } from "../services/api";
import toast from "react-hot-toast";
import { Package, Truck, DollarSign, CheckCircle } from "lucide-react";

const CourierDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        courierAPI.getStats(),
        courierAPI.getAssignedOrders(),
      ]);
      setStats(statsRes.data);
      
      // Find an active order (in_transit or assigned)
      const currentOrder = ordersRes.data.orders.find(o => 
        o.status === 'in_transit' || o.status === 'picked_up' || o.status === 'assigned'
      );
      setActiveOrder(currentOrder);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Courier Dashboard</h1>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total_orders}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-gray-800">{stats.delivered_orders}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-800">{stats.in_transit_orders}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Earnings</p>
              <p className="text-2xl font-bold text-gray-800">KES {stats.earnings}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Order Card or CTA */}
      <h2 className="text-xl font-bold text-gray-800 mt-8">Current Activity</h2>
      {activeOrder ? (
         <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center">
                <span className="font-bold text-orange-800 flex items-center gap-2">
                    <Truck size={18} />
                    Current Job #{activeOrder.id}
                </span>
                <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 uppercase tracking-wide">
                    {activeOrder.status.replace('_', ' ')}
                </span>
            </div>
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {activeOrder.parcel_image_url && (
                        <img 
                            src={activeOrder.parcel_image_url} 
                            alt="Parcel" 
                            className="w-full md:w-32 h-32 object-cover rounded-lg bg-gray-100"
                        />
                    )}
                    <div className="flex-1 space-y-2">
                        <h3 className="font-bold text-lg text-gray-800">{activeOrder.parcel_name}</h3>
                        <p className="text-gray-600 text-sm">{activeOrder.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Pickup From</p>
                                <p className="font-medium text-gray-800">{activeOrder.pickup_address}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Deliver To</p>
                                <p className="font-medium text-gray-800">{activeOrder.destination_address}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Link 
                        to={`/courier/orders`}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 font-medium transition-colors shadow-sm"
                    >
                        Manage Delivery
                    </Link>
                </div>
            </div>
         </div>
      ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Deliveries</h3>
              <p className="text-gray-500 mb-6">You don't have any jobs in progress correctly.</p>
              <Link 
                to="/courier/orders"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View Assigned Orders &rarr;
              </Link>
          </div>
      )}
    </div>
  );
};

export default CourierDashboard;
