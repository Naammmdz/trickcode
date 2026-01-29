package com.naammm.iam.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.naammm.iam.dto.request.UpdateUserRequest;
import com.naammm.iam.entity.Gender;
import com.naammm.iam.entity.Role;
import com.naammm.iam.entity.Status;
import com.naammm.iam.entity.User;
import com.naammm.iam.exception.UserAlreadyActiveException;
import com.naammm.iam.exception.UserAlreadyInactiveException;
import com.naammm.iam.exception.UserNotFoundException;
import com.naammm.iam.repository.RoleRepository;
import com.naammm.iam.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private RoleRepository roleRepo;

    @InjectMocks
    private UserService service;

    @Test
    void listUsers_shouldReturnList() {
        // Arrange
        User user = new User();
        user.setId(1L);
        when(userRepo.listAllSorted()).thenReturn(List.of(user));

        // Act
        List<User> result = service.listUsers();

        // Assert
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getUser_shouldReturnUser_whenFound() {
        // Arrange
        Long id = 1L;
        User user = new User();
        user.setId(id);
        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        // Act
        User result = service.getUser(id);

        // Assert
        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    void getUser_shouldThrowNotFound_whenMissing() {
        // Arrange
        Long id = 1L;
        when(userRepo.findByIdOptional(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> service.getUser(id));
    }

    @Test
    void updateUser_shouldUpdateFields() {
        // Arrange
        Long id = 1L;
        UpdateUserRequest req = new UpdateUserRequest(
            "New Name",
            "new@example.com",
            "1234567890",
            Gender.MALE,
            30,
            "New Address",
            LocalDate.of(1990, 1, 1),
            List.of(10L)
        );

        User user = new User();
        user.setId(id);
        user.setRoles(new HashSet<>());

        Role role = new Role();
        role.setId(10L);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));
        when(roleRepo.findByIds(any())).thenReturn(Set.of(role));

        // Act
        service.updateUser(id, req);

        // Assert
        assertEquals("New Name", user.getFullName());
        assertEquals("new@example.com", user.getEmail());
        assertEquals(1, user.getRoles().size());
    }

    @Test
    void deactivateUser_shouldSetStatusInactive() {
        // Arrange
        Long id = 1L;
        User user = new User();
        user.setId(id);
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        // Act
        service.deactivateUser(id);

        // Assert
        assertEquals(Status.INACTIVE, user.getStatus());
    }

    @Test
    void deactivateUser_shouldThrow_whenAlreadyInactive() {
        // Arrange
        Long id = 1L;
        User user = new User();
        user.setId(id);
        user.setStatus(Status.INACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(UserAlreadyInactiveException.class, () -> service.deactivateUser(id));
    }

    @Test
    void activateUser_shouldSetStatusActive() {
        // Arrange
        Long id = 1L;
        User user = new User();
        user.setId(id);
        user.setStatus(Status.INACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        // Act
        service.activateUser(id);

        // Assert
        assertEquals(Status.ACTIVE, user.getStatus());
    }

    @Test
    void activateUser_shouldThrow_whenAlreadyActive() {
        // Arrange
        Long id = 1L;
        User user = new User();
        user.setId(id);
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(UserAlreadyActiveException.class, () -> service.activateUser(id));
    }
}
