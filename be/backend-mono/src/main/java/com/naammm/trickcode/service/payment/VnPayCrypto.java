package com.naammm.trickcode.service.payment;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.util.StringUtils;

public final class VnPayCrypto {

    private VnPayCrypto() {}

    public static String hmacSha512(String secret, String data) {
        if (!StringUtils.hasText(secret) || data == null) {
            throw new IllegalArgumentException("VNPay secret and data must be provided");
        }
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(keySpec);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return toHexLower(bytes);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to compute HMAC-SHA512", e);
        }
    }

    public static boolean verifySecureHash(Map<String, String> params, String secret) {
        if (params == null || params.isEmpty()) {
            return false;
        }
        String provided = params.get("vnp_SecureHash");
        if (!StringUtils.hasText(provided)) {
            return false;
        }

        Map<String, String> filtered = new LinkedHashMap<>();
        params.forEach((k, v) -> {
            if (v == null) {
                return;
            }
            if ("vnp_SecureHash".equals(k) || "vnp_SecureHashType".equals(k)) {
                return;
            }
            filtered.put(k, v);
        });

        String dataToSign = VnPayQuery.buildHashData(filtered);
        String expected = hmacSha512(secret, dataToSign);
        return expected.equalsIgnoreCase(provided);
    }

    private static String toHexLower(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
