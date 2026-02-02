package com.naammm.iam.service;

import java.util.List;

import com.naammm.iam.dto.request.CreateRoleRequest;
import com.naammm.iam.dto.request.UpdateRoleRequest;
import com.naammm.iam.entity.Role;
import com.naammm.iam.exception.RoleAlreadyExistsException;
import com.naammm.iam.exception.RoleNotFoundException;
import com.naammm.iam.repository.RoleRepository;
import com.naammm.iam.dto.response.PageResponse; 
import io.quarkus.hibernate.orm.panache.PanacheQuery;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class RoleService {

    @Inject
    RoleRepository roleRepo;

    @Inject
    com.naammm.iam.repository.PermissionRepository permissionRepo;

    public List<Role> listRoles() {
        return roleRepo.listAllSorted();
    }

    public PageResponse<Role> searchRoles(String query, int page, int size) {
        PanacheQuery<Role> q = roleRepo.search(query);
        q.page(page, size);
        return PageResponse.of(q.list(), page, size, q.count());
    }

    public Role getRole(Long id) {
        return roleRepo.findByIdOptional(id)
                .orElseThrow(() -> new RoleNotFoundException(id));
    }

    public Role getRoleByName(String name) {
        Role role = roleRepo.findByName(name);
        if (role == null) {
            throw new RoleNotFoundException(name);
        }
        return role;
    }

    @Transactional
    public Role createRole(CreateRoleRequest req) {
        if (roleRepo.findByName(req.name()) != null) {
            throw new RoleAlreadyExistsException(req.name());
        }

        Role role = new Role(req.name(), req.description());

        if (req.permissionIds() != null && !req.permissionIds().isEmpty()) {
            java.util.Set<com.naammm.iam.entity.Permission> permissions = permissionRepo.findByIds(req.permissionIds());
            role.setPermissions(permissions);
        }

        roleRepo.persist(role);
        return role;
    }

    @Transactional
    public Role updateRole(Long id, UpdateRoleRequest req) {
        Role role = roleRepo.findByIdOptional(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        // Check if another role with the same name exists
        Role existingRole = roleRepo.findByName(req.name());
        if (existingRole != null && !existingRole.getId().equals(id)) {
            throw new RoleAlreadyExistsException(req.name());
        }

        role.setName(req.name());
        role.setDescription(req.description());

        if (req.permissionIds() != null && !req.permissionIds().isEmpty()) {
             java.util.Set<com.naammm.iam.entity.Permission> permissions = permissionRepo.findByIds(req.permissionIds());
             role.getPermissions().clear();
             role.getPermissions().addAll(permissions);
        }

        roleRepo.persist(role);
        return role;
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepo.findByIdOptional(id)
                .orElseThrow(() -> new RoleNotFoundException(id));

        roleRepo.delete(role);
    }

    @Transactional
    public void addPermissionToRole(Long roleId, Long permissionId) {
        Role role = roleRepo.findByIdOptional(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));

        com.naammm.iam.entity.Permission permission = permissionRepo.findByIdOptional(permissionId)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with id: " + permissionId));

        role.getPermissions().add(permission);
        roleRepo.persist(role);
    }

    @Transactional
    public void removePermissionFromRole(Long roleId, Long permissionId) {
        Role role = roleRepo.findByIdOptional(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));

        com.naammm.iam.entity.Permission permission = permissionRepo.findByIdOptional(permissionId)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with id: " + permissionId));

        role.getPermissions().remove(permission);
        roleRepo.persist(role);
    }

    public List<String> getPermissionsByRoleId(Long roleId) {
        Role role = roleRepo.findByIdOptional(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));
        
        return role.getPermissions().stream()
                .map(com.naammm.iam.entity.Permission::getName)
                .collect(java.util.stream.Collectors.toList());
    }
}