import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const MyBookings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');

  const fetchBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setFetchError(null);
      const data = await BookingAPI.getByUser(user.userId);
      setBookings(data);
    } catch (err: any) {
      console.error('Failed to load user bookings:', err);
      if (err.response?.status === 401) {
        navigate('/login', { state: { message: 'Your session has expired. Please sign in again.' } });
        return;
      }
      setFetchError(err.response?.data?.detail || err.message || 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [user, isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId: number) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking? Your seats will be released back to the theater.');
    if (!confirmCancel) return;

    try {
      setCancellingId(bookingId);
      setActionError('');
      const updated = await BookingAPI.cancel(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: updated.status } : b));
    } catch (err: any) {
      console.error('Cancellation failed:', err);
      setActionError(err.response?.data?.detail || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Ticket className="text-primary" size={32} /> My Bookings & Tickets
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
              Manage your cinema reservations and digital passes
            </p>
          </div>

          <Link to="/" className="btn-glass" style={{ borderRadius: '14px', textDecoration: 'none' }}>
            Browse Movies
          </Link>
        </div>

        {actionError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '1rem',
            color: '#f87171',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}>
            <AlertCircle size={18} />
            <span>{actionError}</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '6rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : fetchError ? (
          <div style={{
            padding: '4rem 2rem',
            borderRadius: '32px',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center'
          }}>
            <AlertCircle size={48} style={{ color: '#f87171', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#f87171' }}>Failed to Load Bookings</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>
              {fetchError}
            </p>
            <button onClick={fetchBookings} className="btn-primary" style={{ display: 'inline-flex', borderRadius: '16px' }}>
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            padding: '5rem 2rem',
            borderRadius: '32px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            textAlign: 'center'
          }}>
            <Ticket size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem', opacity: 0.4 }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>No Bookings Found</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>
              You haven't reserved any movie tickets yet. Pick an exciting movie and reserve your seats now!
            </p>
            <Link to="/" className="btn-primary" style={{ display: 'inline-flex', borderRadius: '16px', textDecoration: 'none' }}>
              Explore Movies <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {bookings.map((b) => {
              const movie = b.show?.movie;
              const show = b.show;
              const theater = show?.screen?.theater;
              const isConfirmed = b.status === 'CONFIRMED';

              return (
                <div 
                  key={b.id} 
                  className="glass-effect animate-fade"
                  style={{
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    padding: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    background: '#0f172a'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                    {movie?.posterUrl && (
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        style={{ width: '90px', height: '130px', borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                      />
                    )}
                    <div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          padding: '3px 10px', 
                          borderRadius: '6px',
                          background: isConfirmed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isConfirmed ? '#4ade80' : '#f87171',
                          border: isConfirmed ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                          {b.status}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{b.id}</span>
                      </div>

                      <h3 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{movie?.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <MapPin size={15} className="text-primary" /> {theater?.name} ({show?.screen?.name})
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={15} className="text-primary" /> {show?.showDate} at {show?.startTime ? show.startTime.slice(0, 5) : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Seats</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                        {b.seats?.map((s: any) => s.seatNumber).join(', ') || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Amount</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isConfirmed ? 'var(--primary)' : 'var(--text-muted)' }}>
                        ₹{b.totalPrice}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <Link 
                        to={`/booking-confirmation/${b.id}`} 
                        className="btn-glass"
                        style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.9rem', textDecoration: 'none' }}
                      >
                        View Ticket
                      </Link>

                      {isConfirmed && (
                        <button 
                          onClick={() => handleCancelBooking(b.id)}
                          disabled={cancellingId === b.id}
                          style={{
                            padding: '0.65rem 1.25rem',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'var(--transition)'
                          }}
                        >
                          {cancellingId === b.id ? (
                            <>
                              <Loader2 size={14} className="animate-spin" /> Cancelling...
                            </>
                          ) : (
                            'Cancel'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default MyBookings;
