package com.naammm.trickcode.service.dto;

import java.util.List;

public class ChartDataDTO {

    private List<DataPoint> dailyRevenue;
    private List<DataPoint> dailyActivity;
    private List<DataPoint> coursesByLevel;
    private List<DataPoint> coursesByStatus;

    public ChartDataDTO(List<DataPoint> dailyRevenue, List<DataPoint> dailyActivity, List<DataPoint> coursesByLevel, List<DataPoint> coursesByStatus) {
        this.dailyRevenue = dailyRevenue;
        this.dailyActivity = dailyActivity;
        this.coursesByLevel = coursesByLevel;
        this.coursesByStatus = coursesByStatus;
    }

    public List<DataPoint> getDailyRevenue() {
        return dailyRevenue;
    }

    public void setDailyRevenue(List<DataPoint> dailyRevenue) {
        this.dailyRevenue = dailyRevenue;
    }

    public List<DataPoint> getDailyActivity() {
        return dailyActivity;
    }

    public void setDailyActivity(List<DataPoint> dailyActivity) {
        this.dailyActivity = dailyActivity;
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

        private String label;
        private Number value;

        public DataPoint(String label, Number value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public Number getValue() {
            return value;
        }

        public void setValue(Number value) {
            this.value = value;
        }
    }
}
