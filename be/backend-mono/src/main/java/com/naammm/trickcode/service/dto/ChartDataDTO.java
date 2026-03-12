package com.naammm.trickcode.service.dto;

import java.util.List;

public class ChartDataDTO {

    private List<DataPoint> dailyRevenue;
    private List<DataPoint> dailySignups;
    private List<DataPoint> coursesByLevel;
    private List<DataPoint> coursesByStatus;

    public ChartDataDTO(List<DataPoint> dailyRevenue, List<DataPoint> dailySignups, List<DataPoint> coursesByLevel, List<DataPoint> coursesByStatus) {
        this.dailyRevenue = dailyRevenue;
        this.dailySignups = dailySignups;
        this.coursesByLevel = coursesByLevel;
        this.coursesByStatus = coursesByStatus;
    }

    public List<DataPoint> getDailyRevenue() {
        return dailyRevenue;
    }

    public void setDailyRevenue(List<DataPoint> dailyRevenue) {
        this.dailyRevenue = dailyRevenue;
    }

    public List<DataPoint> getDailySignups() {
        return dailySignups;
    }

    public void setDailySignups(List<DataPoint> dailySignups) {
        this.dailySignups = dailySignups;
    }

    public List<DataPoint> getCoursesByLevel() {
        return coursesByLevel;
    }

    public void setCoursesByLevel(List<DataPoint> coursesByLevel) {
        this.coursesByLevel = coursesByLevel;
    }

    public List<DataPoint> getCoursesByStatus() {
        return coursesByStatus;
    }

    public void setCoursesByStatus(List<DataPoint> coursesByStatus) {
        this.coursesByStatus = coursesByStatus;
    }

    public static class DataPoint {

        private String date;
        private Number value;

        public DataPoint(String date, Number value) {
            this.date = date;
            this.value = value;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Number getValue() {
            return value;
        }

        public void setValue(Number value) {
            this.value = value;
        }
    }
}
