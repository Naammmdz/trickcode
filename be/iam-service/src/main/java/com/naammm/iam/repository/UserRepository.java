package com.naammm.iam.repository;

import java.util.List;

import com.naammm.iam.entity.Status;
import com.naammm.iam.entity.User;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {
    public User findByEmail(String email) {
        return find("email", email).firstResult();
    }

    public List<User> listAllSorted() {
        return listAll(Sort.by("fullName"));
    }

    public User findActiveById(Long id) {
        return find("id = ?1 and status = ?2", id, Status.ACTIVE).firstResult();
    }

    public io.quarkus.hibernate.orm.panache.PanacheQuery<User> search(String query, Long roleId, String status) {
        StringBuilder queryBuilder = new StringBuilder("select distinct u from User u left join u.roles r where 1=1");
        java.util.Map<String, Object> params = new java.util.HashMap<>();

        if (query != null && !query.isBlank()) {
            queryBuilder.append(" and (lower(u.fullName) like :query or lower(u.email) like :query or cast(u.id as string) like :query)");
            params.put("query", "%" + query.toLowerCase() + "%");
        }
        
        if (roleId != null) {
            queryBuilder.append(" and r.id = :roleId");
            params.put("roleId", roleId);
        }

        if (status != null && !status.isBlank()) {
            try {
                queryBuilder.append(" and u.status = :status");
                params.put("status", Status.valueOf(status));
            } catch (IllegalArgumentException e) {
                // Ignore invalid status
            }
        }

        return find(queryBuilder.toString(), io.quarkus.panache.common.Sort.by("u.id").descending(), params);
    }
}
