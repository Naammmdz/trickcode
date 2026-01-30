package com.naammm.agw.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import reactor.core.publisher.Mono;

import java.util.Collection;

/**
 * Security configuration for Spring Cloud Gateway (WebFlux)
 * Configures OAuth2 Resource Server to validate JWT tokens from Authorization Server
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                // Disable CSRF for API Gateway (stateless, uses JWT)
                .csrf(csrf -> csrf.disable())

                // Configure OAuth2 Resource Server
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )

                // Configure authorization rules
                .authorizeExchange(exchanges -> exchanges
                        // Allow actuator endpoints (health checks, metrics)
                        .pathMatchers("/actuator/**").permitAll()

                        // Allow OAuth2 endpoints to be called directly (not through Gateway)
                        .pathMatchers("/oauth2/**").permitAll()
                        .pathMatchers("/.well-known/**").permitAll()

                        // Allow IAM auth endpoints through gateway (login/register/refresh/forgot...)
                        // These must be public because the user won't have a token yet.
                        .pathMatchers("/iam-service/auth/**").permitAll()

                        // All other routes require authentication
                        .anyExchange().authenticated()
                );

        return http.build();
    }

    /**
     * Reactive JWT authentication converter for WebFlux.
     * Maps IAM roles in claim "groups" (e.g. ["STUDENT"]) to Spring authorities (ROLE_STUDENT).
     */
    private Converter<Jwt, Mono<AbstractAuthenticationToken>> jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("groups");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        return jwt -> {
            Collection<GrantedAuthority> authorities = authoritiesConverter.convert(jwt);
            return Mono.just(new JwtAuthenticationToken(jwt, authorities));
        };
    }
}
