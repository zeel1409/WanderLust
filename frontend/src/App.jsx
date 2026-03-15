import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ListingDetail from './pages/ListingDetail';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import Profile from './pages/Profile';

function App() {
  return (
    <DarkModeProvider>
      <WishlistProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem' },
              }}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/listings/new" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
              <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </WishlistProvider>
    </DarkModeProvider>
  );
}

export default App;
