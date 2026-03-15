package com.naammm.trickcode.service.export;

import com.naammm.trickcode.service.InstructorDashboardService;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import com.naammm.trickcode.service.dto.InstructorDashboardStatsDTO;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

/**
 * Service for exporting Instructor dashboard data to Excel (.xlsx).
 */
@Service
public class InstructorExcelExportService {

    private final InstructorDashboardService instructorDashboardService;

    public InstructorExcelExportService(InstructorDashboardService instructorDashboardService) {
        this.instructorDashboardService = instructorDashboardService;
    }

    public byte[] exportToExcel(int days) throws IOException {
        InstructorDashboardStatsDTO stats = instructorDashboardService.getStats();
        ChartDataDTO chartData = instructorDashboardService.getChartData(days);

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle titleStyle = createTitleStyle(workbook);

            // Sheet 1: Earnings Summary
            createEarningsSummarySheet(workbook, stats, headerStyle, currencyStyle, titleStyle);

            // Sheet 2: Course Performance
            createCoursePerformanceSheet(workbook, stats, headerStyle, currencyStyle);

            // Sheet 3: Daily Revenue
            createTimeSeriesSheet(workbook, "Daily Revenue", chartData.getDailyRevenue(), headerStyle, currencyStyle, true);

            // Sheet 4: Daily Enrollments
            createTimeSeriesSheet(workbook, "Daily Enrollments", chartData.getDailyActivity(), headerStyle, null, false);

            // Sheet 5: Recent Enrollments
            createRecentEnrollmentsSheet(workbook, stats, headerStyle);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createEarningsSummarySheet(XSSFWorkbook workbook, InstructorDashboardStatsDTO stats,
                                             CellStyle headerStyle, CellStyle currencyStyle, CellStyle titleStyle) {
        Sheet sheet = workbook.createSheet("Earnings Summary");
        sheet.setColumnWidth(0, 8000);
        sheet.setColumnWidth(1, 6000);
        int rowNum = 0;

        // Title
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("TrickCode — Instructor Earnings Report");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 1));

        Row dateRow = sheet.createRow(rowNum++);
        dateRow.createCell(0).setCellValue("Generated: " + LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        rowNum++;

        // Summary
        Row header = sheet.createRow(rowNum++);
        createHeaderCell(header, 0, "Metric", headerStyle);
        createHeaderCell(header, 1, "Value", headerStyle);

        // Counts
        Row r1 = sheet.createRow(rowNum++);
        r1.createCell(0).setCellValue("Total Courses");
        r1.createCell(1).setCellValue(stats.getTotalCourses());

        Row r2 = sheet.createRow(rowNum++);
        r2.createCell(0).setCellValue("Published Courses");
        r2.createCell(1).setCellValue(stats.getPublishedCourses());

        Row r3 = sheet.createRow(rowNum++);
        r3.createCell(0).setCellValue("Total Enrollments");
        r3.createCell(1).setCellValue(stats.getTotalStudents());

        rowNum++;

        // Revenue
        Row revHeader = sheet.createRow(rowNum++);
        createHeaderCell(revHeader, 0, "Revenue Metric", headerStyle);
        createHeaderCell(revHeader, 1, "Amount (USD)", headerStyle);

        Row rev = sheet.createRow(rowNum++);
        rev.createCell(0).setCellValue("Net Earnings (80%)");
        Cell revVal = rev.createCell(1);
        revVal.setCellValue(stats.getTotalRevenue() != null ? stats.getTotalRevenue().doubleValue() : 0);
        revVal.setCellStyle(currencyStyle);

        // Per-course revenue totals
        if (stats.getCourseStats() != null) {
            rowNum++;
            Row courseRevHeader = sheet.createRow(rowNum++);
            createHeaderCell(courseRevHeader, 0, "Course", headerStyle);
            createHeaderCell(courseRevHeader, 1, "Earnings (USD)", headerStyle);

            for (InstructorDashboardStatsDTO.CourseStatDTO cs : stats.getCourseStats()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(cs.getCourseTitle());
                Cell c = row.createCell(1);
                c.setCellValue(cs.getRevenue() != null ? cs.getRevenue().doubleValue() : 0);
                c.setCellStyle(currencyStyle);
            }
        }
    }

