import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Armchair, ChevronLeft, CreditCard, Info, AlertCircle, CheckCircle2, Loader2, X, ShieldCheck } from 'lucide-react';
import { ShowAPI, SeatAPI, BookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SeatItem {
  id: number;
  seatNumber: string;
  row: string;
  col: number;
  seatType: string; // REGULAR, PREMIUM, VIP
}

const SeatSelection: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [show, setShow] = useState<any>(null);
  const [allSeats, setAllSeats] = useState<SeatItem[]>([]);
  const [availableSeatIds, setAvailableSeatIds] = useState<Set<number>>(new Set());
  const [selectedSeats, setSelectedSeats] = useState<SeatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment Modal & Idempotency State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    idempotencyKeyRef.current = null;
  }, [selectedSeats, isPaymentOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchShowAndSeats = async () => {
      try {
        setLoading(true);
        const showData = await ShowAPI.getById(Number(showId));
        setShow(showData);

        const [seatsData, availableData] = await Promise.all([
          SeatAPI.getByScreen(showData.screen.id),
          SeatAPI.getAvailableByShow(Number(showId))
        ]);

        setAllSeats(seatsData);
        setAvailableSeatIds(new Set(availableData.map((s: any) => s.id)));
      } catch (err: any) {
        console.error('Failed to load show seats:', err);
        setError('Could not load seats for this show. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      fetchShowAndSeats();
    }
  }, [showId]);

  const toggleSeat = (seat: SeatItem) => {
    if (selectedSeats.some(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatPrice = (seatType: string) => {
    const base = show?.ticketPrice || 250;
    if (seatType === 'VIP') return base + 100;
    if (seatType === 'PREMIUM') return base + 50;
    return base;
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat.seatType), 0);

  const handleProceedToPay = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = async () => {
    const currentUserId = user?.userId || (user as any)?.id;
    if (!currentUserId || !localStorage.getItem('bms_token')) {
      setPaymentError('Your session has expired. Please sign in to confirm your booking.');
      setTimeout(() => {
        navigate('/login', { state: { from: location } });
      }, 1500);
      return;
    }

    try {
      setProcessingPayment(true);
      setPaymentError('');

      // Reuse or generate idempotency key for this booking attempt
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID();
      }

      // Simulate payment processing delay (1.2 seconds)
      await new Promise(res => setTimeout(res, 1200));

      // Create Booking with retained Idempotency Key
      const booking = await BookingAPI.create({
        userId: Number(currentUserId),
        showId: Number(showId),
        seatIds: selectedSeats.map(s => s.id),
        idempotencyKey: idempotencyKeyRef.current
      });

      // Clear key on success
      idempotencyKeyRef.current = null;

      // Redirect to confirmation ticket page
      navigate(`/booking-confirmation/${booking.id}`);
    } catch (err: any) {
      console.error('Booking failed:', err);
      const status = err.response?.status;
      let detail = err.response?.data?.detail;

      if (status === 401 || status === 403) {
        detail = 'Your login session has expired. Please sign in again to complete your booking.';
        setTimeout(() => {
          navigate('/login', { state: { from: location } });
        }, 2000);
      } else if (status === 409) {
        detail = err.response?.data?.detail || 'These seats were just booked by another user. Please choose other seats.';
      } else if (!detail) {
        detail = err.response?.data?.message || err.message || 'Payment or booking could not be completed. Please try again.';
      }

      setPaymentError(detail);
      setProcessingPayment(false);

      // Refresh available seats and prune any newly unavailable seats
      try {
        const availableData = await SeatAPI.getAvailableByShow(Number(showId));
        const newAvailSet = new Set<number>(availableData.map((s: any) => s.id));
        setAvailableSeatIds(newAvailSet);

        const stillAvailable = selectedSeats.filter(s => newAvailSet.has(s.id));
        if (stillAvailable.length !== selectedSeats.length) {
          const dropped = selectedSeats.filter(s => !newAvailSet.has(s.id));
          setSelectedSeats(stillAvailable);
          setIsPaymentOpen(false);
          setError(`Some selected seats (${dropped.map(s => s.seatNumber).join(', ')}) were just booked by someone else and were removed from your selection.`);
        }
      } catch {}
    }
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-dark)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <main style={{ background: 'var(--bg-dark)', minHeight: '100vh', padding: '8rem 2rem', color: 'white', textAlign: 'center' }}>
        <Navbar />
        <AlertCircle size={48} style={{ color: '#f87171', margin: '0 auto 1.5rem' }} />
        <h2>{error || 'Show not found'}</h2>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginTop: '2rem' }}>Go Back</button>
      </main>
    );
  }

  // Group seats by row
  const rowsMap = new Map<string, SeatItem[]>();
  allSeats.forEach(seat => {
    if (!rowsMap.has(seat.row)) {
      rowsMap.set(seat.row, []);
    }
    rowsMap.get(seat.row)!.push(seat);
  });
  // Sort rows and columns
  const sortedRows = Array.from(rowsMap.keys()).sort();
  sortedRows.forEach(r => {
    rowsMap.get(r)!.sort((a, b) => a.col - b.col);
  });

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh', paddingBottom: '10rem', color: 'white' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '7rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} style={{ color: 'white', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, cursor: 'pointer', opacity: 0.8 }}>
            <ChevronLeft size={20} /> Back
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.25rem', letterSpacing: '-1px', marginBottom: '0.25rem' }}>{show.movie?.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {show.screen?.theater?.name} ({show.screen?.name}) • {show.showDate} at {show.startTime.slice(0, 5)}
            </p>
          </div>
          
          <div style={{ width: '80px' }}></div>
        </div>

        {/* Screen Indicator */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{
            width: '80%',
            height: '8px',
            background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
            boxShadow: '0 15px 30px rgba(225, 29, 72, 0.5)',
            margin: '0 auto 1.5rem',
            borderRadius: '100%'
          }}></div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 600 }}>SCREEN THIS WAY</span>
        </div>

        {/* Dynamic Seat Grid */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          alignItems: 'center',
          padding: '2.5rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '32px',
          border: '1px solid var(--glass-border)',
          overflowX: 'auto'
        }}>
          {sortedRows.map(row => (
            <div key={row} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ width: '2rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>{row}</span>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {rowsMap.get(row)!.map(seat => {
                  const isAvailable = availableSeatIds.has(seat.id);
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  const isOccupied = !isAvailable;

                  return (
                    <button
                      key={seat.id}
                      disabled={isOccupied}
                      onClick={() => toggleSeat(seat)}
                      title={`${seat.seatNumber} (${seat.seatType}) - ₹${getSeatPrice(seat.seatType)}`}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isOccupied ? '#1e293b' : isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                        border: isOccupied ? 'none' : isSelected ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition)',
                        cursor: isOccupied ? 'not-allowed' : 'pointer',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        position: 'relative'
                      }}
                      className={!isOccupied ? "hover-seat" : ""}
                    >
                      <Armchair size={18} color={isOccupied ? '#475569' : (isSelected ? 'white' : 'var(--text-muted)')} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Available', color: 'transparent', border: '1px solid var(--glass-border)' },
            { label: 'Selected', color: 'var(--primary)', border: 'none' },
            { label: 'Sold Out', color: '#1e293b', border: 'none' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: item.color, border: item.border }}></div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          <Info size={14} />
          <span>Tickets are held with pessimistic locking to eliminate double bookings.</span>
        </div>
      </div>

      {/* Floating Summary Bar */}
      {selectedSeats.length > 0 && (
        <div className="glass-effect animate-fade" style={{
          position: 'fixed',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(90%, 800px)',
          padding: '1.25rem 2.5rem',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-premium)',
          zIndex: 1001,
          border: '1px solid rgba(225, 29, 72, 0.3)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
              </div>
              <div style={{ maxHeight: '40px', overflowX: 'auto', display: 'flex', gap: '0.5rem', color: 'white', fontWeight: 600 }}>
                {selectedSeats.map(s => s.seatNumber).join(', ')}
              </div>
            </div>
            <div style={{ height: '40px', width: '1px', background: 'var(--glass-border)' }}></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Amount</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>₹{totalPrice}</div>
            </div>
          </div>
          
          <button 
            onClick={handleProceedToPay}
            className="btn-primary" 
            style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem', borderRadius: '16px', cursor: 'pointer' }}
          >
            Proceed to Pay
            <CreditCard size={20} />
          </button>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {isPaymentOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="glass-effect animate-fade" style={{
            width: '100%',
            maxWidth: '480px',
            background: '#0f172a',
            border: '1px solid var(--glass-border)',
            borderRadius: '28px',
            padding: '2.5rem',
            position: 'relative',
            boxShadow: 'var(--shadow-premium)'
          }}>
            <button 
              onClick={() => setIsPaymentOpen(false)}
              disabled={processingPayment}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '16px', 
                background: 'rgba(225, 29, 72, 0.1)', 
                color: 'var(--primary)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Secure Checkout</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Paying ₹{totalPrice} for {selectedSeats.length} ticket(s)</p>
            </div>

            {paymentError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Payment Method Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.75rem' }}>
              {(['upi', 'card', 'netbanking'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: '0.6rem 0.5rem',
                    borderRadius: '12px',
                    background: paymentMethod === method ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                    border: paymentMethod === method ? 'none' : '1px solid var(--glass-border)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {method === 'upi' ? '⚡ UPI' : method === 'card' ? '💳 Card' : '🏛️ NetBanking'}
                </button>
              ))}
            </div>

            {/* Simulated Payment Notice */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem' }}>
                <ShieldCheck size={18} />
                Demonstration Gateway (Test Mode)
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                This is a simulation environment. No real funds, card numbers, or UPI credentials are required or processed.
                Click below to finalize your ticket booking under simulated <strong>{paymentMethod.toUpperCase()}</strong> payment.
              </p>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={processingPayment}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.05rem',
                borderRadius: '16px',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {processingPayment ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing Payment & Reserving Seats...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Pay ₹{totalPrice} & Confirm
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        .hover-seat:hover {
          border-color: var(--primary) !important;
          background: rgba(225, 29, 72, 0.2) !important;
          transform: scale(1.15) translateY(-2px);
        }
      `}</style>
    </main>
  );
};

export default SeatSelection;
