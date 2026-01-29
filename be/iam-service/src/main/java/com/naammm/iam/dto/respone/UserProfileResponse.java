package com.naammm.iam.dto.respone;

import com.naammm.iam.entity.Status;

import java.time.Instant;
import java.util.Set;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String avatarUrl,
        String bio,
        Status status,
        Instant proExpiresAt,
        Set<String> roles
) {}