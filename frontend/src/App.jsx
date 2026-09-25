import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedUserRoute, ProtectedAdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import InteractiveMap from './pages/InteractiveMap';
import DayPlanner from './pages/DayPlanner';
import SavedPlans from './pages/SavedPlans';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/map" element={<InteractiveMap />} />
                  <Route path="/planner" element={<DayPlanner />} />

                  {/* Protected User Routes (Registered Tourists) */}
                  <Route
                    path="/saved-plans"
                    element={
                      <ProtectedUserRoute>
                        <SavedPlans />
                      </ProtectedUserRoute>
                    }
                  />

                  {/* Protected Admin Routes (Administrators Only) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;