package com.naammm.iam.service;

import java.util.List;
import java.util.Set;

import com.naammm.iam.dto.request.CreateUserRequest;
import com.naammm.iam.dto.request.UpdateUserRequest;
import com.naammm.iam.entity.Role;
import com.naammm.iam.entity.Status;
import com.naammm.iam.entity.User;
import com.naammm.iam.exception.DefaultRoleNotFoundException;
import com.naammm.iam.exception.EmailAlreadyExistsException;
import com.naammm.iam.exception.UserAlreadyActiveException;
import com.naammm.iam.exception.UserAlreadyInactiveException;
import com.naammm.iam.exception.UserNotFoundException;
import com.naammm.iam.repository.RoleRepository;
import com.naammm.iam.repository.RoleRepository;
import com.naammm.iam.repository.UserRepository;
import com.naammm.iam.dto.response.PageResponse;
import io.quarkus.hibernate.orm.panache.PanacheQuery;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepo;

    @Inject
    RoleRepository roleRepo;

    @Inject
    PasswordService passwordService;

    public List<User> listUsers() {
        return userRepo.listAllSorted();
    }

    public PageResponse<User> searchUsers(String query, int page, int size, Long roleId, String status) {
        PanacheQuery<User> q = userRepo.search(query, roleId, status);
        q.page(page, size);
        return PageResponse.of(q.list(), page, size, q.count());
    }

    public User getUser(Long id) {
        return userRepo.findByIdOptional(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    public User createUser(CreateUserRequest req) {
        if (userRepo.findByEmail(req.email()) != null) {
            throw new EmailAlreadyExistsException(req.email());
        }

        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPasswordHash(passwordService.hash(req.password()));
        user.setStatus(Status.ACTIVE);

        if (req.roleIds() != null && !req.roleIds().isEmpty()) {
            Set<Role> roles = roleRepo.findByIds(req.roleIds());
            user.setRoles(roles);
        } else {
            Role studentRole = roleRepo.findByName("STUDENT");
            if (studentRole == null) {
                throw new DefaultRoleNotFoundException("Default role STUDENT not found for user creation.");
            }
            user.setRoles(Set.of(studentRole));
        }

        userRepo.persist(user);
        return user;
    }

    @Transactional
    public void updateUser(Long id, UpdateUserRequest req) {
        User user = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setAvatarUrl(req.avatarUrl());
        user.setBio(req.bio());
        if (req.status() != null) {
            user.setStatus(req.status());
        }
        user.setProExpiresAt(req.proExpiresAt());

        if (req.roleIds() != null && !req.roleIds().isEmpty()) {
            Set<Role> roles = roleRepo.findByIds(req.roleIds());
            user.getRoles().clear();
            user.getRoles().addAll(roles);
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        boolean deleted = userRepo.deleteById(id);
        if (!deleted) {
            throw new UserNotFoundException(id);
        }
    }

    @Transactional
    public void deactivateUser(Long id) {
        User user = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (!user.getStatus().equals(Status.ACTIVE)) {
            throw new UserAlreadyInactiveException(id);
        }

        user.setStatus(Status.INACTIVE);
    }

    @Transactional
    public void activateUser(Long id) {
        User user = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (user.getStatus().equals(Status.ACTIVE)) {
            throw new UserAlreadyActiveException(id);
        }

        user.setStatus(Status.ACTIVE);
    }
}
