// package com.naammm.iam.config;

// import jakarta.ws.rs.container.ContainerRequestContext;
// import jakarta.ws.rs.container.ContainerResponseContext;
// import jakarta.ws.rs.container.ContainerResponseFilter;
// import jakarta.ws.rs.core.MultivaluedMap;
// import jakarta.ws.rs.ext.Provider;

// @Provider
// public class CorsFilter implements ContainerResponseFilter {

//     @Override
//     public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
//         MultivaluedMap<String, Object> headers = responseContext.getHeaders();

//         headers.add("Access-Control-Allow-Origin", "http://localhost:5173");
//         headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//         headers.add("Access-Control-Allow-Headers", "accept, authorization, content-type, x-requested-with");
//         headers.add("Access-Control-Allow-Credentials", "true");
//     }
// }