package com.naammm.iam.resource;

import com.naammm.iam.dto.request.LoginRequest;
import com.naammm.iam.dto.request.ProfileUpdateRequest;
import com.naammm.iam.dto.request.RegisterRequest;
import com.naammm.iam.dto.respone.UserProfileResponse;
import com.naammm.iam.service.AuthService;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    JsonWebToken jwt;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest req) {
        authService.register(req);
        return Response.status(Response.Status.CREATED).entity("User registered successfully.").build();
    }

    @POST
    @Path("/token")
    public Response login(@Valid LoginRequest req) {
        return Response.ok(authService.login(req)).build();
    }

    @GET
    @Path("/profile")
    @RolesAllowed({"STUDENT", "ADMIN", "INSTRUCTOR"})
    public Response getProfile() {
        String email = jwt.getSubject();
        UserProfileResponse profile = authService.getCurrentUserProfile(email);
        return Response.ok(profile).build();
    }

    @PUT
    @Path("/profile")
    @RolesAllowed({"STUDENT", "ADMIN", "INSTRUCTOR"})
    public Response updateProfile(@Valid ProfileUpdateRequest req) {
        String email = jwt.getSubject();
        authService.updateCurrentUserProfile(email, req);
        return Response.ok().build();
    }

}
