package com.naammm.iam.dto;

public class PermissionCheckResponse {
    private boolean allowed;

    public PermissionCheckResponse() {
    }

    public PermissionCheckResponse(boolean allowed) {
        this.allowed = allowed;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }
}
