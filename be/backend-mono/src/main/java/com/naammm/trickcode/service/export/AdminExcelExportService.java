package com.naammm.trickcode.service.export;

import com.naammm.trickcode.service.AdminDashboardService;
import com.naammm.trickcode.service.dto.AdminDashboardStatsDTO;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

/**
 * Service for exporting Admin dashboard data to Excel (.xlsx).
 */
@Service
public class AdminExcelExportService {

    private final AdminDashboardService adminDashboardService;

    public AdminExcelExportService(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    public byte[] exportToExcel(int days) throws IOException {
        AdminDashboardStatsDTO stats = adminDashboardService.getDashboardStats();
        ChartDataDTO chartData = adminDashboardService.getChartData(days);

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            CellStyle titleStyle = createTitleStyle(workbook);

            // Sheet 1: Platform Summary
            createSummarySheet(workbook, stats, headerStyle, currencyStyle, titleStyle);

            // Sheet 2: Daily Revenue
            createTimeSeriesSheet(workbook, "Daily Revenue", chartData.getDailyRevenue(), headerStyle, currencyStyle, dateStyle, true);

            // Sheet 3: Daily Signups
            createTimeSeriesSheet(workbook, "Daily Signups", chartData.getDailyActivity(), headerStyle, null, dateStyle, false);

            // Sheet 4: Courses by Level
            createCategorySheet(workbook, "Courses by Level", chartData.getCoursesByLevel(), headerStyle);

            // Sheet 5: Courses by Status
            createCategorySheet(workbook, "Courses by Status", chartData.getCoursesByStatus(), headerStyle);

            // Sheet 6: Recent Users
            createRecentUsersSheet(workbook, stats, headerStyle, dateStyle);

            // Sheet 7: Recent Orders
            createRecentOrdersSheet(workbook, stats, headerStyle, currencyStyle, dateStyle);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createSummarySheet(XSSFWorkbook workbook, AdminDashboardStatsDTO stats,
                                     CellStyle headerStyle, CellStyle currencyStyle, CellStyle titleStyle) {
        Sheet sheet = workbook.createSheet("Platform Summary");
        sheet.setColumnWidth(0, 8000);
        sheet.setColumnWidth(1, 6000);
        int rowNum = 0;

        // Title
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("TrickCode — Platform Dashboard Report");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 1));

        Row dateRow = sheet.createRow(rowNum++);
        dateRow.createCell(0).setCellValue("Generated: " + LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        rowNum++; // blank row

        // Metrics
        String[][] metrics = {
            {"Total Users", String.valueOf(stats.getTotalUsers())},
            {"Total Courses", String.valueOf(stats.getTotalCourses())},
            {"Pending Courses", String.valueOf(stats.getPendingCourses())},
        };

        Row metricHeader = sheet.createRow(rowNum++);
        createHeaderCell(metricHeader, 0, "Metric", headerStyle);
        createHeaderCell(metricHeader, 1, "Value", headerStyle);

        for (String[] m : metrics) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(m[0]);
            row.createCell(1).setCellValue(Double.parseDouble(m[1]));
        }

        rowNum++; // blank row

        // Revenue breakdown
        Row revHeader = sheet.createRow(rowNum++);
        createHeaderCell(revHeader, 0, "Revenue Metric", headerStyle);
        createHeaderCell(revHeader, 1, "Amount (USD)", headerStyle);

        Object[][] revMetrics = {
            {"Total Revenue", stats.getTotalRevenue()},
            {"Course Revenue", stats.getCourseRevenue()},
            {"Subscription Revenue", stats.getSubscriptionRevenue()},
            {"Platform Commission", stats.getPlatformCommission()},
            {"Instructor Payouts", stats.getInstructorPayouts()},
        };

        for (Object[] m : revMetrics) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue((String) m[0]);
            Cell valCell = row.createCell(1);
            valCell.setCellValue(m[1] != null ? ((Number) m[1]).doubleValue() : 0);
            valCell.setCellStyle(currencyStyle);
        }
    }

    private void createTimeSeriesSheet(XSSFWorkbook workbook, String sheetName,
                                        java.util.List<ChartDataDTO.DataPoint> data,
                                        CellStyle headerStyle, CellStyle currencyStyle,
                                        CellStyle dateStyle, boolean isCurrency) {
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
                if (isCurrency && currencyStyle != null) {
                    valCell.setCellStyle(currencyStyle);
                }
            }
        }

        // Total row
        Row totalRow = sheet.createRow(rowNum);
        Cell totalLabel = totalRow.createCell(0);
        totalLabel.setCellValue("TOTAL");
        totalLabel.setCellStyle(headerStyle);
        Cell totalVal = totalRow.createCell(1);
        double total = data != null ? data.stream().mapToDouble(d -> d.getValue() != null ? d.getValue().doubleValue() : 0).sum() : 0;
        totalVal.setCellValue(total);
        if (isCurrency && currencyStyle != null) totalVal.setCellStyle(currencyStyle);
    }

    private void createCategorySheet(XSSFWorkbook workbook, String sheetName,
                                      java.util.List<ChartDataDTO.DataPoint> data, CellStyle headerStyle) {
        Sheet sheet = workbook.createSheet(sheetName);
        sheet.setColumnWidth(0, 5000);
        sheet.setColumnWidth(1, 3500);
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        createHeaderCell(header, 0, "Category", headerStyle);
        createHeaderCell(header, 1, "Count", headerStyle);

        if (data != null) {
            for (ChartDataDTO.DataPoint dp : data) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dp.getLabel());
                row.createCell(1).setCellValue(dp.getValue() != null ? dp.getValue().doubleValue() : 0);
            }
        }
    }

    private void createRecentUsersSheet(XSSFWorkbook workbook, AdminDashboardStatsDTO stats,
                                         CellStyle headerStyle, CellStyle dateStyle) {
        Sheet sheet = workbook.createSheet("Recent Users");
        sheet.setColumnWidth(0, 5000);
        sheet.setColumnWidth(1, 8000);
        sheet.setColumnWidth(2, 5500);
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        createHeaderCell(header, 0, "Login", headerStyle);
        createHeaderCell(header, 1, "Email", headerStyle);
        createHeaderCell(header, 2, "Registered", headerStyle);

        if (stats.getRecentUsers() != null) {
            for (AdminDashboardStatsDTO.RecentUserDTO user : stats.getRecentUsers()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getLogin());
                row.createCell(1).setCellValue(user.getEmail());
                row.createCell(2).setCellValue(user.getCreatedDate() != null ? user.getCreatedDate().toString() : "");
            }
        }
    }

    private void createRecentOrdersSheet(XSSFWorkbook workbook, AdminDashboardStatsDTO stats,
                                           CellStyle headerStyle, CellStyle currencyStyle, CellStyle dateStyle) {
        Sheet sheet = workbook.createSheet("Recent Orders");
        sheet.setColumnWidth(0, 2500);
        sheet.setColumnWidth(1, 5000);
        sheet.setColumnWidth(2, 8000);
        sheet.setColumnWidth(3, 3500);
        sheet.setColumnWidth(4, 4500);
        sheet.setColumnWidth(5, 5500);
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        createHeaderCell(header, 0, "ID", headerStyle);
        createHeaderCell(header, 1, "User", headerStyle);
        createHeaderCell(header, 2, "Course", headerStyle);
        createHeaderCell(header, 3, "Amount", headerStyle);
        createHeaderCell(header, 4, "Status", headerStyle);
        createHeaderCell(header, 5, "Date", headerStyle);

        if (stats.getRecentOrders() != null) {
            for (AdminDashboardStatsDTO.RecentOrderDTO order : stats.getRecentOrders()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getUserLogin());
                row.createCell(2).setCellValue(order.getCourseTitle() != null ? order.getCourseTitle() : "N/A");
                Cell amountCell = row.createCell(3);
                amountCell.setCellValue(order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0);
                amountCell.setCellStyle(currencyStyle);
                row.createCell(4).setCellValue(order.getStatus() != null ? order.getStatus().toString() : "");
                row.createCell(5).setCellValue(order.getCreatedDate() != null ? order.getCreatedDate().toString() : "");
            }
        }
    }

    // --- Style Helpers ---

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

    private CellStyle createDateStyle(XSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("yyyy-mm-dd"));
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
