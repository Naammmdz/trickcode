package com.naammm.iam.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateRoleRequest(
        @NotBlank(message = "Role name is required")
        @Size(min = 2, max = 50, message = "Role name must be between 2 and 50 characters")
        @Pattern(regexp = "^[A-Z_]+$", message = "Role name can only contain uppercase letters and underscores")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description
) {}