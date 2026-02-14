import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, ChevronDown, User, LogOut, Package, MapPin, Truck } from "lucide-react";

const Navbar = () => {
  const { user, isCustomer, isCourier, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  if (isAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 text-white p-2 rounded-xl group-hover:bg-orange-600 transition-colors">
                 <Truck size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500">
              Deliveroo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
                <div className="flex items-center gap-6">
                    {/* Role-based Links */}
                    {isCustomer && (
                        <Link to="/create-order" className="text-gray-600 hover:text-orange-500 font-medium flex items-center gap-2 transition-colors">
                             <Package size={18} /> New Order
                        </Link>
                    )}
                    {isCourier && (
                        <Link to="/courier/orders" className="text-gray-600 hover:text-orange-500 font-medium flex items-center gap-2 transition-colors">
                             <MapPin size={18} /> Deliveries
                        </Link>
                    )}

                    <div className="h-6 w-px bg-gray-200"></div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-orange-100"
                        >
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border-2 border-orange-200">
                                {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-sm font-bold text-gray-800 leading-none">{user.full_name}</p>
                                <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-gray-50 lg:hidden">
                                     <p className="text-sm font-bold text-gray-800">{user.full_name}</p>
                                     <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>
                                <Link 
                                    to="/profile" 
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <User size={18} /> My Profile
                                </Link>
                                <Link 
                                    to="/orders" 
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <Package size={18} /> My Orders
                                </Link>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-4">
             {!user ? (
                 <div className="flex flex-col gap-4">
                     <Link to="/login" className="text-center py-3 text-gray-600 font-medium bg-gray-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Login</Link>
                     <Link to="/register" className="text-center py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                 </div>
             ) : (
                 <div className="space-y-2">
                     <div className="flex items-center gap-3 px-4 py-4 bg-orange-50 rounded-xl mb-6">
                        <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold">
                            {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{user.full_name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                     </div>

                     {isCustomer && (
                         <Link to="/create-order" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                             <Package size={18} /> New Order
                         </Link>
                     )}
                     {isCourier && (
                         <Link to="/courier/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                             <Truck size={18} /> Courier Dashboard
                         </Link>
                     )}
                     <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                         <User size={18} /> My Profile
                     </Link>
                     <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                         <Package size={18} /> My Orders
                     </Link>
                     
                     <div className="h-px bg-gray-100 my-2"></div>
                     
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-left">
                         <LogOut size={18} /> Logout
                     </button>
                 </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
