package com.naammm.iam.resource;

import java.io.InputStream;
import java.math.BigInteger;
import java.security.Key;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * JWKS endpoint so other services (e.g., API Gateway) can verify JWTs issued by this IAM.
 */
@Path("/.well-known/jwks.json")
@Produces(MediaType.APPLICATION_JSON)
public class JwksResource {

    @ConfigProperty(name = "smallrye.jwt.sign.key.location", defaultValue = "keystore.jks")
    String keystoreLocation;

    @ConfigProperty(name = "smallrye.jwt.keystore.type", defaultValue = "PKCS12")
    String keystoreType;

    @ConfigProperty(name = "smallrye.jwt.keystore.password", defaultValue = "secret")
    String keystorePassword;

    @ConfigProperty(name = "smallrye.jwt.keystore.sign.key.alias", defaultValue = "mykey")
    String keyAlias;

    @PermitAll
    @GET
    public Map<String, Object> jwks() throws Exception {
        RSAPublicKey publicKey = loadRsaPublicKeyFromKeystore();

        String n = base64Url(publicKey.getModulus());
        String e = base64Url(publicKey.getPublicExponent());

        Map<String, Object> jwk = new HashMap<>();
        jwk.put("kty", "RSA");
        jwk.put("kid", keyAlias);
        jwk.put("use", "sig");
        jwk.put("alg", "RS256");
        jwk.put("n", n);
        jwk.put("e", e);

        return Map.of("keys", List.of(jwk));
    }

    private RSAPublicKey loadRsaPublicKeyFromKeystore() throws Exception {
        try (InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(keystoreLocation)) {
            if (is == null) {
                throw new IllegalStateException("Keystore not found on classpath: " + keystoreLocation);
            }
            KeyStore ks = KeyStore.getInstance(keystoreType);
            ks.load(is, keystorePassword.toCharArray());

            Certificate cert = ks.getCertificate(keyAlias);
            if (cert == null) {
                throw new IllegalStateException("Certificate not found for alias: " + keyAlias);
            }
            Key pk = cert.getPublicKey();
            if (!(pk instanceof RSAPublicKey rsa)) {
                throw new IllegalStateException("Public key is not RSA for alias: " + keyAlias);
            }
            return rsa;
        }
    }

    private static String base64Url(BigInteger v) {
        byte[] bytes = v.toByteArray();
        // Ensure unsigned big-endian for JWK n/e
        if (bytes.length > 1 && bytes[0] == 0) {
            byte[] tmp = new byte[bytes.length - 1];
            System.arraycopy(bytes, 1, tmp, 0, tmp.length);
            bytes = tmp;
        }
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

