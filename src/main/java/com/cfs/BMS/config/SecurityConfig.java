package com.cfs.BMS.config;

import com.cfs.BMS.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // public reads
                        .requestMatchers(HttpMethod.GET,
                                "/api/movies", "/api/movies/**", "/api/v1/movies", "/api/v1/movies/**",
                                "/api/cities", "/api/cities/**", "/api/v1/cities", "/api/v1/cities/**",
                                "/api/theaters", "/api/theaters/**", "/api/v1/theaters", "/api/v1/theaters/**",
                                "/api/shows", "/api/shows/**", "/api/v1/shows", "/api/v1/shows/**",
                                "/api/screens", "/api/screens/**", "/api/v1/screens", "/api/v1/screens/**",
                                "/api/seats", "/api/seats/**", "/api/v1/seats", "/api/v1/seats/**").permitAll()
                        .requestMatchers(
                                "/api/users/register", "/api/v1/users/register",
                                "/api/users/login", "/api/v1/users/login",
                                "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
                                "/actuator/health", "/actuator/info").permitAll()
                        // Public seat availability before broader matchers
                        .requestMatchers(HttpMethod.GET, "/api/bookings/show/*/available-seats", "/api/v1/bookings/show/*/available-seats").permitAll()
                        // POST sync-tmdb requires authentication
                        .requestMatchers(HttpMethod.POST, "/api/movies/sync-tmdb", "/api/v1/movies/sync-tmdb").authenticated()
                        // All booking actions require authentication
                        .requestMatchers("/api/bookings/**", "/api/v1/bookings/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
