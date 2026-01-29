package com.naammm.iam.service;

import java.util.Set;

import com.naammm.iam.dto.request.LoginRequest;
import com.naammm.iam.dto.request.ProfileUpdateRequest;
import com.naammm.iam.dto.request.RegisterRequest;
import com.naammm.iam.dto.respone.LoginResponse;
import com.naammm.iam.dto.respone.UserProfileResponse;
import com.naammm.iam.entity.Role;
import com.naammm.iam.entity.Status;
import com.naammm.iam.entity.User;
import com.naammm.iam.exception.DefaultRoleNotFoundException;
import com.naammm.iam.exception.EmailAlreadyExistsException;
import com.naammm.iam.exception.InvalidCredentialsException;
import com.naammm.iam.exception.UserInactiveException;
import com.naammm.iam.exception.UserNotFoundException;
import com.naammm.iam.exception.UserSuspendedException;
import com.naammm.iam.repository.RoleRepository;
import com.naammm.iam.repository.UserRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthService {

    @Inject UserRepository userRepo;
    @Inject RoleRepository roleRepo;
    @Inject PasswordService passwordService;
    @Inject TokenService tokenService;

    @Transactional
    public void register(RegisterRequest req) {
        // Check for existing users
        if (userRepo.findByEmail(req.email()) != null) {
            throw new EmailAlreadyExistsException(req.email());
        }

        Role studentRole = roleRepo.findByName("STUDENT");
        if (studentRole == null) {
            throw new DefaultRoleNotFoundException("STUDENT");
        }

        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email())
                .passwordHash(passwordService.hash(req.password()))
                .roles(Set.of(studentRole))
                .status(Status.ACTIVE)
                .build();

        userRepo.persist(user);
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.email());
        if (user == null || !passwordService.verify(req.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        if (user.getStatus().equals(Status.SUSPENDED)) {
            throw new UserSuspendedException();
        } else if (user.getStatus().equals(Status.INACTIVE)) {
            throw new UserInactiveException();
        }
        user.setLastLoginAt(java.time.Instant.now());
        userRepo.persist(user);
        String access = tokenService.generateAccessToken(user);
        String refresh = tokenService.generateRefreshToken(user.getEmail());
        return new LoginResponse(access, refresh, "Bearer", 1800);
    }

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException(email);
        }

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(java.util.stream.Collectors.toSet());

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getStatus(),
                user.getProExpiresAt(),
                roleNames
        );
    }

    @Transactional
    public void updateCurrentUserProfile(String email, ProfileUpdateRequest req) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException(email);
        }

        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setAvatarUrl(req.avatarUrl());
        user.setBio(req.bio());
        userRepo.persist(user);
    }
}
