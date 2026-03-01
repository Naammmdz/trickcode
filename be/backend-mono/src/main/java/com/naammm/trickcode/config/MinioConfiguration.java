package com.naammm.trickcode.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for MinIO object storage client.
 */
@Configuration
public class MinioConfiguration {

    private static final Logger LOG = LoggerFactory.getLogger(MinioConfiguration.class);

    @Value("${minio.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${minio.access-key:minioadmin}")
    private String accessKey;

    @Value("${minio.secret-key:minioadmin}")
    private String secretKey;

    @Value("${minio.bucket:trickcode}")
    private String bucket;

    @Bean
    public MinioClient minioClient() {
        MinioClient client = MinioClient.builder()
            .endpoint(endpoint)
            .credentials(accessKey, secretKey)
            .build();

        // Auto-create bucket if it doesn't exist
        try {
            boolean bucketExists = client.bucketExists(
                BucketExistsArgs.builder().bucket(bucket).build()
            );
            if (!bucketExists) {
                client.makeBucket(
                    MakeBucketArgs.builder().bucket(bucket).build()
                );
                LOG.info("Created MinIO bucket: {}", bucket);
            } else {
                LOG.info("MinIO bucket already exists: {}", bucket);
            }
        } catch (Exception e) {
            LOG.warn("Could not verify/create MinIO bucket '{}'. Make sure MinIO is running. Error: {}", bucket, e.getMessage());
        }

        return client;
    }
}
