package com.cfs.BMS.controller;


import com.cfs.BMS.dto.BookingRequest;
import com.cfs.BMS.entity.Booking;
import com.cfs.BMS.entity.Seat;
import com.cfs.BMS.entity.User;
import com.cfs.BMS.service.BookingService;
import com.cfs.BMS.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping({"/api/bookings", "/api/v1/bookings"})
@RequiredArgsConstructor
@Tag(name = "Booking Management", description = "Endpoints for creating and managing movie ticket bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create a new booking (idempotent via Idempotency-Key or body key)")
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request,
                                                @RequestHeader(value = "Idempotency-Key", required = false) String idemHeader,
                                                Principal principal) {
        if (principal != null) {
            User authUser = userService.getUserByEmail(principal.getName());
            request.setUserId(authUser.getId());
        }
        if (request.getIdempotencyKey() == null && idemHeader != null) {
            try { request.setIdempotencyKey(java.util.UUID.fromString(idemHeader)); }
            catch (IllegalArgumentException ignored) { }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id, Principal principal) {
        Booking booking = bookingService.getBookingById(id);
        if (principal != null) {
            User authUser = userService.getUserByEmail(principal.getName());
            if (!booking.getUser().getId().equals(authUser.getId()) && !"ADMIN".equalsIgnoreCase(authUser.getRole().name())) {
                throw new AccessDeniedException("You are not authorized to view this booking");
            }
        }
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get bookings by User ID (paginated)")
    public ResponseEntity<Page<Booking>> getBookingByUserId(@PathVariable Long userId,
                                                           @PageableDefault(size = 20) Pageable pageable,
                                                           Principal principal) {
        if (principal != null) {
            User authUser = userService.getUserByEmail(principal.getName());
            if (!userId.equals(authUser.getId()) && !"ADMIN".equalsIgnoreCase(authUser.getRole().name())) {
                throw new AccessDeniedException("You are not authorized to view another user's bookings");
            }
        }
        return ResponseEntity.ok(bookingService.getBookingByUser(userId, pageable));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking and release seats")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, Principal principal) {
        Booking booking = bookingService.getBookingById(id);
        if (principal != null) {
            User authUser = userService.getUserByEmail(principal.getName());
            if (!booking.getUser().getId().equals(authUser.getId()) && !"ADMIN".equalsIgnoreCase(authUser.getRole().name())) {
                throw new AccessDeniedException("You are not authorized to cancel this booking");
            }
        }
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @GetMapping("/show/{showId}/available-seats")
    @Operation(summary = "Get available seats for a show")
    public ResponseEntity<List<Seat>> getAvailableSeats(@PathVariable Long showId) {
        return ResponseEntity.ok(bookingService.getAvailableSeats(showId));
    }
}
