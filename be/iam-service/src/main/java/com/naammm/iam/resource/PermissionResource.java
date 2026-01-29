package com.naammm.iam.resource;

import com.naammm.iam.entity.Permission;
import com.naammm.iam.service.PermissionService;
import com.naammm.iam.dto.PermissionCheckRequest;
import com.naammm.iam.dto.PermissionCheckResponse;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/permissions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PermissionResource {

    @Inject
    PermissionService permissionService;

    @GET
    @RolesAllowed("ADMIN")
    public List<Permission> listPermissions() {
        return permissionService.listPermissions();
    }

    @GET
    @Path("/mappings")
    @PermitAll  // Allow services to call this without authentication
    public Map<String, List<String>> getRolePermissionMappings() {
        return permissionService.getRolePermissionMappings();
    }

    @GET
    @Path("/by-role/{roleName}")
    @PermitAll  // Allow services to call this
    public List<String> getPermissionsByRole(@PathParam("roleName") String roleName) {
        return permissionService.getPermissionsByRole(roleName);
    }

    @POST
    @Path("/check")
    @PermitAll
    public PermissionCheckResponse checkPermission(PermissionCheckRequest request) {
        boolean allowed = permissionService.hasUserPermission(request.getUserId(), request.getPermission());
        return new PermissionCheckResponse(allowed);
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Permission getPermission(@PathParam("id") Long id) {
        return permissionService.getPermission(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response createPermission(Permission permission) {
        permissionService.createPermission(permission);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response updatePermission(@PathParam("id") Long id, Permission permission) {
        permissionService.updatePermission(id, permission);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deletePermission(@PathParam("id") Long id) {
        permissionService.deletePermission(id);
        return Response.noContent().build();
    }
}

