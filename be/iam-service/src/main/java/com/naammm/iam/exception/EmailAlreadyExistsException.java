package com.naammm.iam.exception;

/**
 * Exception thrown when a user tries to register with an email that already exists
 */
public class EmailAlreadyExistsException extends ApiException {
    public EmailAlreadyExistsException(String email) {
        super("Email '" + email + "' is already registered",
              "EMAIL_ALREADY_EXISTS", 409);
    }
}