package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.security.AuthoritiesConstants;
import com.naammm.trickcode.service.InstructorDashboardService;
import com.naammm.trickcode.service.export.InstructorExcelExportService;
import com.naammm.trickcode.service.export.InstructorPdfExportService;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import com.naammm.trickcode.service.dto.InstructorDashboardStatsDTO;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    private final InstructorExcelExportService instructorExcelExportService;
    private final InstructorPdfExportService instructorPdfExportService;

    public InstructorDashboardResource(InstructorDashboardService instructorDashboardService,
                                        InstructorExcelExportService instructorExcelExportService,
                                        InstructorPdfExportService instructorPdfExportService) {
        this.instructorDashboardService = instructorDashboardService;
        this.instructorExcelExportService = instructorExcelExportService;
        this.instructorPdfExportService = instructorPdfExportService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<InstructorDashboardStatsDTO> getStats() {
        log.debug("REST request to get instructor dashboard statistics");
        return ResponseEntity.ok(instructorDashboardService.getStats());
    }

    @GetMapping("/statistics/charts")
    public ResponseEntity<ChartDataDTO> getChartData(@RequestParam(defaultValue = "30") int days) {
        log.debug("REST request to get instructor dashboard chart data for {} days", days);
        int safeDays = Math.max(1, Math.min(days, 365));
        return ResponseEntity.ok(instructorDashboardService.getChartData(safeDays));
    }

    @GetMapping("/payouts")
    public ResponseEntity<List<InstructorDashboardStatsDTO.CourseStatDTO>> getPayouts() {
        log.debug("REST request to get instructor payout data");
        return ResponseEntity.ok(instructorDashboardService.getPayoutData());
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<InstructorDashboardStatsDTO.RecentEnrollmentDTO>> getAllEnrollments() {
        log.debug("REST request to get instructor enrollments");
        return ResponseEntity.ok(instructorDashboardService.getAllEnrollments());
    }

    /**
     * {@code GET  /statistics/export/excel} : export instructor dashboard as Excel.
     */
    @GetMapping("/statistics/export/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestParam(defaultValue = "30") int days) throws Exception {
        log.debug("REST request to export instructor dashboard as Excel for {} days", days);
        int safeDays = Math.max(1, Math.min(days, 365));
        byte[] excelBytes = instructorExcelExportService.exportToExcel(safeDays);
        String filename = "trickcode-instructor-report-" + LocalDate.now() + ".xlsx";

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excelBytes);
    }

    /**
     * {@code GET  /statistics/export/pdf} : export instructor course overview as PDF.
     */
    @GetMapping("/statistics/export/pdf")
    public ResponseEntity<byte[]> exportPdf() throws Exception {
        log.debug("REST request to export instructor dashboard as PDF");
        byte[] pdfBytes = instructorPdfExportService.exportToPdf();
        String filename = "trickcode-instructor-overview-" + LocalDate.now() + ".pdf";

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfBytes);
    }
}
