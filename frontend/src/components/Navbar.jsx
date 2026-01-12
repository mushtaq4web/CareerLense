import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="text-xl font-display font-bold text-gradient">CareerLense</span>
                        </Link>

                        <div className="hidden md:flex space-x-1">
                            <Link
                                to="/dashboard"
                                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/resumes"
                                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
                            >
                                Resumes
                            </Link>
                            <Link
                                to="/jobs"
                                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
                            >
                                Job Tracker
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
