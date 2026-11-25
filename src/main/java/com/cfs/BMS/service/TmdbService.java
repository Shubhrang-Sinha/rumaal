package com.cfs.BMS.service;

import com.cfs.BMS.entity.Movie;
import com.cfs.BMS.entity.Screen;
import com.cfs.BMS.entity.Seat;
import com.cfs.BMS.entity.Show;
import com.cfs.BMS.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TmdbService {

    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.tmdb.api-key:}")
    private String configuredApiKey;

    @Value("${app.tmdb.region:IN}")
    private String defaultRegion;

    private static final Map<Integer, String> GENRE_MAP = Map.ofEntries(
            Map.entry(28, "Action"),
            Map.entry(12, "Adventure"),
            Map.entry(16, "Animation"),
            Map.entry(35, "Comedy"),
            Map.entry(80, "Crime"),
            Map.entry(99, "Documentary"),
            Map.entry(18, "Drama"),
            Map.entry(10751, "Family"),
            Map.entry(14, "Fantasy"),
            Map.entry(36, "History"),
            Map.entry(27, "Horror"),
            Map.entry(10402, "Music"),
            Map.entry(9648, "Mystery"),
            Map.entry(10749, "Romance"),
            Map.entry(878, "Sci-Fi"),
            Map.entry(53, "Thriller"),
            Map.entry(10752, "War"),
            Map.entry(37, "Western")
    );

    private static final Map<String, String> LANG_MAP = Map.ofEntries(
            Map.entry("hi", "Hindi"),
            Map.entry("te", "Telugu"),
            Map.entry("ta", "Tamil"),
            Map.entry("ml", "Malayalam"),
            Map.entry("kn", "Kannada"),
            Map.entry("pa", "Punjabi"),
            Map.entry("en", "English"),
            Map.entry("mr", "Marathi"),
            Map.entry("bn", "Bengali"),
            Map.entry("gu", "Gujarati"),
            Map.entry("ja", "Japanese"),
            Map.entry("ko", "Korean")
    );

    public boolean isConfigured() {
        return configuredApiKey != null && !configuredApiKey.trim().isEmpty();
    }

    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    @Transactional
    public void onStartupSync() {
        if (isConfigured()) {
            log.info("Auto-syncing live theatrical movies from TMDB on startup...");
            try {
                syncNowPlaying(null, defaultRegion);
                log.info("Startup TMDB movie sync completed successfully.");
            } catch (Exception e) {
                log.warn("Startup TMDB sync skipped or encountered an issue: {}", e.getMessage());
            }
        }
    }

    @Transactional
    public Map<String, Object> syncNowPlaying(String providedApiKey, String region) {
        String key = (providedApiKey != null && !providedApiKey.trim().isEmpty())
                ? providedApiKey.trim()
                : configuredApiKey;

        if (key == null || key.trim().isEmpty()) {
            throw new IllegalArgumentException("No TMDB API key provided. Please pass apiKey or set APP_TMDB_API_KEY.");
        }

        String targetRegion = (region != null && !region.trim().isEmpty()) ? region.trim().toUpperCase() : defaultRegion;
        boolean isBearerToken = key.startsWith("eyJ") || key.length() > 40;
        
        String url;
        RestClient.RequestHeadersSpec<?> requestSpec;
        var requestFactory = new org.springframework.http.client.JdkClientHttpRequestFactory();
        requestFactory.setReadTimeout(java.time.Duration.ofSeconds(15));
        RestClient restClient = RestClient.builder().requestFactory(requestFactory).build();

        String userAgent = "Rumaal/1.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)";
        if (isBearerToken) {
            url = String.format("https://api.themoviedb.org/3/movie/now_playing?region=%s&language=en-US&page=1", targetRegion);
            requestSpec = restClient.get()
                    .uri(url)
                    .header("Authorization", "Bearer " + key)
                    .header("Accept", "application/json")
                    .header("User-Agent", userAgent);
        } else {
            url = String.format("https://api.themoviedb.org/3/movie/now_playing?api_key=%s&region=%s&language=en-US&page=1", key, targetRegion);
            requestSpec = restClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .header("User-Agent", userAgent);
        }

        log.info("Fetching now-playing movies from TMDB for region: {} (Auth mode: {})", 
                targetRegion, isBearerToken ? "Bearer Read Access Token" : "v3 API Key");

        Map<?, ?> response;
        try {
            response = requestSpec
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Failed to connect to TMDB API: {}", e.getMessage());
            throw new RuntimeException("TMDB API request failed: " + e.getMessage());
        }

        if (response == null || !response.containsKey("results")) {
            throw new RuntimeException("Invalid response received from TMDB API.");
        }

        List<?> results = (List<?>) response.get("results");
        List<String> syncedTitles = new ArrayList<>();
        List<Screen> screens = screenRepository.findAll();
        if (screens.isEmpty()) {
            throw new IllegalStateException("No screens configured in database.");
        }

        LocalTime[] standardShowTimes = new LocalTime[]{
                LocalTime.of(10, 0),
                LocalTime.of(13, 30),
                LocalTime.of(17, 0),
                LocalTime.of(20, 30)
        };

        for (Object item : results) {
            if (!(item instanceof Map<?, ?> movieMap)) continue;

            String title = (String) movieMap.get("title");
            if (title == null || title.trim().isEmpty()) continue;

            String overview = (String) movieMap.get("overview");
            String posterPath = (String) movieMap.get("poster_path");
            String posterUrl = (posterPath != null) ? "https://image.tmdb.org/t/p/original" + posterPath : null;

            Number voteAvg = (Number) movieMap.get("vote_average");
            Double rating = voteAvg != null ? Math.round(voteAvg.doubleValue() * 10.0) / 10.0 : 7.5;

            String releaseDateStr = (String) movieMap.get("release_date");
            LocalDate releaseDate = null;
            if (releaseDateStr != null && !releaseDateStr.isEmpty()) {
                try { releaseDate = LocalDate.parse(releaseDateStr); } catch (Exception ignored) {}
            }

            // Map genres
            List<?> genreIds = (List<?>) movieMap.get("genre_ids");
            List<String> genres = new ArrayList<>();
            if (genreIds != null) {
                for (Object gid : genreIds) {
                    if (gid instanceof Number n && GENRE_MAP.containsKey(n.intValue())) {
                        genres.add(GENRE_MAP.get(n.intValue()));
                    }
                }
            }
            String genreString = genres.isEmpty() ? "Drama" : String.join("/", genres);

            // Map language
            String origLang = (String) movieMap.get("original_language");
            String language = (origLang != null && LANG_MAP.containsKey(origLang))
                    ? LANG_MAP.get(origLang)
                    : (origLang != null ? origLang.toUpperCase() : "English");

            // Duration heuristic (standard 120-160 mins)
            int duration = 120 + Math.abs(title.hashCode() % 45);

            // Extract TMDB movie ID
            Number tmdbIdNum = (Number) movieMap.get("id");
            Long tmdbId = tmdbIdNum != null ? tmdbIdNum.longValue() : null;

            // Save or update Movie entity by TMDB ID or title fallback
            Optional<Movie> existingOpt = Optional.empty();
            if (tmdbId != null) {
                existingOpt = movieRepository.findByTmdbId(tmdbId);
            }
            if (existingOpt.isEmpty()) {
                existingOpt = movieRepository.findByTitleIgnoreCase(title.trim());
            }

            Movie movie;
            if (existingOpt.isPresent()) {
                movie = existingOpt.get();
                if (tmdbId != null) movie.setTmdbId(tmdbId);
                movie.setDescription(overview);
                if (posterUrl != null) movie.setPosterUrl(posterUrl);
                movie.setRating(rating);
                movie.setGenre(genreString);
                movie.setLanguage(language);
            } else {
                movie = Movie.builder()
                        .tmdbId(tmdbId)
                        .title(title)
                        .description(overview)
                        .posterUrl(posterUrl)
                        .rating(rating)
                        .releaseDate(releaseDate != null ? releaseDate : LocalDate.now())
                        .genre(genreString)
                        .language(language)
                        .durationMinutes(duration)
                        .build();
            }
            movie = movieRepository.save(movie);
            syncedTitles.add(movie.getTitle());

            // Ensure shows exist for this movie for the next 3 days without slot collisions
            LocalDate today = LocalDate.now();
            for (int day = 0; day <= 3; day++) {
                LocalDate showDate = today.plusDays(day);
                Screen assignedScreen = screens.get(Math.abs((movie.getId().intValue() + day) % screens.size()));
                List<Show> existingShowsOnScreen = showRepository.findByScreenIdAndShowDate(assignedScreen.getId(), showDate);

                for (LocalTime time : standardShowTimes) {
                    LocalTime endTime = time.plusHours(2).plusMinutes(30);
                    // Check if slot overlaps with ANY existing show on this screen
                    boolean overlaps = existingShowsOnScreen.stream().anyMatch(s -> {
                        LocalTime sStart = s.getStartTime();
                        LocalTime sEnd = s.getEndTime();
                        return time.isBefore(sEnd) && endTime.isAfter(sStart);
                    });

                    if (!overlaps) {
                        Show newShow = Show.builder()
                                .movie(movie)
                                .screen(assignedScreen)
                                .showDate(showDate)
                                .startTime(time)
                                .endTime(endTime)
                                .ticketPrice(250.0 + (assignedScreen.getId() * 40))
                                .build();
                        newShow = showRepository.save(newShow);
                        existingShowsOnScreen.add(newShow);
                    }
                }
            }
        }

        // Populate show_seats inventory for any newly created shows
        jdbcTemplate.update("""
            INSERT INTO show_seats (show_id, seat_id, status)
            SELECT sh.id, se.id, 'AVAILABLE'
            FROM shows sh
            JOIN seats se ON sh.screen_id = se.screen_id
            ON CONFLICT (show_id, seat_id) DO NOTHING;
        """);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "SUCCESS");
        result.put("syncedCount", syncedTitles.size());
        result.put("region", targetRegion);
        result.put("page", 1);
        result.put("totalPages", 1);
        result.put("movies", syncedTitles);
        result.put("message", "Successfully synced page 1 with " + syncedTitles.size() + " now-playing movies from TMDB!");
        return result;
    }
}
