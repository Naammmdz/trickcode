package com.naammm.iam.exception;

/**
 * Exception thrown when role is not found
 */
public class RoleNotFoundException extends ApiException {
    public RoleNotFoundException(Long roleId) {
        super("Role with ID '" + roleId + "' not found",
              "ROLE_NOT_FOUND", 404);
    }

    public RoleNotFoundException(String roleName) {
        super("Role '" + roleName + "' not found",
              "ROLE_NOT_FOUND", 404);
    }
}