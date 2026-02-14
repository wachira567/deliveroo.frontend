import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isCustomer, isCourier, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            🚗 Deliveroo
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm">
                  <Link to="/profile" className="hover:text-orange-200 font-bold">
                    {user.full_name} ({user.role})
                  </Link>
                </span>

                {isCustomer && (
                  <Link
                    to="/create-order"
                    className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50"
                  >
                    New Order
                  </Link>
                )}

                {isCourier && (
                  <Link
                    to="/courier/orders"
                    className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50"
                  >
                    My Deliveries
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50"
                  >
                    Dashboard
                  </Link>
                )}

                <Link to="/orders" className="hover:text-orange-200">
                  My Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-orange-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
