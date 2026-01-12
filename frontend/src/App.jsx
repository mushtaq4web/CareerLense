import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeList from './pages/ResumeList';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import JobTracker from './pages/JobTracker';

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resumes"
                    element={
                        <ProtectedRoute>
                            <ResumeList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resumes/create"
                    element={
                        <ProtectedRoute>
                            <ResumeBuilder />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resumes/edit/:id"
                    element={
                        <ProtectedRoute>
                            <ResumeBuilder />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resumes/:id/preview"
                    element={
                        <ProtectedRoute>
                            <ResumePreview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <JobTracker />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#fff',
                            color: '#333',
                            fontWeight: '500',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
