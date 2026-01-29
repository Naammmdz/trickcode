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
}
