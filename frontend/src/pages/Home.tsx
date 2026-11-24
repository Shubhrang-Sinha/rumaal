import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import Footer from '../components/Footer';
import { MovieAPI } from '../services/api';
import { Shield, Zap, Heart, X } from 'lucide-react';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MovieAPI.getAll();
      if (Array.isArray(data)) {
        setMovies(data);
      } else {
        setMovies([]);
      }
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const availableLanguages = ['All', 'Hindi', 'English', 'Telugu', 'Tamil', 'Japanese', 'Korean'];
  const commonGenres = ['All', 'Action', 'Comedy', 'Sci-Fi', 'Thriller', 'Drama', 'Animation', 'Fantasy', 'Horror'];

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = !searchTerm || m.title?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesLang = selectedLanguage === 'All' || 
      m.language?.toLowerCase().trim() === selectedLanguage.toLowerCase().trim();
    const matchesGenre = selectedGenre === 'All' || (
      m.genre && m.genre.split(/[\/,]/).map((g: string) => g.trim().toLowerCase()).includes(selectedGenre.toLowerCase().trim())
    );
    return matchesSearch && matchesLang && matchesGenre;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('All');
    setSelectedGenre('All');
  };

  return (
    <main>
      <Navbar />
      <Hero searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <div id="now-showing-section" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
        {/* Dynamic Filter Controls */}
        <div className="container" style={{ marginBottom: '1.5rem' }}>
          <div className="glass-effect" style={{
            padding: '1.25rem 1.75rem',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {/* Language filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', minWidth: '75px' }}>
                Language:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '100px',
                      fontSize: '0.85rem',
                      fontWeight: selectedLanguage === lang ? 700 : 500,
                      background: selectedLanguage === lang ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      border: '1px solid ' + (selectedLanguage === lang ? 'var(--primary)' : 'var(--glass-border)'),
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', minWidth: '75px' }}>
                Genre:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {commonGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '100px',
                      fontSize: '0.85rem',
                      fontWeight: selectedGenre === genre ? 700 : 500,
                      background: selectedGenre === genre ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      border: '1px solid ' + (selectedGenre === genre ? 'var(--primary)' : 'var(--glass-border)'),
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {(selectedLanguage !== 'All' || selectedGenre !== 'All' || searchTerm) && (
                <button
                  onClick={resetFilters}
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading latest movies...</p>
          </div>
        ) : error ? (
          <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div className="glass-effect" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p style={{ color: '#f87171', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{error}</p>
              <button onClick={fetchMovies} className="btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: '12px' }}>
                Retry Loading Movies
              </button>
            </div>
          </div>
        ) : (
          <MovieGrid 
            title={searchTerm ? `Search Results for "${searchTerm}" (${filteredMovies.length})` : `Now Showing in Cinemas (${filteredMovies.length})`} 
            movies={filteredMovies} 
          />
        )}
      </div>
      
      {/* Value Proposition */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(to bottom, transparent, rgba(225, 29, 72, 0.05))' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>The Ultimate Cinema Experience</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
              From IMAX to 4DX, explore the most immersive ways to watch your favorite movies. 
              Exclusive offers, seamless bookings, and the best seats in the house.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Shield, title: 'Secure Booking', desc: 'Verified theaters and secure payment gateways for a worry-free experience.' },
              { icon: Zap, title: 'Instant Confirmation', desc: 'Get your m-ticket instantly on your phone with no physical printing needed.' },
              { icon: Heart, title: 'Exclusive Rewards', desc: 'Earn points on every booking and redeem them for free tickets and popcorn.' },
            ].map((feature, i) => (
              <div key={i} className="glass-effect" style={{ padding: '2.5rem', borderRadius: '24px', transition: 'var(--transition)' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '16px', 
                  background: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white'
                }}>
                  <feature.icon size={30} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
