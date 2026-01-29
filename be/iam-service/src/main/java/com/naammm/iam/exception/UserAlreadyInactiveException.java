package com.naammm.iam.exception;

/**
 * Exception thrown when trying to deactivate a user who is already inactive
 */
public class UserAlreadyInactiveException extends ApiException {
    public UserAlreadyInactiveException(Long userId) {
        super("User with ID '" + userId + "' is already inactive",
              "USER_ALREADY_INACTIVE", 400);
    }
}