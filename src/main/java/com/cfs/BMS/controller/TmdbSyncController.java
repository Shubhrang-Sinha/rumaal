package com.cfs.BMS.controller;

import com.cfs.BMS.service.TmdbService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/movies", "/api/v1/movies"})
@RequiredArgsConstructor
@Tag(name = "TMDB Live Sync", description = "Endpoints for synchronizing currently running movies from TMDB API")
public class TmdbSyncController {

    private final TmdbService tmdbService;

    @PostMapping("/sync-tmdb")
    @Operation(summary = "Synchronize now-playing movies from TMDB API into the database")
    public ResponseEntity<Map<String, Object>> syncTmdb(
            @RequestParam(required = false) String apiKey,
            @RequestParam(required = false) String region,
            @RequestBody(required = false) Map<String, String> body) {
        
        String key = apiKey;
        if ((key == null || key.isEmpty()) && body != null && body.containsKey("apiKey")) {
            key = body.get("apiKey");
        }
        
        String targetRegion = region;
        if ((targetRegion == null || targetRegion.isEmpty()) && body != null && body.containsKey("region") && !body.get("region").isEmpty()) {
            targetRegion = body.get("region");
        }

        return ResponseEntity.ok(tmdbService.syncNowPlaying(key, targetRegion));
    }

    @GetMapping("/tmdb-status")
    @Operation(summary = "Check TMDB configuration status")
    public ResponseEntity<Map<String, Object>> getTmdbStatus() {
        boolean configured = tmdbService.isConfigured();
        return ResponseEntity.ok(Map.of(
                "configured", configured,
                "message", configured 
                    ? "TMDB API key is active. Ready to sync live theatrical releases." 
                    : "No TMDB key configured. Pass 'apiKey' to /api/movies/sync-tmdb to sync."
        ));
    }
}
