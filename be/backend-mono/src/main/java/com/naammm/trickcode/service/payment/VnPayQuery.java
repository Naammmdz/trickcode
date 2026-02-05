package com.naammm.trickcode.service.payment;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;

public final class VnPayQuery {

    private VnPayQuery() {}

    /**
     * Build query string exactly like VNPay demo: URLEncoder with US_ASCII.
     * Spaces become '+' (not %20).
     */
    public static String buildQueryString(Map<String, String> params) {
        try {
            StringBuilder sb = new StringBuilder();
            boolean first = true;
            for (Map.Entry<String, String> e : new TreeMap<>(params).entrySet()) {
                String key = e.getKey();
                String value = e.getValue();
                if (value == null || value.isBlank()) {
                    continue;
                }
                if (!first) {
                    sb.append('&');
                }
                first = false;
                sb.append(URLEncoder.encode(key, StandardCharsets.US_ASCII.toString()));
                sb.append('=');
                sb.append(URLEncoder.encode(value, StandardCharsets.US_ASCII.toString()));
            }
            return sb.toString();
        } catch (UnsupportedEncodingException ex) {
            throw new IllegalStateException(ex);
        }
    }

    /**
     * Build hashData exactly like VNPay demo: key=URLEncoder(value) (value encoded, key not encoded in hashData).
     * Spaces become '+'.
     */
    public static String buildHashData(Map<String, String> params) {
        try {
            StringBuilder sb = new StringBuilder();
            boolean first = true;
            for (Map.Entry<String, String> e : new TreeMap<>(params).entrySet()) {
                String key = e.getKey();
                String value = e.getValue();
                if (value == null || value.isBlank()) {
                    continue;
                }
                if (!first) {
                    sb.append('&');
                }
                first = false;
                sb.append(key);
                sb.append('=');
                sb.append(URLEncoder.encode(value, StandardCharsets.US_ASCII.toString()));
            }
            return sb.toString();
        } catch (UnsupportedEncodingException ex) {
            throw new IllegalStateException(ex);
        }
    }
}
