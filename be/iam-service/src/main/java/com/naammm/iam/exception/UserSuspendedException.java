package com.naammm.iam.exception;

/**
 * Exception thrown when user account is suspended
 */
public class UserSuspendedException extends ApiException {
    public UserSuspendedException() {
        super("Account is suspended. Contact administrator",
              "USER_SUSPENDED", 403);
    }
}