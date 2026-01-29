package com.naammm.iam.exception;

/**
 * Exception thrown when user registration fails due to invalid data
 */
public class InvalidRegistrationDataException extends ApiException {
    public InvalidRegistrationDataException(String message) {
        super("Invalid registration data: " + message,
              "INVALID_REGISTRATION_DATA", 400);
    }
}