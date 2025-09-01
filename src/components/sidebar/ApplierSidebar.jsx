import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    Search,
    BookTemplateIcon,
    LogOut,
} from 'lucide-react';
import { auth } from '../../../configs/FirebaseConfig';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const navigation = [
    { name: 'Home', to: '/applier-dashboard/content', icon: Home },
    { name: 'Search', to: '/applier-dashboard/search', icon: Search },
    { name: 'Templates', to: '/applier-dashboard/template', icon: BookTemplateIcon },
];

export default function ApplierSidebar({ currentPath }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                toast.success("Logged out", {
                    position: "top-right",
                    autoClose: 1000,
                });
                localStorage.removeItem('userRole');
                setTimeout(() => navigate("/"), 1000);
            })
            .catch(() => {
                toast.error("Logout failed", {
                    position: "top-right",
                    autoClose: 1000,
                });
            });
    };

    const homePaths = ['/applier-dashboard', '/applier-dashboard/content'];

    return (
        <div className="bg-gray-100 w-64 min-h-screen py-8 px-4 flex flex-col">
            <div className="mb-8 flex gap-1 items-center justify-center">
                <img src="/logo.png" alt="Logo" height={30} width={30} />
                <h2 className="text-xl font-semibold">Hire Sense AI</h2>
            </div>

            <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                    const isHomeItem = item.name === 'Home';
                    const isActive = isHomeItem
                        ? homePaths.includes(currentPath)
                        : currentPath === item.to;

                    return (
                        <div key={item.name}>
                            <NavLink
                                to={item.to}
                                end
                                className={`group flex items-center space-x-3 p-3 rounded-md transition-all duration-200 ease-in-out ${
                                    isActive
                                        ? 'bg-primary text-white font-semibold'
                                        : 'text-gray-600 hover:bg-gray-200 hover:text-black font-semibold'
                                }`}
                            >
                                <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                                <span>{item.name}</span>
                            </NavLink>
                        </div>
                    );
                })}
            </nav>

            <div className="mt-8 border-t border-gray-200 pt-4 flex items-center justify-center">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 py-2 w-full text-base font-medium text-white bg-red-700 rounded-md hover:bg-red-600 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}
