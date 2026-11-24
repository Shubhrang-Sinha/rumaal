import React from 'react';
import MovieCard from './MovieCard';
import { ChevronRight } from 'lucide-react';

interface MovieGridProps {
  title: string;
  movies: any[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ title, movies }) => {
  return (
    <section className="container" style={{ padding: '6rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', letterSpacing: '-1.5px' }}>{title}</h2>
        <button style={{ color: 'var(--primary)', background: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1.05rem' }}>
          Explore All <ChevronRight size={20} />
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="glass-effect" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          borderRadius: '24px',
          color: 'var(--text-muted)',
          border: '1px solid var(--glass-border)'
        }}>
          <h3 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '0.5rem' }}>No movies found matching your filters</h3>
          <p style={{ fontSize: '0.95rem' }}>Try clearing your search query or choosing another language or genre.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '2.5rem'
        }}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieGrid;
