import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, Key, Globe, ExternalLink, Loader2 } from 'lucide-react';
import { MovieAPI } from '../services/api';

interface TmdbSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

const TmdbSyncModal: React.FC<TmdbSyncModalProps> = ({ isOpen, onClose, onSyncComplete }) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tmdb_api_key') || '');
  const [region, setRegion] = useState('IN');
  const [loading, setLoading] = useState(false);
  const [isBackendConfigured, setIsBackendConfigured] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string; count?: number }>({
    type: 'idle',
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      MovieAPI.getTmdbStatus().then(res => {
        if (res?.configured) {
          setIsBackendConfigured(true);
          setStatus({ type: 'idle', message: 'Backend default TMDB key is active. You may sync directly or enter an override key.' });
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey && !isBackendConfigured) {
      setStatus({ type: 'error', message: 'Please enter your TMDB API Key.' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'idle', message: '' });
      if (apiKey) {
        localStorage.setItem('tmdb_api_key', apiKey.trim());
      }

      const res = await MovieAPI.syncTmdb(apiKey.trim(), region);
      setStatus({
        type: 'success',
        message: res.message || 'Successfully synced live in-theatre releases!',
        count: res.syncedCount
      });
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err: any) {
      console.error('TMDB Sync failed:', err);
      const detail = err.response?.data?.detail || err.message || 'Failed to connect to TMDB. Please check your API key.';
      setStatus({ type: 'error', message: detail });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        maxWidth: '520px',
        background: '#0f172a',
        border: '1px solid var(--glass-border)',
        borderRadius: '28px',
        padding: '2.5rem',
        position: 'relative',
        boxShadow: 'var(--shadow-premium)',
        color: 'white'
      }}>
        <button 
          onClick={onClose}
          disabled={loading}
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
            width: '54px', 
            height: '54px', 
            borderRadius: '16px', 
            background: 'rgba(225, 29, 72, 0.12)', 
            color: 'var(--primary)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <RefreshCw size={28} className={loading ? 'animate-spin' : ''} />
          </div>
          <h2 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px', marginBottom: '0.4rem' }}>
            Live Theatrical Movie Sync
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Pulls verified movies currently running in cinemas directly from the <strong>The Movie Database (TMDB)</strong> API.
          </p>
        </div>

        {status.type === 'success' && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '1rem',
            color: '#4ade80',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle2 size={20} />
            <div>
              <div style={{ fontWeight: 700 }}>Sync Successful!</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{status.message}</div>
            </div>
          </div>
        )}

        {status.type === 'error' && (
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
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: 700 }}>Sync Error</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{status.message}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSync} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label htmlFor="tmdb-api-key" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                TMDB API Key (v3 auth)
              </label>
              <a 
                href="https://www.themoviedb.org/settings/api" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                Get Free Key <ExternalLink size={12} />
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                id="tmdb-api-key"
                type="text" 
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder={isBackendConfigured ? "Backend key active (or enter override key)" : "Enter 32-character TMDB API Key"}
                required={!isBackendConfigured}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 3rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Your key is saved locally in your browser for 1-click refreshes.
            </p>
          </div>

          <div>
            <label htmlFor="tmdb-theatrical-region" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
              Theatrical Region
            </label>
            <div style={{ position: 'relative' }}>
              <Globe size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select
                id="tmdb-theatrical-region"
                value={region}
                onChange={e => setRegion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 3rem',
                  background: '#1e293b',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              >
                <option value="IN">India (IN) — Bollywood, Tollywood, Kollywood, Pan-India</option>
                <option value="US">United States (US) — Hollywood Blockbusters</option>
                <option value="GB">United Kingdom (GB)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.95rem',
              fontSize: '1rem',
              borderRadius: '16px',
              justifyContent: 'center',
              marginTop: '0.5rem',
              cursor: 'pointer'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Fetching & Syncing Theaters...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Sync Live In-Theatres Movies
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TmdbSyncModal;
