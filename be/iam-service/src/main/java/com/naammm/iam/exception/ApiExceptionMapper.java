package com.naammm.iam.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

@Provider
public class ApiExceptionMapper implements ExceptionMapper<Exception> {
    @Override
    public Response toResponse(Exception e) {
        if (e instanceof ApiException apiEx) {
            return Response.status(apiEx.getHttpStatus())
                    .entity(Map.of(
                        "error", e.getMessage(),
                        "code", apiEx.getErrorCode(),
                        "status", apiEx.getHttpStatus()
                    ))
                    .build();
        } else if (e instanceof jakarta.ws.rs.WebApplicationException webEx) {
            return Response.status(webEx.getResponse().getStatus())
                    .entity(Map.of(
                        "error", e.getMessage(),
                        "code", "WEB_APPLICATION_ERROR",
                        "status", webEx.getResponse().getStatus()
                    ))
                    .build();
        } else {
            return Response.status(500)
                    .entity(Map.of(
                        "error", "Internal server error",
                        "code", "INTERNAL_SERVER_ERROR",
                        "status", 500
                    ))
                    .build();
        }
    }
}
