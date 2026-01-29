package com.naammm.iam.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import com.naammm.iam.entity.Role;
import com.naammm.iam.entity.User;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @InjectMocks
    private TokenService service;

    @Test
    void generateRefreshToken_shouldReturnToken() {
        // Arrange
        String username = "user@example.com";

        // Act
        String token = service.generateRefreshToken(username);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void validateRefreshToken_shouldReturnUsername_whenValid() {
        // Arrange
        String username = "user@example.com";
        String token = service.generateRefreshToken(username);

        // Act
        String result = service.validateRefreshToken(token);

        // Assert
        assertEquals(username, result);
    }

    @Test
    void validateRefreshToken_shouldReturnNull_whenInvalid() {
        // Arrange
        String token = "invalid_token";

        // Act
        String result = service.validateRefreshToken(token);

        // Assert
        assertNull(result);
    }

    @Test
    void generateAccessToken_shouldReturnToken() {
        // Arrange
        User user = new User();
        user.setEmail("user@example.com");
        Role role = new Role();
        role.setName("USER");
        user.setRoles(Set.of(role));

        // Act
        // Note: This might fail if SmallRye JWT requires specific config or context not present in unit test
        // But we try to see if it works with default builder
        try {
            String token = service.generateAccessToken(user);
            assertNotNull(token);
            // We don't validate the token content deeply here as that would require a parser/verifier
            // just checking it's not null and looks like a string
            assertFalse(token.isEmpty());
        } catch (Exception e) {
            // If it fails due to missing context, we might need to skip or mock
            // For now, let's see the error
            fail("Should not throw exception: " + e.getMessage());
        }
    }
}
