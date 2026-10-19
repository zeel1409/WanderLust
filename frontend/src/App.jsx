import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ListingDetail from './pages/ListingDetail';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import Profile from './pages/Profile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <DarkModeProvider>
      <WishlistProvider>
        <AuthProvider>
          {/* Top-level boundary — catches anything that slips through */}
          <ErrorBoundary>
            <BrowserRouter>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  },
                  success: {
                    iconTheme: { primary: '#FF385C', secondary: '#fff' },
                    style: {
                      background: '#fff',
                      color: '#111827',
                      border: '1px solid #fce7eb',
                    },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#fff' },
                    style: {
                      background: '#fff',
                      color: '#111827',
                      border: '1px solid #fee2e2',
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
                <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
                <Route path="/signup" element={<ErrorBoundary><Signup /></ErrorBoundary>} />
                <Route path="/listings/new" element={<ErrorBoundary><ProtectedRoute><AddListing /></ProtectedRoute></ErrorBoundary>} />
                <Route path="/listings/:id" element={<ErrorBoundary><ListingDetail /></ErrorBoundary>} />
                <Route path="/listings/:id/edit" element={<ErrorBoundary><ProtectedRoute><EditListing /></ProtectedRoute></ErrorBoundary>} />
                <Route path="/profile" element={<ErrorBoundary><ProtectedRoute><Profile /></ProtectedRoute></ErrorBoundary>} />
                <Route path="/terms" element={<ErrorBoundary><TermsOfService /></ErrorBoundary>} />
                <Route path="/privacy" element={<ErrorBoundary><PrivacyPolicy /></ErrorBoundary>} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </WishlistProvider>
    </DarkModeProvider>
  );
}

export default App;
