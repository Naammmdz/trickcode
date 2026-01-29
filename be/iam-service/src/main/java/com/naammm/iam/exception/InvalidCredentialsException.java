package com.naammm.iam.exception;

/**
 * Exception thrown when login credentials are invalid
 */
public class InvalidCredentialsException extends ApiException {
    public InvalidCredentialsException() {
        super("Invalid email or password",
              "INVALID_CREDENTIALS", 401);
    }
}