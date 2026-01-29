package com.naammm.iam.service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.naammm.iam.entity.User;
import com.naammm.iam.exception.TokenGenerationException;

import org.jboss.logging.Logger;

import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.build.JwtClaimsBuilder;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TokenService {
    private static final Logger LOG = Logger.getLogger(TokenService.class);
    private static final Map<String, String> refreshTokens = new HashMap<>();

    public String generateAccessToken(User user) {
        try {
            Set<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toSet());

            LOG.infof("Generating JWT token for user: %s with roles: %s",
                      user.getEmail(), roleNames);

            // Build JWT with roles (groups) only
            JwtClaimsBuilder builder = Jwt.issuer("https://example.com/issuer")
                    .upn(user.getEmail())
                    .subject(user.getEmail())
                    .claim("userId", user.getId())
                    .groups(roleNames)  // Roles for @RolesAllowed
                    // .claim("permissions", user.getRoles().stream()
                    //         .flatMap(role -> role.getPermissions().stream())
                    //         .map(permission -> permission.getName())
                    //         .collect(Collectors.toSet()))
                    .audience("iam-service")
                    .issuedAt(Instant.now())
                    .expiresIn(Duration.ofMinutes(30));

            String token = builder.sign();
            LOG.info("JWT token generated successfully with permissions");
            return token;
            
        } catch (Exception e) {
            LOG.errorf("Error generating JWT token: %s", e.getMessage(), e);
            throw new TokenGenerationException(e.getMessage());
        }
    }

    public String generateRefreshToken(String username) {
        try {
            String token = UUID.randomUUID().toString();
            refreshTokens.put(token, username);
            LOG.infof("Generated refresh token for user: %s", username);
            return token;
        } catch (Exception e) {
            LOG.errorf("Error generating refresh token: %s", e.getMessage(), e);
            throw new RuntimeException("Failed to generate refresh token", e);
        }
    }

    public String validateRefreshToken(String token) {
        try {
            String username = refreshTokens.get(token);
            if (username != null) {
                LOG.infof("Refresh token validated for user: %s", username);
            } else {
                LOG.warn("Invalid refresh token provided");
            }
            return username;
        } catch (Exception e) {
            LOG.errorf("Error validating refresh token: %s", e.getMessage(), e);
            return null;
        }
    }
}
