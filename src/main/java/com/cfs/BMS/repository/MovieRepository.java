package com.cfs.BMS.repository;

import com.cfs.BMS.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

  Optional<Movie> findByTmdbId(Long tmdbId);
  Optional<Movie> findByTitleIgnoreCase(String title);
  Page<Movie> findByGenreIgnoreCase(String genre, Pageable pageable);
  Page<Movie> findByLanguageIgnoreCase(String language, Pageable pageable);
  Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);

}
