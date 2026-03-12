package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.security.AuthoritiesConstants;
import com.naammm.trickcode.service.AdminDashboardService;
import com.naammm.trickcode.service.dto.AdminDashboardStatsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for admin dashboard statistics.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
public class AdminDashboardResource {

    private final Logger log = LoggerFactory.getLogger(AdminDashboardResource.class);

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardResource(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    /**
     * {@code GET  /statistics} : get all dashboard statistics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the statistics in body.
     */
    @GetMapping("/statistics")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        log.debug("REST request to get dashboard statistics");
        AdminDashboardStatsDTO stats = adminDashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * {@code GET  /statistics/charts} : get all chart data for the dashboard.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the chart data in body.
     */
    @GetMapping("/statistics/charts")
    public ResponseEntity<ChartDataDTO> getChartData() {
        log.debug("REST request to get dashboard chart data");
        ChartDataDTO chartData = adminDashboardService.getChartData();
        return ResponseEntity.ok(chartData);
    }
}
