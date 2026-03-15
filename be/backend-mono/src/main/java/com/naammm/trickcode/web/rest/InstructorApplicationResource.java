package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.domain.InstructorApplication;
import com.naammm.trickcode.service.InstructorApplicationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InstructorApplicationResource {

    private final InstructorApplicationService service;

    public InstructorApplicationResource(InstructorApplicationService service) {
        this.service = service;
    }

    // ──────────── User endpoints ────────────

    public record ApplicationRequest(
        @NotBlank @Size(max = 255) String fullName,
        @Size(max = 2000) String bio,
        @NotBlank @Size(max = 2000) String experience,
        @NotBlank @Size(max = 2000) String motivation
    ) {}

    @PostMapping("/instructor-applications")
    public ResponseEntity<?> submit(@Valid @RequestBody ApplicationRequest req) {
        try {
            InstructorApplication app = service.submit(req.fullName(), req.bio(), req.experience(), req.motivation());
            return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(app));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/instructor-applications/my")
    public ResponseEntity<?> getMyApplication() {
        return service.getMyApplication()
            .map(app -> ResponseEntity.ok(toDTO(app)))
            .orElse(ResponseEntity.noContent().build());
    }

    // ──────────── Admin endpoints ────────────

    @GetMapping("/admin/instructor-applications")
    public ResponseEntity<List<Map<String, Object>>> getAllApplications() {
        List<Map<String, Object>> result = service.getAllApplications().stream()
            .map(this::toDTO)
            .toList();
        return ResponseEntity.ok(result);
    }

    public record RejectRequest(@Size(max = 1000) String reason) {}

    @PutMapping("/admin/instructor-applications/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(toDTO(service.approve(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/admin/instructor-applications/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody RejectRequest req) {
        try {
            return ResponseEntity.ok(toDTO(service.reject(id, req.reason())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> toDTO(InstructorApplication app) {
        return Map.ofEntries(
            Map.entry("id", app.getId()),
            Map.entry("userLogin", app.getUser() != null ? app.getUser().getLogin() : ""),
            Map.entry("userEmail", app.getUser() != null ? (app.getUser().getEmail() != null ? app.getUser().getEmail() : "") : ""),
            Map.entry("fullName", app.getFullName()),
            Map.entry("bio", app.getBio() != null ? app.getBio() : ""),
            Map.entry("experience", app.getExperience()),
            Map.entry("motivation", app.getMotivation()),
            Map.entry("status", app.getStatus().name()),
            Map.entry("rejectionReason", app.getRejectionReason() != null ? app.getRejectionReason() : ""),
            Map.entry("createdAt", app.getCreatedAt().toString()),
            Map.entry("reviewedAt", app.getReviewedAt() != null ? app.getReviewedAt().toString() : ""),
            Map.entry("reviewedBy", app.getReviewedBy() != null ? app.getReviewedBy() : "")
        );
    }
}
