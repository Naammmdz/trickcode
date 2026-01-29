package com.naammm.iam.exception;

/**
 * Exception thrown when default role is not found in the system
 */
public class DefaultRoleNotFoundException extends ApiException {
    public DefaultRoleNotFoundException(String roleName) {
        super("Default role '" + roleName + "' not found in system",
              "DEFAULT_ROLE_NOT_FOUND", 500);
    }
}