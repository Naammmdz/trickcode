package com.naammm.iam.exception;

/**
 * Exception thrown when trying to create a role with a name that already exists
 */
public class RoleAlreadyExistsException extends ApiException {
    public RoleAlreadyExistsException(String roleName) {
        super("Role with name '" + roleName + "' already exists",
              "ROLE_ALREADY_EXISTS", 409);
    }
}