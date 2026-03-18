package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.security.AuthoritiesConstants;
import com.naammm.trickcode.service.AdminDashboardService;
import com.naammm.trickcode.service.export.AdminExcelExportService;
import com.naammm.trickcode.service.dto.AdminDashboardStatsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * REST controller for admin dashboard statistics.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
public class AdminDashboardResource {

    private final Logger log = LoggerFactory.getLogger(AdminDashboardResource.class);

    private final AdminDashboardService adminDashboardService;
    private final AdminExcelExportService adminExcelExportService;

    public AdminDashboardResource(AdminDashboardService adminDashboardService,
                                   AdminExcelExportService adminExcelExportService) {
        this.adminDashboardService = adminDashboardService;
        this.adminExcelExportService = adminExcelExportService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        log.debug("REST request to get dashboard statistics");
        AdminDashboardStatsDTO stats = adminDashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/statistics/charts")
    public ResponseEntity<ChartDataDTO> getChartData(@RequestParam(defaultValue = "30") int days) {
        log.debug("REST request to get dashboard chart data for {} days", days);
        int safeDays = Math.max(1, Math.min(days, 365));
        ChartDataDTO chartData = adminDashboardService.getChartData(safeDays);
        return ResponseEntity.ok(chartData);
    }

    /**
     * {@code GET  /statistics/export/excel} : export dashboard data as Excel file.
     */
    @GetMapping("/statistics/export/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestParam(defaultValue = "30") int days) throws Exception {
        log.debug("REST request to export admin dashboard as Excel for {} days", days);
        int safeDays = Math.max(1, Math.min(days, 365));
        byte[] excelBytes = adminExcelExportService.exportToExcel(safeDays);
        String filename = "trickcode-admin-report-" + LocalDate.now() + ".xlsx";

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excelBytes);
    }
}
