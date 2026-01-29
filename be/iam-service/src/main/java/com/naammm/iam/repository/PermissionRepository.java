package com.naammm.iam.repository;

import com.naammm.iam.entity.Permission;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PermissionRepository implements PanacheRepository<Permission> {
}

