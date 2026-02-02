package com.naammm.iam.repository;

import java.util.List;
import java.util.Set;

import com.naammm.iam.entity.Role;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RoleRepository implements PanacheRepository<Role> {

    public Role findByName(String name) {
        return find("name", name).firstResult();
    }

    public List<Role> listAllSorted() {
        return listAll(Sort.by("name"));
    }

    public Set<Role> findByIds(List<Long> ids) {
        return Set.copyOf(list("id in ?1", ids));
    }

    public io.quarkus.hibernate.orm.panache.PanacheQuery<Role> search(String query) {
        if (query == null || query.isBlank()) {
            return findAll(io.quarkus.panache.common.Sort.by("id").descending());
        }
        String search = "%" + query.toLowerCase() + "%";
        return find("lower(name) like ?1 or lower(description) like ?1 or cast(id as string) like ?1", io.quarkus.panache.common.Sort.by("id").descending(), search);
    }
}