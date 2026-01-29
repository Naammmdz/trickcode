package com.naammm.iam.dto.respone;

public record LoginResponse(
        String access_token,
        String refresh_token,
        String token_type,
        long expires_in
) {}
