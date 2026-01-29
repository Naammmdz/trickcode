package com.naammm.iam.exception;

/**
 * Exception thrown when user account is inactive
 */
public class UserInactiveException extends ApiException {
    public UserInactiveException() {
        super("Account is inactive",
              "USER_INACTIVE", 403);
    }
}