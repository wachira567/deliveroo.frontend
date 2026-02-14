import { useEffect, useState } from "react";
import { authAPI, courierAPI } from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: "",
        phone: "",
        vehicle_type: "",
        plate_number: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRes = await authAPI.getMe();
                setUser(userRes.data);
                setEditForm({
                    full_name: userRes.data.full_name || "",
                    phone: userRes.data.phone || "",
                    vehicle_type: userRes.data.vehicle_type || "",
                    plate_number: userRes.data.plate_number || ""
                });

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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await authAPI.updateProfile(editForm);
            setUser(res.data.user);
            toast.success("Profile updated successfully");
            setShowEditModal(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update profile");
        }
    };

    if (loading) return <div className="p-8 text-center bg-gray-100 min-h-screen pt-20">Loading Profile...</div>;

    if (!user) return <div className="p-8 text-center text-red-500">Failed to load user data</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <button 
                        onClick={() => setShowEditModal(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Edit Profile
                    </button>
                </div>
                
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

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.full_name}
                                            onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input 
                                            type="text" 
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                    {user.role === 'courier' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                                                <select 
                                                    value={editForm.vehicle_type}
                                                    onChange={(e) => setEditForm({...editForm, vehicle_type: e.target.value})}
                                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                                >
                                                    <option value="motorbike">Motorbike</option>
                                                    <option value="car">Car</option>
                                                    <option value="bicycle">Bicycle</option>
                                                    <option value="van">Van</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.plate_number}
                                                    onChange={(e) => setEditForm({...editForm, plate_number: e.target.value})}
                                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                                    >
                                        Save Changes
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
