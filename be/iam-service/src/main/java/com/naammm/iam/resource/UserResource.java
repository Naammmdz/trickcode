package com.naammm.iam.resource;

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
    public List<User> listUsers() {
        return userService.listUsers();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN"})
    public User getUser(@PathParam("id") Long id) {
        return userService.getUser(id);
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMIN"})
    public Response updateUser(@PathParam("id") Long id, @Valid UpdateUserRequest req) {
        userService.updateUser(id, req);
        return Response.ok().build();
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