    private void createCoursePerformanceSheet(XSSFWorkbook workbook, InstructorDashboardStatsDTO stats,
                                               CellStyle headerStyle, CellStyle currencyStyle) {
        Sheet sheet = workbook.createSheet("Course Performance");
        sheet.setColumnWidth(0, 10000);
        sheet.setColumnWidth(1, 4000);
        sheet.setColumnWidth(2, 4000);
        sheet.setColumnWidth(3, 3500);
        sheet.setColumnWidth(4, 4000);
        sheet.setColumnWidth(5, 4500);
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        createHeaderCell(header, 0, "Course Title", headerStyle);
        createHeaderCell(header, 1, "Status", headerStyle);
        createHeaderCell(header, 2, "Level", headerStyle);
        createHeaderCell(header, 3, "Price", headerStyle);
        createHeaderCell(header, 4, "Enrollments", headerStyle);
        createHeaderCell(header, 5, "Earnings (USD)", headerStyle);

        if (stats.getCourseStats() != null) {
            for (InstructorDashboardStatsDTO.CourseStatDTO cs : stats.getCourseStats()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(cs.getCourseTitle());
                row.createCell(1).setCellValue(cs.getStatus());
                row.createCell(2).setCellValue(cs.getLevel() != null ? cs.getLevel() : "—");
                Cell priceCell = row.createCell(3);
                priceCell.setCellValue(cs.getPrice() != null ? cs.getPrice().doubleValue() : 0);
                priceCell.setCellStyle(currencyStyle);
                row.createCell(4).setCellValue(cs.getEnrollmentCount());
                Cell revCell = row.createCell(5);
                revCell.setCellValue(cs.getRevenue() != null ? cs.getRevenue().doubleValue() : 0);
                revCell.setCellStyle(currencyStyle);
            }
        }
    }

    private void createTimeSeriesSheet(XSSFWorkbook workbook, String sheetName,
                                        List<ChartDataDTO.DataPoint> data,
                                        CellStyle headerStyle, CellStyle currencyStyle, boolean isCurrency) {
        Sheet sheet = workbook.createSheet(sheetName);
        sheet.setColumnWidth(0, 4500);
        sheet.setColumnWidth(1, 4500);
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        createHeaderCell(header, 0, "Date", headerStyle);
        createHeaderCell(header, 1, "Value", headerStyle);

        if (data != null) {
            for (ChartDataDTO.DataPoint dp : data) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dp.getLabel());
                Cell valCell = row.createCell(1);
                valCell.setCellValue(dp.getValue() != null ? dp.getValue().doubleValue() : 0);
                if (isCurrency && currencyStyle != null) valCell.setCellStyle(currencyStyle);
            }
        }

        // Total
        Row totalRow = sheet.createRow(rowNum);
        Cell totalLabel = totalRow.createCell(0);
        totalLabel.setCellValue("TOTAL");
        totalLabel.setCellStyle(headerStyle);
        Cell totalVal = totalRow.createCell(1);
        double total = data != null ? data.stream().mapToDouble(d -> d.getValue() != null ? d.getValue().doubleValue() : 0).sum() : 0;
        totalVal.setCellValue(total);
        if (isCurrency && currencyStyle != null) totalVal.setCellStyle(currencyStyle);
    }

    private void createRecentEnrollmentsSheet(XSSFWorkbook workbook, InstructorDashboardStatsDTO stats,
                                               CellStyle headerStyle) {
        Sheet sheet = workbook.createSheet("Recent Enrollments");
        sheet.setColumnWidth(0, 5000);
        sheet.setColumnWidth(1, 8000);
        sheet.setColumnWidth(2, 8000);
        sheet.setColumnWidth(3, 5500);
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        createHeaderCell(header, 0, "Student", headerStyle);
        createHeaderCell(header, 1, "Email", headerStyle);
        createHeaderCell(header, 2, "Course", headerStyle);
        createHeaderCell(header, 3, "Enrolled At", headerStyle);

        if (stats.getRecentEnrollments() != null) {
            for (InstructorDashboardStatsDTO.RecentEnrollmentDTO e : stats.getRecentEnrollments()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(e.getUserLogin());
                row.createCell(1).setCellValue(e.getUserEmail());
                row.createCell(2).setCellValue(e.getCourseTitle());
                row.createCell(3).setCellValue(e.getEnrolledAt() != null ? e.getEnrolledAt().toString() : "");
            }
        }
    }

    // --- Styles ---

    private void createHeaderCell(Row row, int col, String text, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(text);
        cell.setCellStyle(style);
    }

    private CellStyle createHeaderStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private CellStyle createCurrencyStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("$#,##0.00"));
        return style;
    }

    private CellStyle createTitleStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        style.setFont(font);
        return style;
    }
}
