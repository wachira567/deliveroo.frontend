import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import toast from "react-hot-toast";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parcel_name: "",
    description: "",
    weight: "",
    pickup_address: "",
    destination_address: "",
    pickup_lat: "",
    pickup_lng: "",
    destination_lat: "",
    destination_lng: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      };

      // Add coordinates if provided
      if (formData.pickup_lat && formData.pickup_lng) {
        data.pickup_lat = parseFloat(formData.pickup_lat);
        data.pickup_lng = parseFloat(formData.pickup_lng);
      }

      if (formData.destination_lat && formData.destination_lng) {
        data.destination_lat = parseFloat(formData.destination_lat);
        data.destination_lng = parseFloat(formData.destination_lng);
      }

      const response = await orderAPI.create(data);
      toast.success("Order created successfully!");
      navigate(`/orders/${response.data.order.id}`);
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create order";
      toast.error(message);
    }

    setLoading(false);
  };

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
                  placeholder="e.g., Documents, Electronics, Clothes"
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
                  placeholder="Describe your parcel..."
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
                  placeholder="e.g., 2.5"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Address *
                  </label>
                  <input
                    type="text"
                    name="pickup_address"
                    value={formData.pickup_address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 123 Main St, Nairobi"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lat
                    </label>
                    <input
                      type="number"
                      name="pickup_lat"
                      value={formData.pickup_lat}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lng
                    </label>
                    <input
                      type="number"
                      name="pickup_lng"
                      value={formData.pickup_lng}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Address *
                  </label>
                  <input
                    type="text"
                    name="destination_address"
                    value={formData.destination_address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 456 Oak Ave, Nairobi"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lat
                    </label>
                    <input
                      type="number"
                      name="destination_lat"
                      value={formData.destination_lat}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lng
                    </label>
                    <input
                      type="number"
                      name="destination_lng"
                      value={formData.destination_lng}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> You can enter coordinates (lat/lng)
                  for more accurate tracking. If not provided, we'll geocode the
                  addresses automatically.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 disabled:bg-orange-300"
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
