import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Package, MapPin, Clock, ShieldCheck, ChevronRight } from "lucide-react";

const Home = () => {
  const { isAuthenticated, isCustomer, isCourier, isAdmin, user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div> {/* Optional: Add a subtle pattern if you have one, or just keep it simple */}
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-400/30 font-medium text-orange-50 text-sm backdrop-blur-sm border border-orange-400/30">
                🚀 #1 Parcel Delivery Service
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                Delivery Made <br/>
                <span className="text-orange-100">Simple & Fast.</span>
              </h1>
              <p className="text-xl md:text-2xl text-orange-100/90 max-w-lg mx-auto md:mx-0 font-light">
                Send packages anywhere, anytime. Real-time tracking, transparent pricing, and trusted couriers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 group"
                    >
                      Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="text-left w-full">
                       <p className="text-orange-100 mb-4 text-center md:text-left">Welcome back, <span className="font-bold text-white">{user?.full_name}</span>!</p>
                       <div className="flex flex-col sm:flex-row gap-4">
                          {isCustomer && (
                            <Link
                              to="/create-order"
                              className="px-8 py-3 bg-white text-orange-600 rounded-full font-bold hover:bg-orange-50 shadow-lg flex items-center justify-center gap-2"
                            >
                              <Package size={20}/> New Order
                            </Link>
                          )}
                           {isCourier && (
                              <Link
                                to="/courier/orders"
                                className="px-8 py-3 bg-white text-orange-600 rounded-full font-bold hover:bg-orange-50 shadow-lg flex items-center justify-center gap-2"
                              >
                                <Package size={20}/> Go to Dashboard
                              </Link>
                           )}
                           {isAdmin && (
                              <Link
                                to="/admin/dashboard"
                                className="px-8 py-3 bg-white text-orange-600 rounded-full font-bold hover:bg-orange-50 shadow-lg flex items-center justify-center gap-2"
                              >
                                Admin Dashboard
                              </Link>
                           )}
                          <Link
                            to="/orders"
                            className="px-8 py-3 bg-orange-700/50 text-white rounded-full font-bold hover:bg-orange-700/70 backdrop-blur-sm flex items-center justify-center"
                          >
                            My Orders
                          </Link>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Visual element / Illustration placeholder */}
            <div className="md:w-1/2 relative hidden md:block">
                <div className="relative z-10 w-full h-[500px] bg-orange-400/20 rounded-3xl backdrop-blur-sm border border-white/20 p-6 flex flex-col justify-center items-center shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                     {/* Abstract UI representation */}
                     <div className="w-full bg-white/90 rounded-xl shadow-lg p-4 mb-4 max-w-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                                <Package size={20} />
                            </div>
                            <div>
                                <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                                <div className="h-2 w-16 bg-gray-100 rounded"></div>
                            </div>
                            <div className="ml-auto text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded">In Transit</div>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg w-full relative overflow-hidden">
                           <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <MapPin size={32} />
                           </div>
                           {/* Simulated route line */}
                            <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none">
                                <path d="M 20 80 Q 150 20 280 80" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                            </svg>
                        </div>
                     </div>
                     <div className="w-full bg-white/90 rounded-xl shadow-lg p-4 max-w-sm transform translate-x-8">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                <div>
                                    <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-2 w-12 bg-gray-100 rounded"></div>
                                </div>
                             </div>
                             <div className="h-8 w-24 bg-orange-500 rounded-lg"></div>
                         </div>
                     </div>
                </div>
            </div>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
             <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 120L1440 120L1440 60C1440 60 1120 0 720 0C320 0 0 60 0 60L0 120Z" fill="white"/>
            </svg>
        </div>
      </div>

      {/* Stats/Trust Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">10k+</p>
                <p className="text-gray-500 text-sm">Parcels Delivered</p>
            </div>
             <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">99%</p>
                <p className="text-gray-500 text-sm">On-Time Rate</p>
            </div>
             <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">24/7</p>
                <p className="text-gray-500 text-sm">Support</p>
            </div>
             <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">4.9/5</p>
                <p className="text-gray-500 text-sm">User Rating</p>
            </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 mb-20">
        <div className="text-center mb-16 max-w-2xl mx-auto">
           <span className="text-orange-500 font-bold uppercase tracking-wider text-sm">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Delivery logistics specifically designed for speed.
          </h2>
          <p className="text-gray-600 text-lg">We handle the heavy lifting so you can focus on what matters most.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Clock className="w-8 h-8 text-orange-500" />}
            title="Instant Delivery"
            description="Our smart algorithms match you with the nearest courier instantly for pickup within minutes."
          />
          <FeatureCard 
            icon={<MapPin className="w-8 h-8 text-orange-500" />}
            title="Real-time Tracking"
            description="Follow your package every step of the way with our live GPS tracking interface."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-orange-500" />}
            title="Safe & Secure"
            description="Verified couriers and a secure delivery code system ensure your package reaches safely."
          />
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-50 py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
               Simple, 4-Step Process
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Visual connector line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200"></div>

            <StepCard number="1" title="Create Order" desc="Enter pickup & drop-off details." />
            <StepCard number="2" title="Get Matched" desc="Driver assigned in seconds." />
            <StepCard number="3" title="Track Live" desc="Watch your delivery in real-time." />
            <StepCard number="4" title="Delivery" desc="Secure handover with PIN code." />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-16 -mb-16"></div>
           
           <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to ship your package?</h2>
              <p className="text-gray-300 text-xl mb-10">Join thousands of happy customers using Deliveroo today.</p>
              
              <Link
                to="/register"
                className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition hover:shadow-lg hover:shadow-orange-500/30"
              >
                Sign Up Now
              </Link>
              <p className="mt-6 text-gray-400 text-sm">No credit card required for sign up.</p>
           </div>
        </div>
      </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
      <div className="group-hover:text-white transition-colors duration-300">
          {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="flex flex-col items-center text-center relative bg-white md:bg-transparent p-6 rounded-xl shadow-md md:shadow-none">
    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-orange-50 relative z-10">
      <span className="text-3xl font-bold text-orange-500">{number}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;
