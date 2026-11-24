import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/book/:showId" element={<SeatSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
