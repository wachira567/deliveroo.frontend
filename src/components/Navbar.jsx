import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Package, ChevronDown, UserCircle } from "lucide-react";

const Navbar = () => {
  const { user, isCustomer, isCourier, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isAdmin) return null;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            🚗 Deliveroo
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                 <div className="hidden md:flex items-center gap-4">
                    {isCustomer && (
                      <Link
                        to="/create-order"
                        className="bg-orange-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-orange-600 transition shadow-md shadow-orange-500/20 flex items-center gap-2"
                      >
                         <Package size={18} /> New Order
                      </Link>
                    )}

                    {isCourier && (
                      <Link
                        to="/courier/orders"
                        className="bg-orange-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-orange-600 transition shadow-md shadow-orange-500/20"
                      >
                        Scanner Dashboard
                      </Link>
                    )}
                 </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                        {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700 hidden sm:block">{user.full_name}</span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                             <p className="text-sm font-bold text-gray-800">{user.full_name}</p>
                             <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>

                        <Link 
                            to="/profile" 
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <UserCircle size={18} /> Profile
                        </Link>
                        
                        <Link 
                            to="/orders" 
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <Package size={18} /> My Orders
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
