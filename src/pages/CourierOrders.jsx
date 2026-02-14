import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courierAPI } from "../services/api";
import toast from "react-hot-toast";
import OrderMap from "../components/OrderMap";

const CourierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [locationForm, setLocationForm] = useState({ lat: "", lng: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        courierAPI.getAssignedOrders(),
        courierAPI.getStats(),
      ]);
      setOrders(ordersRes.data.orders);
      setStats(statsRes.data);
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (orderId) => {
    try {
      await courierAPI.updateLocation(orderId, {
        lat: parseFloat(locationForm.lat),
        lng: parseFloat(locationForm.lng),
      });
      toast.success("Location updated successfully");
      fetchData();
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to update location";
      toast.error(message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await courierAPI.updateStatus(orderId, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update status";
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
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Deliveries</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-orange-500">
                {stats.total_orders}
              </p>
              <p className="text-gray-600">Total</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-green-500">
                {stats.delivered_orders}
              </p>
              <p className="text-gray-600">Delivered</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-orange-500">
                {stats.in_transit_orders}
              </p>
              <p className="text-gray-600">In Transit</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-blue-500">
                KES {stats.earnings}
              </p>
              <p className="text-gray-600">Earnings</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="grid gap-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">
                No deliveries assigned yet
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      #{order.id} - {order.parcel_name}
                    </h3>
                    <p className="text-gray-600">
                      📦 {order.weight}kg • {order.weight_category}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Pickup</p>
                    <p className="font-medium">{order.pickup_address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Destination</p>
                    <p className="font-medium">{order.destination_address}</p>
                  </div>
                </div>

                {order.customer && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Customer</p>
                    <p className="font-medium">{order.customer.full_name}</p>
                    <p className="text-gray-600 text-sm">
                      {order.customer.phone}
                    </p>
                  </div>
                )}

                {/* Map */}
                {selectedOrder === order.id && (
                  <div className="mb-4">
                    <OrderMap order={order} />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder === order.id ? null : order.id,
                      )
                    }
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    {selectedOrder === order.id ? "Hide Map" : "Show Map"}
                  </button>

                  <button
                    onClick={() =>
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setLocationForm({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                          });
                          toast.success(
                            'Location captured! Click "Update Location" to save.',
                          );
                        },
                        (error) => toast.error("Failed to get location"),
                      )
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    📍 Get GPS
                  </button>

                  {locationForm.lat && locationForm.lng && (
                    <button
                      onClick={() => handleUpdateLocation(order.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Update Location
                    </button>
                  )}

                  {order.status === "assigned" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "picked_up")}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      Mark Picked Up
                    </button>
                  )}

                  {order.status === "picked_up" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "in_transit")}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      Start Transit
                    </button>
                  )}

                  {order.status === "in_transit" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "delivered")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourierOrders;
