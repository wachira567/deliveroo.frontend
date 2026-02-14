import { useEffect, useState } from "react";
import { authAPI, courierAPI } from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRes = await authAPI.getMe();
                setUser(userRes.data);

                if (userRes.data.role === 'courier') {
                    const statsRes = await courierAPI.getStats();
                    setStats(statsRes.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center bg-gray-100 min-h-screen pt-20">Loading Profile...</div>;

    if (!user) return <div className="p-8 text-center text-red-500">Failed to load user data</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
                
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {user.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 border-t pt-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="font-medium text-lg">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                            <p className="font-medium text-lg">{user.phone || 'Not provided'}</p>
                        </div>
                        {user.role === 'courier' && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Vehicle Type</p>
                                    <p className="font-medium text-lg capitalize">{user.vehicle_type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Plate Number</p>
                                    <p className="font-medium text-lg">{user.plate_number}</p>
                                </div>
                            </>
                        )}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Member Since</p>
                            <p className="font-medium text-lg">
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500 mb-1">Account Status</p>
                             <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                {user.role === 'courier' && stats && (
                    <div>
                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance & Earnings</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-200">
                                 <p className="text-gray-500 mb-2 font-medium">Total Deliveries</p>
                                 <p className="text-4xl font-bold text-blue-600">{stats.delivered_orders}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 transform hover:scale-105 transition-transform duration-200">
                                 <p className="text-gray-500 mb-2 font-medium">Total Earnings</p>
                                 <p className="text-4xl font-bold text-green-600">KSH {stats.earnings.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500 transform hover:scale-105 transition-transform duration-200">
                                 <p className="text-gray-500 mb-2 font-medium">Active Orders</p>
                                 <p className="text-4xl font-bold text-yellow-600">{stats.in_transit_orders}</p>
                            </div>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
