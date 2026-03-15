package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.security.AuthoritiesConstants;
import com.naammm.trickcode.service.InstructorDashboardService;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import com.naammm.trickcode.service.dto.InstructorDashboardStatsDTO;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for instructor dashboard statistics.
 */
@RestController
@RequestMapping("/api/instructor")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.INSTRUCTOR + "\")")
public class InstructorDashboardResource {

    private final Logger log = LoggerFactory.getLogger(InstructorDashboardResource.class);

    private final InstructorDashboardService instructorDashboardService;

    public InstructorDashboardResource(InstructorDashboardService instructorDashboardService) {
        this.instructorDashboardService = instructorDashboardService;
    }

    /**
     * {@code GET  /statistics} : get instructor dashboard statistics.
     */
    @GetMapping("/statistics")
    public ResponseEntity<InstructorDashboardStatsDTO> getStats() {
        log.debug("REST request to get instructor dashboard statistics");
        return ResponseEntity.ok(instructorDashboardService.getStats());
    }

    /**
     * {@code GET  /statistics/charts} : get chart data for instructor dashboard.
     */
    @GetMapping("/statistics/charts")
    public ResponseEntity<ChartDataDTO> getChartData() {
        log.debug("REST request to get instructor dashboard chart data");
        return ResponseEntity.ok(instructorDashboardService.getChartData());
    }

    /**
     * {@code GET  /payouts} : get payout data for instructor.
     */
    @GetMapping("/payouts")
    public ResponseEntity<List<InstructorDashboardStatsDTO.CourseStatDTO>> getPayouts() {
        log.debug("REST request to get instructor payout data");
        return ResponseEntity.ok(instructorDashboardService.getPayoutData());
    }

    /**
     * {@code GET  /enrollments} : get all enrollments for instructor's courses.
     */
    @GetMapping("/enrollments")
    public ResponseEntity<List<InstructorDashboardStatsDTO.RecentEnrollmentDTO>> getAllEnrollments() {
        log.debug("REST request to get instructor enrollments");
        return ResponseEntity.ok(instructorDashboardService.getAllEnrollments());
    }
}
