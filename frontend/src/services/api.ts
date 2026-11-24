import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Bearer token into outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bms_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens & unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || (error.response?.status === 403 && localStorage.getItem('bms_token'))) {
      console.warn('Session expired or unauthorized (401/403). Clearing stale credentials.');
      localStorage.removeItem('bms_token');
      localStorage.removeItem('bms_user');
    }
    return Promise.reject(error);
  }
);

export const MovieAPI = {
  getAll: async () => {
    const response = await api.get('/movies?size=50&sort=releaseDate,desc');
    return Array.isArray(response.data) ? response.data : (response.data?.content ?? response.data);
  },
  getById: async (id: number) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/movies/search?title=${query}`);
    return Array.isArray(response.data) ? response.data : (response.data?.content ?? response.data);
  },
  syncTmdb: async (apiKey?: string, region: string = 'IN') => {
    const response = await api.post('/movies/sync-tmdb', { apiKey, region });
    return response.data;
  },
  getTmdbStatus: async () => {
    const response = await api.get('/movies/tmdb-status');
    return response.data;
  }
};

export const CityAPI = {
  getAll: async () => {
    const response = await api.get('/cities');
    return response.data;
  }
};

export const ShowAPI = {
  getByMovie: async (movieId: number) => {
    const response = await api.get(`/shows/movie/${movieId}`);
    return response.data;
  },
  getById: async (showId: number) => {
    const response = await api.get(`/shows/${showId}`);
    return response.data;
  }
};

export const SeatAPI = {
  getByScreen: async (screenId: number) => {
    const response = await api.get(`/seats/screen/${screenId}`);
    return response.data;
  },
  getAvailableByShow: async (showId: number) => {
    const response = await api.get(`/bookings/show/${showId}/available-seats`);
    return response.data;
  }
};

export const BookingAPI = {
  create: async (payload: { userId: number; showId: number; seatIds: number[]; idempotencyKey?: string }) => {
    const response = await api.post('/bookings', payload, {
      headers: payload.idempotencyKey ? { 'Idempotency-Key': payload.idempotencyKey } : {}
    });
    return response.data;
  },
  getById: async (bookingId: number) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },
  getByUser: async (userId: number) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return Array.isArray(response.data) ? response.data : (response.data?.content ?? response.data);
  },
  cancel: async (bookingId: number) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};

export default api;
