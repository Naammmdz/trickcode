package com.naammm.iam.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.naammm.iam.dto.request.ForgotPasswordRequest;
import com.naammm.iam.dto.request.LoginRequest;
import com.naammm.iam.dto.request.RegisterRequest;
import com.naammm.iam.dto.request.ResetPasswordRequest;
import com.naammm.iam.dto.request.VerifyRequest;
import com.naammm.iam.dto.respone.LoginResponse;
import com.naammm.iam.entity.Gender;
import com.naammm.iam.entity.Role;
import com.naammm.iam.entity.Status;
import com.naammm.iam.entity.User;
import com.naammm.iam.exception.EmailAlreadyExistsException;
import com.naammm.iam.exception.InvalidCredentialsException;
import com.naammm.iam.exception.InvalidOtpException;
import com.naammm.iam.exception.UserNotFoundException;
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
    @Mock
    private OtpService otpService;
    @Mock
    private MailService mailService;

    @InjectMocks
    private AuthService service;

    @Test
    void register_shouldCreateUser_whenValid() {
        // Arrange
        RegisterRequest req = new RegisterRequest(
            "John Doe", "john@example.com", "1234567890", "ID123",
            Gender.MALE, 30, "Address", LocalDate.of(1995, 1, 1), "Password123!"
        );
        Role role = new Role();
        role.setName("NORMAL_USER");

        when(userRepo.findByEmail(anyString())).thenReturn(null);
        when(userRepo.findByPhoneNumber(anyString())).thenReturn(null);
        when(userRepo.findByIdentifier(anyString())).thenReturn(null);
        when(roleRepo.findByName("NORMAL_USER")).thenReturn(role);
        when(passwordService.hash(anyString())).thenReturn("hashed");

        // Act
        service.register(req);

        // Assert
        verify(userRepo).persist(any(User.class));
        verify(otpService).saveOtp(anyString(), anyString());
        verify(mailService).sendOtpMail(anyString(), anyString());
    }

    @Test
    void register_shouldThrow_whenEmailExists() {
        // Arrange
        RegisterRequest req = new RegisterRequest(
            "John Doe", "john@example.com", "1234567890", "ID123",
            Gender.MALE, 30, "Address", LocalDate.of(1995, 1, 1), "Password123!"
        );
        when(userRepo.findByEmail(req.email())).thenReturn(new User());

        // Act & Assert
        assertThrows(EmailAlreadyExistsException.class, () -> service.register(req));
    }

    @Test
    void verifyOtp_shouldActivateUser_whenValid() {
        // Arrange
        VerifyRequest req = new VerifyRequest("john@example.com", "123456");
        User user = new User();
        user.setEmail("john@example.com");
        user.setStatus(Status.PENDING_VERIFICATION);

        when(otpService.validateOtp(req.email(), req.otp())).thenReturn(true);
        when(userRepo.findByEmail(req.email())).thenReturn(user);

        // Act
        service.verifyOtp(req);

        // Assert
        assertEquals(Status.ACTIVE, user.getStatus());
        verify(userRepo).persist(user);
    }

    @Test
    void verifyOtp_shouldThrow_whenInvalidOtp() {
        // Arrange
        VerifyRequest req = new VerifyRequest("john@example.com", "123456");
        when(otpService.validateOtp(req.email(), req.otp())).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidOtpException.class, () -> service.verifyOtp(req));
    }

    @Test
    void login_shouldReturnToken_whenValid() {
        // Arrange
        LoginRequest req = new LoginRequest("john@example.com", "Password123!");
        User user = new User();
        user.setEmail("john@example.com");
        user.setPasswordHash("hashed");
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByEmail(req.email())).thenReturn(user);
        when(passwordService.verify(req.password(), user.getPasswordHash())).thenReturn(true);
        when(tokenService.generateAccessToken(user)).thenReturn("access_token");
        when(tokenService.generateRefreshToken(anyString())).thenReturn("refresh_token");

        // Act
        LoginResponse res = service.login(req);

        // Assert
        assertNotNull(res);
        assertEquals("access_token", res.access_token());
        assertEquals("refresh_token", res.refresh_token());
    }

    @Test
    void login_shouldThrow_whenInvalidCredentials() {
        // Arrange
        LoginRequest req = new LoginRequest("john@example.com", "WrongPass");
        User user = new User();
        user.setPasswordHash("hashed");

        when(userRepo.findByEmail(req.email())).thenReturn(user);
        when(passwordService.verify(req.password(), user.getPasswordHash())).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> service.login(req));
    }

    @Test
    void forgotPassword_shouldSendOtp_whenUserActive() {
        // Arrange
        ForgotPasswordRequest req = new ForgotPasswordRequest("john@example.com");
        User user = new User();
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByEmail(req.email())).thenReturn(user);

        // Act
        service.forgotPassword(req);

        // Assert
        verify(otpService).saveOtp(anyString(), anyString());
        verify(mailService).sendPasswordResetOtp(anyString(), anyString());
    }

    @Test
    void resetPassword_shouldUpdatePassword_whenValid() {
        // Arrange
        ResetPasswordRequest req = new ResetPasswordRequest("john@example.com", "123456", "NewPass123!");
        User user = new User();
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByEmail(req.email())).thenReturn(user);
        when(otpService.validateOtp(req.email(), req.otp())).thenReturn(true);
        when(passwordService.hash(req.newPassword())).thenReturn("new_hashed");

        // Act
        service.resetPassword(req);

        // Assert
        assertEquals("new_hashed", user.getPasswordHash());
        verify(userRepo).persist(user);
    }
}
