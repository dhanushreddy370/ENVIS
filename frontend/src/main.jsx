import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';
import BootSequence from './components/BootSequence';

import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [booting, setBooting] = useState(true);

  // Use state from AuthContext
  const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) return null; // Avoid route flashes

    const ProtectedRoute = ({ children }) => {
      return user ? children : <Navigate to="/welcome" />;
    };

    const PublicRoute = ({ children }) => {
      return user ? <Navigate to="/" /> : children;
    };

    return (
      <AnimatePresence mode="wait">
        {booting ? (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            <BootSequence onComplete={() => setBooting(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="min-h-screen"
          >
            <Router>
              <Routes>
                <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Auth isLogin={true} /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><Auth isLogin={false} /></PublicRoute>} />

                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/welcome" />} />
              </Routes>
            </Router>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        className: 'glass-panel text-white',
        style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <AppRoutes />
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
