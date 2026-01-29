package com.naammm.iam.exception;

/**
 * Exception thrown when trying to activate a user who is already active
 */
public class UserAlreadyActiveException extends ApiException {
    public UserAlreadyActiveException(Long userId) {
        super("User with ID '" + userId + "' is already active",
              "USER_ALREADY_ACTIVE", 400);
    }
}