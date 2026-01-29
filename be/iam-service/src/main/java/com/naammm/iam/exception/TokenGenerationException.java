package com.naammm.iam.exception;

/**
 * Exception thrown when JWT token generation fails
 */
public class TokenGenerationException extends ApiException {
    public TokenGenerationException(String reason) {
        super("Failed to generate JWT token: " + reason,
              "TOKEN_GENERATION_FAILED", 500);
    }
}