import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeList from './pages/ResumeList';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import JobTracker from './pages/JobTracker';
import Analytics from './pages/Analytics';
import InterviewPrep from './pages/InterviewPrep';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/interview-prep"
                    element={
                        <ProtectedRoute>
                            <InterviewPrep />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />
            </Routes>
        </>
    );
}

function AppContent() {
    const { isDark } = useTheme();

    return (
        <>
            <AppRoutes />
            <ThemeToggle />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: isDark ? '#0f172a' : '#fff',
                        color: isDark ? '#e2e8f0' : '#333',
                        fontWeight: '500',
                        border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                        boxShadow: isDark ? '0 10px 25px rgba(2,6,23,0.45)' : '0 10px 25px rgba(0,0,0,0.1)',
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
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
