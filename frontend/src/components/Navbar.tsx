import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Ticket, ChevronDown, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CityAPI } from '../services/api';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('bms_selected_city') || 'Mumbai');
  const navigate = useNavigate();

  useEffect(() => {
    CityAPI.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCities(data);
      }
    }).catch(() => {});
  }, []);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    localStorage.setItem('bms_selected_city', cityName);
    setCityDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('bms_city_changed', { detail: cityName }));
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="glass-effect" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1.5rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img 
              src="/rumaal-logo.png" 
              alt="Rumaal" 
              style={{
                height: '54px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
              }}
            />
          </Link>

          {/* City Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="btn-glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '100px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)'
              }}
              title="Select City"
            >
              <MapPin size={14} style={{ color: 'var(--primary)' }} />
              <span>{selectedCity}</span>
              <ChevronDown size={13} style={{ opacity: 0.7 }} />
            </button>

            {cityDropdownOpen && (
              <div className="glass-effect animate-fade" style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                width: '180px',
                background: '#0f172a',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '0.5rem',
                boxShadow: 'var(--shadow-premium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                zIndex: 1002
              }}>
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Popular Cities
                </div>
                {(cities.length > 0 ? cities : [
                  { id: 1, name: 'Mumbai' },
                  { id: 2, name: 'Delhi' },
                  { id: 3, name: 'Bangalore' },
                  { id: 4, name: 'Hyderabad' },
                  { id: 5, name: 'Chennai' }
                ]).map((city: any) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: selectedCity === city.name ? 'rgba(225, 29, 72, 0.15)' : 'none',
                      color: selectedCity === city.name ? 'var(--primary)' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: selectedCity === city.name ? 700 : 500,
                      textAlign: 'left',
                      width: '100%'
                    }}
                    className="hover-highlight"
                  >
                    <span>{city.name}</span>
                    {selectedCity === city.name && <span style={{ fontSize: '0.75rem' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="nav-links">
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', opacity: 0.8 }}>Movies</Link>
            {isAuthenticated && (
              <Link to="/my-bookings" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', opacity: 0.8 }}>My Bookings</Link>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative' }}>
            {isAuthenticated && user ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn-glass"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '100px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name || user.email.split('@')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="glass-effect animate-fade" style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    width: '200px',
                    background: '#0f172a',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-premium)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    zIndex: 1001
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                    </div>
                    <Link 
                      to="/my-bookings" 
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.75rem',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        transition: 'var(--transition)'
                      }}
                      className="hover-highlight"
                    >
                      <Ticket size={16} /> My Bookings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.75rem',
                        color: '#f87171',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%'
                      }}
                      className="hover-highlight"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', textDecoration: 'none' }}>
                <User size={18} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
