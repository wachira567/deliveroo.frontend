import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { orderAPI, paymentAPI } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import OrderMap from "../components/OrderMap";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCustomer, isCourier } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateDestination, setShowUpdateDestination] = useState(false);
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const [destinationForm, setDestinationForm] = useState({
    destination_address: "",
    destination_lat: "",
    destination_lng: "",
  });

  useEffect(() => {
    fetchOrder();
    
    // Poll for updates if polling is active
    let interval;
    if (isPolling) {
        interval = setInterval(() => {
            fetchOrder();
        }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [id, isPolling]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data);
      
      // Stop polling if payment is completed
      if (response.data.payment_status === 'completed') {
          if (isPolling) {
              setIsPolling(false);
              toast.success("Payment Received! Sending email...");
              // Small delay to read the toast then redirect
              setTimeout(() => {
                  navigate("/orders");
              }, 2000);
          }
      } else if (isPolling && response.data.payment_status === 'failed') {
          setIsPolling(false);
          toast.error("Payment failed. Please try again.");
      }
      
      setDestinationForm({
        destination_address: response.data.destination_address || "",
        destination_lat: response.data.destination_lat || "",
        destination_lng: response.data.destination_lng || "",
      });
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch order";
      // Only show error toast if not just a polling background refresh issue? 
      // Actually we want to know if it fails.
      console.error(message);
      if (!isPolling) {
          toast.error(message);
          navigate("/orders");
      }
      // If polling fails once (e.g. network blip), don't kill polling immediately?
      // but if 404/403 then yes.
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  };
  
  // Watch order updates to stop polling
  useEffect(() => {
      // If we are polling and order status changes or we detect success (needs API support)
      // Since we don't have payment status in GET /orders/:id response explicitly as 'paid'
      // We can check if any notification says "Payment received"
      // But notifications are separate.
      // Let's just poll for 60 seconds then stop.
      
      if (isPolling) {
          const timer = setTimeout(() => {
              setIsPolling(false);
              toast("Payment check timed out. Please refresh if you paid.", { icon: "ℹ️" });
          }, 60000);
          return () => clearTimeout(timer);
      }
  }, [isPolling]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await orderAPI.cancel(id);
      toast.success("Order cancelled successfully");
      fetchOrder();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to cancel order";
      toast.error(message);
    }
  };

  const handleUpdateDestination = async (e) => {
    e.preventDefault();

    try {
      const data = {
        destination_address: destinationForm.destination_address,
      };

      if (destinationForm.destination_lat) {
        data.destination_lat = parseFloat(destinationForm.destination_lat);
      }
      if (destinationForm.destination_lng) {
        data.destination_lng = parseFloat(destinationForm.destination_lng);
      }

      await orderAPI.updateDestination(id, data);
      toast.success("Destination updated successfully");
      setShowUpdateDestination(false);
      fetchOrder();
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to update destination";
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
            <p className="text-gray-500">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Order not found</p>
            <Link
              to="/orders"
              className="text-orange-500 hover:text-orange-600 mt-4 inline-block"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/orders" className="text-orange-500 hover:text-orange-600">
            ← Back to Orders
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Order #{order.id}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Parcel</span>
                <span className="font-medium">{order.parcel_name}</span>
              </div>

              {order.description && (
                <div className="py-2 border-b">
                  <span className="text-gray-600">Description</span>
                  <p className="mt-1">{order.description}</p>
                </div>
              )}

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Weight</span>
                <span className="font-medium">
                  {order.weight}kg ({order.weight_category})
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Distance</span>
                <span className="font-medium">
                  {order.distance?.toFixed(2) || "-"} km
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Price</span>
                <span className="font-bold text-xl text-orange-500">
                  KES {order.price}
                </span>
              </div>

              <div className="py-2 border-b">
                <span className="text-gray-600">Pickup Address</span>
                <p className="font-medium mt-1">{order.pickup_address}</p>
              </div>

              <div className="py-2 border-b">
                <span className="text-gray-600">Destination Address</span>
                <p className="font-medium mt-1">{order.destination_address}</p>
              </div>

              {order.created_at && (
                <div className="py-2">
                  <span className="text-gray-600">Created At</span>
                  <p className="font-medium mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Customer Info */}
            {order.customer && !isCustomer && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Customer Info</h3>
                <p className="text-gray-600">{order.customer.full_name}</p>
                <p className="text-gray-600">{order.customer.phone}</p>
                <p className="text-gray-600">{order.customer.email}</p>
              </div>
            )}

            {/* Courier Info */}
            {order.courier && (
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Courier Info</h3>
                <p className="text-gray-600">{order.courier.full_name}</p>
                <p className="text-gray-600">{order.courier.phone}</p>
                {order.courier.vehicle_type && (
                  <p className="text-gray-600">
                    Vehicle: {order.courier.vehicle_type} (
                    {order.courier.plate_number})
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            {isCustomer && order.status === "pending" && order.payment_status !== "completed" && (
              <div className="mt-6 space-y-4">
                {/* Payment Overlay */}
                {/* Payment Overlay - Show if polling OR if we are waiting for initial status check */}
                {isPolling && (
                     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm mx-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
                            <p className="text-gray-600 mb-4">Please check your phone and enter your M-Pesa PIN.</p>
                            <p className="text-sm text-gray-400">
                                Once paid, this screen will update automatically.
                                <br/>
                                <button onClick={() => setIsPolling(false)} className="text-red-400 hover:text-red-500 mt-4 underline text-xs">
                                    Cancel checking
                                </button>
                            </p>
                        </div>
                     </div>
                )}
                
                {!showMpesaPrompt ? (
                    <button
                    onClick={() => setShowMpesaPrompt(true)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 shadow-md flex items-center justify-center gap-2"
                    >
                    <span>💳</span> Pay with M-Pesa (KES {order.price})
                    </button>
                ) : (
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const toastId = toast.loading("Initiating M-Pesa payment...");
                        try {
                            const res = await paymentAPI.initiate({ 
                                order_id: order.id,
                                phone_number: mpesaNumber 
                            });
                            toast.success("Requests sent! Check your phone.", { id: toastId });
                            setShowMpesaPrompt(false);
                            setIsPolling(true); // Start polling
                        } catch (error) {
                            toast.error(error.response?.data?.error || "Payment failed", { id: toastId });
                        }
                    }} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        {/* Show error if payment status is failed */}
                        {order.payment_status === 'failed' && (
                            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                                <p className="font-bold">Payment Failed</p>
                                <p>The previous payment verification failed. Please check the number and try again.</p>
                            </div>
                        )}
                        <label className="block text-sm font-medium text-green-800 mb-2">
                            Enter M-Pesa Number
                        </label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                value={mpesaNumber}
                                onChange={(e) => setMpesaNumber(e.target.value)}
                                placeholder="e.g. 0712345678"
                                className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <button 
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                            >
                                Pay
                            </button>
                            <button 
                                type="button"
                                onClick={() => setShowMpesaPrompt(false)}
                                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                            Enter your phone number in format 07... or 01...
                        </p>
                    </form>
                )}

                <div className="flex gap-4">
                    <button
                    onClick={() =>
                        setShowUpdateDestination(!showUpdateDestination)
                    }
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                    Update Destination
                    </button>
                    <button
                    onClick={handleCancelOrder}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    >
                    Cancel Order
                    </button>
                </div>
              </div>
            )}

            {/* Update Destination Form */}
            {showUpdateDestination && (
              <form
                onSubmit={handleUpdateDestination}
                className="mt-6 p-4 bg-gray-50 rounded-lg"
              >
                <h3 className="font-bold text-gray-800 mb-4">
                  Update Destination
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      New Destination Address *
                    </label>
                    <input
                      type="text"
                      value={destinationForm.destination_address}
                      onChange={(e) =>
                        setDestinationForm({
                          ...destinationForm,
                          destination_address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Latitude (optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={destinationForm.destination_lat}
                        onChange={(e) =>
                          setDestinationForm({
                            ...destinationForm,
                            destination_lat: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Longitude (optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={destinationForm.destination_lng}
                        onChange={(e) =>
                          setDestinationForm({
                            ...destinationForm,
                            destination_lng: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpdateDestination(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Tracking Map
            </h2>
            <OrderMap order={order} />

            {/* Current Location (if courier) */}
            {isCourier &&
              order.status !== "delivered" &&
              order.status !== "cancelled" && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">
                    📍 Update Your Location
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Use your GPS to get accurate coordinates
                  </p>
                  <button
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          // In a real app, you'd call the API here
                          toast.success(
                            `Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                          );
                        },
                        (error) => {
                          toast.error("Failed to get location");
                        },
                      );
                    }}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                  >
                    📍 Get Current Location
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
