package com.naammm.iam.resource;

import com.naammm.iam.dto.request.CreateUserRequest;
import com.naammm.iam.dto.request.UpdateUserRequest;
import com.naammm.iam.entity.User;
import com.naammm.iam.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserService userService;

    @GET
    @RolesAllowed({"ADMIN"})
    public Response listUsers(
            @QueryParam("q") String query,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size,
            @QueryParam("roleId") Long roleId,
            @QueryParam("status") String status) {
        return Response.ok(userService.searchUsers(query, page, size, roleId, status)).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN"})
    public User getUser(@PathParam("id") Long id) {
        return userService.getUser(id);
    }

    @POST
    @RolesAllowed({"ADMIN"})
    public Response createUser(@Valid CreateUserRequest req) {
        User user = userService.createUser(req);
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMIN"})
    public Response updateUser(@PathParam("id") Long id, @Valid UpdateUserRequest req) {
        userService.updateUser(id, req);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMIN"})
    public Response deleteUser(@PathParam("id") Long id) {
        userService.deleteUser(id);
        return Response.noContent().build();
    }

    @PUT
    @Path("/{id}/deactivate")
    @RolesAllowed({"ADMIN"})
    public Response deactivateUser(@PathParam("id") Long id) {
        userService.deactivateUser(id);
        return Response.noContent().build();
    }

    @PUT
    @Path("/{id}/activate")
    @RolesAllowed({"ADMIN"})
    public Response activateUser(@PathParam("id") Long id) {
        userService.activateUser(id);
        return Response.noContent().build();
    }
}
