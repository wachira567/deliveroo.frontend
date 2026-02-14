import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, isCustomer, isCourier, isAdmin, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fast & Reliable Parcel Delivery
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Send packages anywhere, anytime with Deliveroo
          </p>

          {!isAuthenticated ? (
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-50 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="text-xl">
              <p>Welcome back, {user?.full_name}!</p>
              <div className="mt-4 flex justify-center gap-4">
                {isCustomer && (
                  <Link
                    to="/create-order"
                    className="bg-white text-orange-500 px-6 py-2 rounded-lg font-medium hover:bg-orange-50"
                  >
                    Create New Order
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="border-2 border-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600"
                >
                  View Orders
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Deliveroo?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Quick and efficient delivery services tailored to your needs
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Real-time Tracking
            </h3>
            <p className="text-gray-600">
              Track your parcel in real-time with our live GPS system
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Fair Pricing
            </h3>
            <p className="text-gray-600">
              Transparent pricing based on weight and distance
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-gray-800">Create Order</h3>
              <p className="text-gray-600 text-sm mt-2">
                Enter parcel details and addresses
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-gray-800">Get Matched</h3>
              <p className="text-gray-600 text-sm mt-2">
                We assign a courier to your order
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-gray-800">Track Live</h3>
              <p className="text-gray-600 text-sm mt-2">
                Watch your parcel on the map
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-gray-800">Delivery</h3>
              <p className="text-gray-600 text-sm mt-2">
                Receive your parcel at the destination
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Join thousands of satisfied customers today
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-50 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
