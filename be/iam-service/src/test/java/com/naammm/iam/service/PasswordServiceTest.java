package com.naammm.iam.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PasswordServiceTest {

    @InjectMocks
    private PasswordService service;

    @Test
    void hash_shouldReturnHash() {
        // Arrange
        String password = "password";

        // Act
        String hash = service.hash(password);

        // Assert
        assertNotNull(hash);
        assertNotEquals(password, hash);
        assertTrue(hash.startsWith("$2a$")); // BCrypt prefix
    }

    @Test
    void verify_shouldReturnTrue_whenMatch() {
        // Arrange
        String password = "password";
        String hash = service.hash(password);

        // Act
        boolean verified = service.verify(password, hash);

        // Assert
        assertTrue(verified);
    }

    @Test
    void verify_shouldReturnFalse_whenNoMatch() {
        // Arrange
        String password = "password";
        String hash = service.hash("other");

        // Act
        boolean verified = service.verify(password, hash);

        // Assert
        assertFalse(verified);
    }
}
