package com.naammm.iam.service;

import java.util.List;
import java.util.Set;

import com.naammm.iam.dto.request.UpdateUserRequest;
import com.naammm.iam.entity.Role;
import com.naammm.iam.entity.Status;
import com.naammm.iam.entity.User;
import com.naammm.iam.exception.UserAlreadyActiveException;
import com.naammm.iam.exception.UserAlreadyInactiveException;
import com.naammm.iam.exception.UserNotFoundException;
import com.naammm.iam.repository.RoleRepository;
import com.naammm.iam.repository.UserRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepo;

    @Inject
    RoleRepository roleRepo;

    public List<User> listUsers() {
        return userRepo.listAllSorted();
    }

    public User getUser(Long id) {
        return userRepo.findByIdOptional(id)
                .orElseThrow(() -> new UserNotFoundException(id));
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
    public void deactivateUser(Long id) {
        User user = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (!user.getStatus().equals(Status.ACTIVE)) {
            throw new UserAlreadyInactiveException(id);
        }

        user.setStatus(Status.INACTIVE);
    }    @Transactional
    public void activateUser(Long id) {
        User user = userRepo.findByIdOptional(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (user.getStatus().equals(Status.ACTIVE)) {
            throw new UserAlreadyActiveException(id);
        }

        user.setStatus(Status.ACTIVE);
    }
}
