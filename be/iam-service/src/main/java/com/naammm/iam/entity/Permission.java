package com.naammm.iam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "permissions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "resource_type", length = 50)
    private String resourceType; // PATIENT, TEST_ORDER, INSTRUMENT, etc.

    @Column(name = "action_type", length = 50)
    private String actionType; // VIEW, CREATE, UPDATE, DELETE, etc.

    // Constructor with name
    public Permission(String name) {
        this.name = name;
    }

    // Constructor with name and description
    public Permission(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Constructor with full details
    public Permission(String name, String description, String resourceType, String actionType) {
        this.name = name;
        this.description = description;
        this.resourceType = resourceType;
        this.actionType = actionType;
    }
}

