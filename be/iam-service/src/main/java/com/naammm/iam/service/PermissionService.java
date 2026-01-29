package com.naammm.iam.service;

import com.naammm.iam.entity.Permission;
import com.naammm.iam.entity.Role;
import com.naammm.iam.repository.PermissionRepository;
import com.naammm.iam.repository.RoleRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.jboss.logging.Logger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class PermissionService {

    private static final Logger LOG = Logger.getLogger(PermissionService.class);

    @Inject
    PermissionRepository permissionRepository;

    @Inject
    RoleRepository roleRepository;

    @Inject
    com.naammm.iam.repository.UserRepository userRepository;

    public List<Permission> listPermissions() {
        return permissionRepository.listAll();
    }

    public Permission getPermission(Long id) {
        Permission permission = permissionRepository.findById(id);
        if (permission == null) {
            throw new NotFoundException("Permission not found with id: " + id);
        }
        return permission;
    }

    @Transactional
    public void createPermission(Permission permission) {
        permissionRepository.persist(permission);
        LOG.infof("Created permission: %s", permission.getName());
    }

    @Transactional
    public void updatePermission(Long id, Permission updatedPermission) {
        Permission permission = getPermission(id);
        permission.setName(updatedPermission.getName());
        permission.setDescription(updatedPermission.getDescription());
        permission.setResourceType(updatedPermission.getResourceType());
        permission.setActionType(updatedPermission.getActionType());
        permissionRepository.persist(permission);
        LOG.infof("Updated permission: %s", permission.getName());
    }

    @Transactional
    public void deletePermission(Long id) {
        Permission permission = getPermission(id);
        permissionRepository.delete(permission);
        LOG.infof("Deleted permission: %s", permission.getName());
    }

    /**
     * Get all role-permission mappings for caching in other services
     * Returns Map<RoleName, List<PermissionName>>
     */
    public Map<String, List<String>> getRolePermissionMappings() {
        List<Role> roles = roleRepository.listAll();
        Map<String, List<String>> mappings = new HashMap<>();

        for (Role role : roles) {
            List<String> permissionNames = role.getPermissions().stream()
                    .map(Permission::getName)
                    .collect(Collectors.toList());
            mappings.put(role.getName(), permissionNames);
        }

        LOG.infof("Retrieved role-permission mappings for %d roles", roles.size());
        return mappings;
    }

    /**
     * Get permissions for a specific role
     */
    public List<String> getPermissionsByRole(String roleName) {
        Role role = roleRepository.find("name", roleName).firstResult();
        if (role == null) {
            LOG.warnf("Role not found: %s", roleName);
            return List.of();
        }

        List<String> permissionNames = role.getPermissions().stream()
                .map(Permission::getName)
                .collect(Collectors.toList());

        LOG.infof("Retrieved %d permissions for role: %s", permissionNames.size(), roleName);
        return permissionNames;
    }

    /**
     * Check if a user has a specific permission
     */
    public boolean hasUserPermission(Long userId, String permissionName) {
        com.naammm.iam.entity.User user = userRepository.findById(userId);
        if (user == null) {
            LOG.warnf("User not found for permission check: %d", userId);
            return false;
        }

        // Check if any of the user's roles have the requested permission
        boolean hasPermission = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .anyMatch(permission -> permission.getName().equals(permissionName));

        if (hasPermission) {
            LOG.debugf("User %d has permission %s", userId, permissionName);
        } else {
            LOG.debugf("User %d does NOT have permission %s", userId, permissionName);
        }

        return hasPermission;
    }
}

