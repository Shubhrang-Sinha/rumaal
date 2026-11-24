import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookingAPI } from '../services/api';
import { CheckCircle2, Calendar, MapPin, Ticket, AlertCircle, ArrowRight, ShieldCheck, Printer } from 'lucide-react';

const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBooking = async () => {
      try {
        if (id) {
          const data = await BookingAPI.getById(Number(id));
          setBooking(data);
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-dark)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <main style={{ background: 'var(--bg-dark)', minHeight: '100vh', padding: '8rem 2rem', color: 'white', textAlign: 'center' }}>
        <Navbar />
        <h2>Booking details could not be retrieved.</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>Return to Movies</Link>
      </main>
    );
  }

  const movie = booking.show?.movie;
  const show = booking.show;
  const screen = show?.screen;
  const theater = screen?.theater;
  const isConfirmed = booking.status === 'CONFIRMED';

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '6rem', maxWidth: '750px' }}>
        {/* Status Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isConfirmed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isConfirmed ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            {isConfirmed ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
            {isConfirmed ? 'Booking Confirmed!' : `Booking ${booking.status || 'Cancelled'}`}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            {isConfirmed 
              ? "We've sent your tickets and invoice to your registered email." 
              : "This reservation is no longer active. Seats have been returned to available inventory."}
          </p>
        </div>

        {/* Boarding Pass Style E-Ticket */}
        <div className="glass-effect animate-fade" style={{
          borderRadius: '32px',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-premium)',
          background: '#0f172a'
        }}>
          {/* Top Banner */}
          <div style={{
            padding: '2rem',
            background: isConfirmed 
              ? 'linear-gradient(to right, rgba(225, 29, 72, 0.15), rgba(15, 23, 42, 0.8))'
              : 'linear-gradient(to right, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.8))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--glass-border)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              {movie?.posterUrl && (
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  style={{ width: '70px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                />
              )}
              <div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '3px 10px', 
                  borderRadius: '6px', 
                  background: isConfirmed ? 'var(--primary)' : 'rgba(239, 68, 68, 0.3)', 
                  color: isConfirmed ? 'white' : '#f87171', 
                  fontWeight: 700 
                }}>
                  {booking.status || 'CONFIRMED'}
                </span>
                <h2 style={{ fontSize: '1.6rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{movie?.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{movie?.genre} • {movie?.language}</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Booking ID</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>#{booking.id}</div>
            </div>
          </div>

          {/* Ticket Information Details */}
          <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Calendar size={14} className="text-primary" /> DATE & TIME
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{show?.showDate}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{show?.startTime ? show.startTime.slice(0, 5) : ''}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <MapPin size={14} className="text-primary" /> CINEMA & SCREEN
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{theater?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{screen?.name} • {theater?.address}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Ticket size={14} className="text-primary" /> SEATS ALLOTTED
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                {booking.seats?.map((s: any) => s.seatNumber).join(', ')}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{booking.seats?.length} Ticket(s)</div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={14} className="text-primary" /> AMOUNT PAID
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80' }}>
                ₹{booking.totalPrice}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Inclusive of Taxes</div>
            </div>
          </div>

          {/* QR Code Entry Gate Scanner - rendered only for CONFIRMED bookings */}
          {isConfirmed && (
            <div style={{
              padding: '2rem 2.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderTop: '1px dashed var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>Scan at Cinema Turnstile</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '350px' }}>
                  Please show this digital QR pass at the entrance. No printout needed.
                </p>
              </div>

              <div style={{
                background: 'white',
                padding: '0.75rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=BMS-BOOKING-${booking.id}-${booking.show?.id || 'SHOW'}`}
                  alt={`Check-in QR Pass for Booking #${booking.id}`}
                  style={{ width: '90px', height: '90px', display: 'block' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.print()} 
            className="btn-glass" 
            style={{ 
              padding: '0.9rem 2rem', 
              borderRadius: '16px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'white' 
            }}
          >
            <Printer size={18} /> Print / Save E-Pass
          </button>
          <Link to="/my-bookings" className="btn-glass" style={{ padding: '0.9rem 2rem', borderRadius: '16px', textDecoration: 'none' }}>
            View in My Bookings
          </Link>
          <Link to="/" className="btn-primary" style={{ padding: '0.9rem 2rem', borderRadius: '16px', textDecoration: 'none' }}>
            Book Another Movie <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default BookingConfirmation;
