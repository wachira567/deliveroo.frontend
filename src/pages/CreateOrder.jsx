import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { orderAPI } from "../services/api";
import toast from "react-hot-toast";

const libraries = ["places"];

const CreateOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [price, setPrice] = useState(null);
  
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);

  const [formData, setFormData] = useState({
    parcel_name: "",
    description: "",
    weight: "",
    pickup_address: "",
    destination_address: "",
    pickup_lat: null,
    pickup_lng: null,
    destination_lat: null,
    destination_lng: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onPlaceChanged = (ref, type) => {
    if (ref.current) {
        const place = ref.current.getPlace();
        if (place && place.geometry) {
            setFormData(prev => ({
                ...prev,
                [`${type}_address`]: place.formatted_address,
                [`${type}_lat`]: place.geometry.location.lat(),
                [`${type}_lng`]: place.geometry.location.lng(),
            }));
        }
    }
  };

  useEffect(() => {
    if (isLoaded && formData.pickup_lat && formData.destination_lat) {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [{ lat: formData.pickup_lat, lng: formData.pickup_lng }],
                destinations: [{ lat: formData.destination_lat, lng: formData.destination_lng }],
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === "OK" && response.rows[0].elements[0].status === "OK") {
                    const element = response.rows[0].elements[0];
                    const distKm = element.distance.value / 1000;
                    setDistance(element.distance.text);
                    setDuration(element.duration.text);
                    setPrice(Math.max(distKm * 1, 10).toFixed(2)); // Min 10 KSH, 1 KSH/km
                }
            }
        );
    }
  }, [formData.pickup_lat, formData.destination_lat, isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        parcel_name: formData.parcel_name,
        description: formData.description,
        weight: parseFloat(formData.weight),
        pickup_address: formData.pickup_address,
        destination_address: formData.destination_address,
        pickup_lat: formData.pickup_lat,
        pickup_lng: formData.pickup_lng,
        destination_lat: formData.destination_lat,
        destination_lng: formData.destination_lng,
        price: price ? parseFloat(price) : 0,
        distance: distance 
      };

      const response = await orderAPI.create(data);
      toast.success("Order created successfully!");
      navigate(`/orders/${response.data.order.id}`);
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create order";
      toast.error(message);
    }

    setLoading(false);
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading Maps...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Create New Order
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcel Name *
                </label>
                <input
                  type="text"
                  name="parcel_name"
                  value={formData.parcel_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Documents, Electronics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Address *
                  </label>
                  <Autocomplete
                    onLoad={(ref) => (pickupRef.current = ref)}
                    onPlaceChanged={() => onPlaceChanged(pickupRef, "pickup")}
                  >
                    <input
                      type="text"
                      name="pickup_address"
                      value={formData.pickup_address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Search pickup location"
                      required
                    />
                  </Autocomplete>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Address *
                  </label>
                  <Autocomplete
                    onLoad={(ref) => (destinationRef.current = ref)}
                    onPlaceChanged={() => onPlaceChanged(destinationRef, "destination")}
                  >
                    <input
                      type="text"
                      name="destination_address"
                      value={formData.destination_address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Search destination"
                      required
                    />
                  </Autocomplete>
                </div>
              </div>

              {distance && (
                <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-blue-800">
                    <div>
                        <p className="text-sm font-bold">Estimated Distance</p>
                        <p className="text-lg">{distance}</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold">Estimated Time</p>
                        <p className="text-lg">{duration}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold">Estimated Price</p>
                        <p className="text-xl font-bold">KSH {price}</p>
                    </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
              >
                {loading ? "Creating Order..." : "Create Order"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
