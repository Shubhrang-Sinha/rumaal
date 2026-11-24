import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MovieAPI, ShowAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Clock, Star, ChevronLeft, MapPin, Ticket, AlertCircle } from 'lucide-react';
import { MOVIE_CAST_REGISTRY, getPersonAvatar, type CastMember } from '../data/castData';

interface ShowItem {
  id: number;
  showDate: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  screen: {
    id: number;
    name: string;
    totalSeats: number;
    theater: {
      id: number;
      name: string;
      address: string;
      city?: { name: string };
    };
  };
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [shows, setShows] = useState<ShowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    setLoading(true);
    setMovie(null);
    setShows([]);
    setSelectedDate('');

    const fetchMovieAndShows = async () => {
      try {
        const [movieData, showsData] = await Promise.all([
          MovieAPI.getById(Number(id)),
          ShowAPI.getByMovie(Number(id)).catch(() => [])
        ]);
        if (cancelled) return;
        setMovie(movieData);
        setShows(showsData);

        if (showsData && showsData.length > 0) {
          // Default to the first available show date
          const dates = Array.from(new Set(showsData.map((s: ShowItem) => s.showDate))).sort();
          if (dates.length > 0 && !cancelled) {
            setSelectedDate(dates[0] as string);
          }
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchMovieAndShows();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-dark)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)', color: 'white' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f87171' }}>Movie not found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The requested movie could not be found or has been removed.</p>
          <Link to="/" className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none' }}>
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  // Get distinct show dates
  const availableDates = Array.from(new Set(shows.map((s) => s.showDate))).sort() as string[];

  // Filter shows for currently selected date
  const showsForDate = shows.filter((s) => s.showDate === selectedDate);

  // Group shows by Theater
  const theatersMap = new Map<number, { theater: any; screens: Map<number, { screen: any; shows: ShowItem[] }> }>();
  showsForDate.forEach((show) => {
    if (!show?.screen?.theater?.id) return;
    const tId = show.screen.theater.id;
    if (!theatersMap.has(tId)) {
      theatersMap.set(tId, {
        theater: show.screen.theater,
        screens: new Map()
      });
    }
    const tEntry = theatersMap.get(tId)!;
    const sId = show.screen?.id || 0;
    if (!tEntry.screens.has(sId)) {
      tEntry.screens.set(sId, { screen: show.screen, shows: [] });
    }
    tEntry.screens.get(sId)!.shows.push(show);
  });

  const movieCast: CastMember[] = (movie?.title && MOVIE_CAST_REGISTRY[movie.title])
    ? MOVIE_CAST_REGISTRY[movie.title]
    : [];

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      
      {/* Dynamic Hero Section */}
      <div style={{ position: 'relative', width: '100%', minHeight: '65vh', display: 'flex', alignItems: 'flex-end', paddingTop: '100px' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to top, var(--bg-dark) 0%, rgba(2, 6, 23, 0.7) 50%, rgba(2, 6, 23, 0.5) 100%), url(${movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'blur(0px)',
          zIndex: -1
        }}></div>

        <div className="container" style={{ paddingBottom: '3rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', opacity: 0.8, fontWeight: 500 }} className="hover-push">
            <ChevronLeft size={20} /> Back to Movies
          </Link>
          
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-end' }} className="movie-header">
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="animate-fade"
                style={{ 
                  width: '240px', 
                  borderRadius: '20px', 
                  boxShadow: 'var(--shadow-premium)', 
                  border: '1px solid var(--glass-border)',
                  aspectRatio: '2/3',
                  objectFit: 'cover'
                }} 
              />
            </div>

            <div style={{ paddingBottom: '0.5rem', flex: 1 }} className="animate-fade">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {movie.genre && movie.genre.split('/').map((g: string) => (
                  <span key={g} style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>{g}</span>
                ))}
              </div>
              <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-1.5px' }}>{movie.title}</h1>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: 'var(--accent)', color: 'var(--bg-dark)', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '1rem' }}>
                    <Star size={14} fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    {movie.rating}
                  </div>
                </div>
                
                {movie.durationMinutes && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>
                    <Clock size={18} className="text-primary" /> {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m
                  </span>
                )}
                {movie.releaseDate && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>
                    <Calendar size={18} className="text-primary" /> {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                <span style={{ fontSize: '0.9rem', background: 'var(--glass)', padding: '4px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>{movie.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Ticket className="text-primary" size={28} /> Select Showtimes
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Pick a date and cinema hall to choose your seats
              </p>
            </div>

            {/* Date Selector Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {availableDates.map((dateStr) => {
                const isSelected = dateStr === selectedDate;
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className="hover-scale"
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '16px',
                      background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    {formatDisplayDate(dateStr)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theaters List */}
          {theatersMap.size === 0 ? (
            <div style={{
              padding: '3rem',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--glass-border)',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <AlertCircle size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem' }}>No showtimes currently scheduled for this date.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Please select another date above.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Array.from(theatersMap.values()).map(({ theater, screens }) => (
                <div 
                  key={theater.id} 
                  className="glass-effect" 
                  style={{
                    padding: '2rem',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--shadow-premium)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={18} className="text-primary" /> {theater.name}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '1.65rem' }}>
                        {theater.address} {theater.city?.name ? `• ${theater.city.name}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Screens inside this theater */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {Array.from(screens.values()).map(({ screen, shows: screenShows }) => (
                      <div 
                        key={screen.id} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.25rem',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#cbd5e1' }}>{screen.name}</span>
                        </div>

                        {/* Clickable Showtimes */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          {screenShows.map((s) => (
                            <Link
                              key={s.id}
                              to={`/book/${s.id}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <div 
                                className="hover-scale"
                                style={{
                                  padding: '0.6rem 1.25rem',
                                  borderRadius: '12px',
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid var(--glass-border)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '2px',
                                  cursor: 'pointer',
                                  transition: 'var(--transition)'
                                }}
                              >
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>
                                  {formatTime(s.startTime)}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  ₹{s.ticketPrice}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Synopsis and Cast */}
      <div className="container" style={{ padding: '4rem 0' }}>
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '-0.5px' }}>Synopsis</h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '900px' }}>
            {movie.description}
          </p>
        </section>

        {movieCast && movieCast.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>Cast & Crew</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1.5rem' }}>
              {movieCast.map((person, i) => (
                <div key={i} style={{ textAlign: 'center', minWidth: '130px', position: 'relative' }}>
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    marginBottom: '0.75rem',
                    border: person.department === 'Directing' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    margin: '0 auto',
                    position: 'relative'
                   }}>
                    <img 
                      src={person.img} 
                      alt={person.name} 
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = getPersonAvatar(person.name);
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    {person.department === 'Directing' && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(225, 29, 72, 0.9)',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '2px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        DIRECTOR
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', color: 'white' }}>{person.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{person.role}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
      
      <style>{`
        .movie-header {
          @media (max-width: 968px) {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .text-primary { color: var(--primary); }
        .hover-push:hover { transform: translateX(-5px); }
        .hover-scale:hover {
          border-color: var(--primary) !important;
          background: rgba(225, 29, 72, 0.15) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
};

export default MovieDetail;
