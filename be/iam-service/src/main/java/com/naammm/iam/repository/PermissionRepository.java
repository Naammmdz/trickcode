package com.naammm.iam.repository;

import com.naammm.iam.entity.Permission;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PermissionRepository implements PanacheRepository<Permission> {

    public java.util.Set<Permission> findByIds(java.util.List<Long> ids) {
        return java.util.Set.copyOf(list("id in ?1", ids));
    }

    public io.quarkus.hibernate.orm.panache.PanacheQuery<Permission> search(String query) {
        if (query == null || query.isBlank()) {
            return findAll(io.quarkus.panache.common.Sort.by("id").descending());
        }
        String search = "%" + query.toLowerCase() + "%";
        return find("lower(name) like ?1 or lower(description) like ?1 or cast(id as string) like ?1", io.quarkus.panache.common.Sort.by("id").descending(), search);
    }
}

