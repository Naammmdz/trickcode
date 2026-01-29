package com.naammm.iam.dto;

public class PermissionCheckRequest {
    private Long userId;
    private String permission;

    public PermissionCheckRequest() {
    }

    public PermissionCheckRequest(Long userId, String permission) {
        this.userId = userId;
        this.permission = permission;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}
