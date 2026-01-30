package com.naammm.iam.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.Instant;
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
        User user = new User();
        user.setId(1L);

        when(userRepo.listAllSorted()).thenReturn(List.of(user));

        List<User> result = service.listUsers();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void getUser_shouldReturnUser_whenFound() {
        Long id = 1L;
        User user = new User();
        user.setId(id);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        User result = service.getUser(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    void getUser_shouldThrowNotFound_whenMissing() {
        Long id = 1L;
        when(userRepo.findByIdOptional(id)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> service.getUser(id));
    }

    @Test
    void updateUser_shouldUpdateFields_andRoles_whenRoleIdsProvided() {
        Long id = 1L;

        UpdateUserRequest req = new UpdateUserRequest(
                "New Name",
                "new@example.com",
                "https://example.com/avatar.png",
                "New bio",
                Status.ACTIVE,
                Instant.parse("2030-01-01T00:00:00Z"),
                List.of(10L)
        );

        User user = new User();
        user.setId(id);
        user.setRoles(new HashSet<>());

        Role role = new Role();
        role.setId(10L);
        role.setName("STUDENT");

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));
        when(roleRepo.findByIds(any())).thenReturn(Set.of(role));

        service.updateUser(id, req);

        assertEquals("New Name", user.getFullName());
        assertEquals("new@example.com", user.getEmail());
        assertEquals("https://example.com/avatar.png", user.getAvatarUrl());
        assertEquals("New bio", user.getBio());
        assertEquals(Status.ACTIVE, user.getStatus());
        assertEquals(Instant.parse("2030-01-01T00:00:00Z"), user.getProExpiresAt());
        assertEquals(1, user.getRoles().size());
    }

    @Test
    void updateUser_shouldNotTouchRoles_whenRoleIdsNull() {
        Long id = 1L;

        UpdateUserRequest req = new UpdateUserRequest(
                "New Name",
                "new@example.com",
                null,
                null,
                null,
                null,
                null
        );

        User user = new User();
        user.setId(id);
        user.setRoles(new HashSet<>());

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        service.updateUser(id, req);

        verify(roleRepo, never()).findByIds(any());
    }

    @Test
    void deactivateUser_shouldSetStatusInactive() {
        Long id = 1L;

        User user = new User();
        user.setId(id);
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        service.deactivateUser(id);

        assertEquals(Status.INACTIVE, user.getStatus());
    }

    @Test
    void deactivateUser_shouldThrow_whenAlreadyInactive() {
        Long id = 1L;

        User user = new User();
        user.setId(id);
        user.setStatus(Status.INACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        assertThrows(UserAlreadyInactiveException.class, () -> service.deactivateUser(id));
    }

    @Test
    void activateUser_shouldSetStatusActive() {
        Long id = 1L;

        User user = new User();
        user.setId(id);
        user.setStatus(Status.INACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        service.activateUser(id);

        assertEquals(Status.ACTIVE, user.getStatus());
    }

    @Test
    void activateUser_shouldThrow_whenAlreadyActive() {
        Long id = 1L;

        User user = new User();
        user.setId(id);
        user.setStatus(Status.ACTIVE);

        when(userRepo.findByIdOptional(id)).thenReturn(Optional.of(user));

        assertThrows(UserAlreadyActiveException.class, () -> service.activateUser(id));
    }
}
