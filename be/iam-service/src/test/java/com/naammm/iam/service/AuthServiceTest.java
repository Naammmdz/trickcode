package com.naammm.iam.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.naammm.iam.dto.request.LoginRequest;
import com.naammm.iam.dto.request.RegisterRequest;
import com.naammm.iam.dto.respone.LoginResponse;
import com.naammm.iam.entity.Role;
import com.naammm.iam.entity.Status;
import com.naammm.iam.entity.User;
import com.naammm.iam.exception.DefaultRoleNotFoundException;
import com.naammm.iam.exception.EmailAlreadyExistsException;
import com.naammm.iam.exception.InvalidCredentialsException;
import com.naammm.iam.exception.UserInactiveException;
import com.naammm.iam.exception.UserSuspendedException;
import com.naammm.iam.repository.RoleRepository;
import com.naammm.iam.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private RoleRepository roleRepo;

    @Mock
    private PasswordService passwordService;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthService service;

    @Test
    void register_shouldCreateUser_whenValid() {
        RegisterRequest req = new RegisterRequest("John Doe", "john@example.com", "Password123!");

        Role studentRole = new Role();
        studentRole.setName("STUDENT");

        when(userRepo.findByEmail(req.email())).thenReturn(null);
        when(roleRepo.findByName("STUDENT")).thenReturn(studentRole);
        when(passwordService.hash(req.password())).thenReturn("hashed");

        service.register(req);

        verify(userRepo).persist(any(User.class));
    }

    @Test
    void register_shouldThrow_whenEmailExists() {
        RegisterRequest req = new RegisterRequest("John Doe", "john@example.com", "Password123!");

        when(userRepo.findByEmail(req.email())).thenReturn(new User());

        assertThrows(EmailAlreadyExistsException.class, () -> service.register(req));
    }

    @Test
    void register_shouldThrow_whenDefaultRoleMissing() {
        RegisterRequest req = new RegisterRequest("John Doe", "john@example.com", "Password123!");

        when(userRepo.findByEmail(req.email())).thenReturn(null);
        when(roleRepo.findByName("STUDENT")).thenReturn(null);

        assertThrows(DefaultRoleNotFoundException.class, () -> service.register(req));
    }

    @Test
    void login_shouldReturnToken_whenValid() {
        LoginRequest req = new LoginRequest("john@example.com", "Password123!");

        Role studentRole = new Role();
        studentRole.setName("STUDENT");

        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash("hashed");
        user.setStatus(Status.ACTIVE);
        user.setRoles(java.util.Set.of(studentRole));

        when(userRepo.findByEmail(req.email())).thenReturn(user);
        when(passwordService.verify(req.password(), user.getPasswordHash())).thenReturn(true);
        when(tokenService.generateAccessToken(user)).thenReturn("access_token");
        when(tokenService.generateRefreshToken(user.getEmail())).thenReturn("refresh_token");

        LoginResponse res = service.login(req);

        assertNotNull(res);
        assertEquals("access_token", res.access_token());
        assertEquals("refresh_token", res.refresh_token());
    }

    @Test
    void login_shouldThrow_whenInvalidCredentials() {
        LoginRequest req = new LoginRequest("john@example.com", "WrongPass");

        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash("hashed");
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByEmail(req.email())).thenReturn(user);
        when(passwordService.verify(req.password(), user.getPasswordHash())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> service.login(req));
    }

    @Test
    void login_shouldThrow_whenUserSuspended() {
        LoginRequest req = new LoginRequest("john@example.com", "Password123!");

        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash("hashed");
        user.setStatus(Status.SUSPENDED);

        when(userRepo.findByEmail(req.email())).thenReturn(user);
        when(passwordService.verify(req.password(), user.getPasswordHash())).thenReturn(true);

        assertThrows(UserSuspendedException.class, () -> service.login(req));
    }

    @Test
    void login_shouldThrow_whenUserInactive() {
        LoginRequest req = new LoginRequest("john@example.com", "Password123!");

        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash("hashed");
        user.setStatus(Status.INACTIVE);

        when(userRepo.findByEmail(req.email())).thenReturn(user);
        when(passwordService.verify(req.password(), user.getPasswordHash())).thenReturn(true);

        assertThrows(UserInactiveException.class, () -> service.login(req));
    }
}
