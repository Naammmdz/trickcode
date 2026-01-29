package com.naammm.iam.exception;

/**
 * Exception thrown when user is not found
 */
public class UserNotFoundException extends ApiException {
    public UserNotFoundException(Long userId) {
        super("User with ID '" + userId + "' not found",
              "USER_NOT_FOUND", 404);
    }

    public UserNotFoundException(String email) {
        super("User '" + email + "' not found",
              "USER_NOT_FOUND", 404);
    }
}