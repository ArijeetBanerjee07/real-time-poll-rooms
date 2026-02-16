import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PollPage from './pages/PollPage';
import Home from './pages/Home';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) return null;
    if (!token) return <Navigate to="/login" />;

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Auth isLogin={true} />} />
                    <Route path="/signup" element={<Auth isLogin={false} />} />
                    <Route path="/poll/:pollId" element={<PollPage />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
