package com.naammm.iam.resource;

import java.util.List;

import com.naammm.iam.dto.request.CreateRoleRequest;
import com.naammm.iam.dto.request.UpdateRoleRequest;
import com.naammm.iam.entity.Role;
import com.naammm.iam.service.RoleService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/roles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoleResource {

    @Inject
    RoleService roleService;

    @GET
    @RolesAllowed("ADMIN")
    public List<Role> listRoles() {
        return roleService.listRoles();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Role getRole(@PathParam("id") Long id) {
        return roleService.getRole(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response createRole(@Valid CreateRoleRequest req) {
        Role role = roleService.createRole(req);
        return Response.status(Response.Status.CREATED).entity(role).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response updateRole(@PathParam("id") Long id, @Valid UpdateRoleRequest req) {
        Role role = roleService.updateRole(id, req);
        return Response.ok(role).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deleteRole(@PathParam("id") Long id) {
        roleService.deleteRole(id);
        return Response.noContent().build();
    }

    @POST
    @Path("/{roleId}/permissions/{permissionId}")
    @RolesAllowed("ADMIN")
    public Response addPermissionToRole(@PathParam("roleId") Long roleId, @PathParam("permissionId") Long permissionId) {
        roleService.addPermissionToRole(roleId, permissionId);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{roleId}/permissions/{permissionId}")
    @RolesAllowed("ADMIN")
    public Response removePermissionFromRole(@PathParam("roleId") Long roleId, @PathParam("permissionId") Long permissionId) {
        roleService.removePermissionFromRole(roleId, permissionId);
        return Response.noContent().build();
    }

    @GET
    @Path("/{id}/permissions")
    @RolesAllowed({"ADMIN"})
    public List<String> getRolePermissions(@PathParam("id") Long id) {
        return roleService.getPermissionsByRoleId(id);
    }
}