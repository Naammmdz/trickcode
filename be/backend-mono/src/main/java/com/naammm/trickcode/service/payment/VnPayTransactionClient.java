package com.naammm.trickcode.service.payment;

import com.naammm.trickcode.config.VnPayProperties;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class VnPayTransactionClient {

    private static final DateTimeFormatter VN_PAY_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss").withZone(
        ZoneId.of("Asia/Ho_Chi_Minh")
    );

    private final VnPayProperties vnPayProperties;
    private final RestClient restClient;

    public VnPayTransactionClient(VnPayProperties vnPayProperties, RestClient.Builder restClientBuilder) {
        this.vnPayProperties = vnPayProperties;
        this.restClient = restClientBuilder.build();
    }

    public QueryDrResponse queryDr(String txnRef, String transDate, String orderInfo, String clientIp) {
        String requestId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String createDate = VN_PAY_DATE_FORMAT.format(Instant.now());

        String hashData = String.join(
            "|",
            requestId,
            "2.1.0",
            "querydr",
            vnPayProperties.getTmnCode(),
            txnRef,
            transDate,
            createDate,
            clientIp,
            orderInfo
        );
        String secureHash = VnPayCrypto.hmacSha512(vnPayProperties.getHashSecret(), hashData);

        String json =
            "{" +
            "\"vnp_RequestId\":\"" + requestId + "\"," +
            "\"vnp_Version\":\"2.1.0\"," +
            "\"vnp_Command\":\"querydr\"," +
            "\"vnp_TmnCode\":\"" + vnPayProperties.getTmnCode() + "\"," +
            "\"vnp_TxnRef\":\"" + txnRef + "\"," +
            "\"vnp_OrderInfo\":\"" + escapeJson(orderInfo) + "\"," +
            "\"vnp_TransactionDate\":\"" + transDate + "\"," +
            "\"vnp_CreateDate\":\"" + createDate + "\"," +
            "\"vnp_IpAddr\":\"" + clientIp + "\"," +
            "\"vnp_SecureHash\":\"" + secureHash + "\"" +
            "}";

        ResponseEntity<String> resp = restClient
            .post()
            .uri(URI.create(vnPayProperties.getApiUrl()))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .body(json)
            .retrieve()
            .toEntity(String.class);

        String body = resp.getBody() != null ? resp.getBody() : "";

        // We avoid introducing a JSON dependency; parse minimal fields using simple searches.
        String responseCode = extractJsonString(body, "vnp_ResponseCode");
        String transactionStatus = extractJsonString(body, "vnp_TransactionStatus");
        String amount = extractJsonString(body, "vnp_Amount");
        String transactionNo = extractJsonString(body, "vnp_TransactionNo");

        return new QueryDrResponse(body, responseCode, transactionStatus, amount, transactionNo);
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String extractJsonString(String json, String key) {
        if (json == null || json.isBlank() || key == null) return null;
        String pattern = "\"" + key + "\"";
        int idx = json.indexOf(pattern);
        if (idx < 0) return null;
        int colon = json.indexOf(':', idx + pattern.length());
        if (colon < 0) return null;
        int firstQuote = json.indexOf('"', colon + 1);
        if (firstQuote < 0) return null;
        int secondQuote = json.indexOf('"', firstQuote + 1);
        if (secondQuote < 0) return null;
        return json.substring(firstQuote + 1, secondQuote);
    }

    public record QueryDrResponse(String rawBody, String responseCode, String transactionStatus, String amount, String transactionNo) {}
}
