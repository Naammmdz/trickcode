package com.naammm.trickcode.service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import java.io.InputStream;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for storing and retrieving uploaded files (videos, etc.) using MinIO object storage.
 */
@Service
public class FileStorageService {

    private static final Logger LOG = LoggerFactory.getLogger(FileStorageService.class);

    private final MinioClient minioClient;
    private final String bucket;

    public FileStorageService(
        MinioClient minioClient,
        @Value("${minio.bucket:trickcode}") String bucket
    ) {
        this.minioClient = minioClient;
        this.bucket = bucket;
        LOG.info("FileStorageService initialized with MinIO bucket: {}", bucket);
    }

    /**
     * Store a video file in MinIO. Returns the generated object key.
     */
    public String storeVideo(MultipartFile file) throws Exception {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        // Validate
        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("Invalid file path: " + originalFilename);
        }

        // Get file extension
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }

        // Generate unique object key: videos/uuid.ext
        String objectKey = "videos/" + UUID.randomUUID().toString() + extension;

        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );
        }

        LOG.info("Stored video in MinIO: {} -> {}/{}", originalFilename, bucket, objectKey);
        return objectKey;
    }

    /**
     * Load a video file from MinIO as a Resource for streaming.
     */
    public Resource loadVideoAsResource(String objectKey) throws Exception {
        InputStream stream = minioClient.getObject(
            GetObjectArgs.builder()
                .bucket(bucket)
                .object(objectKey)
                .build()
        );
        return new InputStreamResource(stream);
    }

    /**
     * Get object metadata (content type, size) from MinIO.
     */
    public StatObjectResponse getVideoStat(String objectKey) throws Exception {
        return minioClient.statObject(
            StatObjectArgs.builder()
                .bucket(bucket)
                .object(objectKey)
                .build()
        );
    }

    /**
     * Delete a video file from MinIO.
     */
    public boolean deleteVideo(String objectKey) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .build()
            );
            LOG.info("Deleted video from MinIO: {}/{}", bucket, objectKey);
            return true;
        } catch (Exception e) {
            LOG.error("Failed to delete video from MinIO: {}", objectKey, e);
            return false;
        }
    }

    /**
     * Get the content type of a video file from the object key.
     */
    public String getVideoContentType(String objectKey) {
        // Try to get content type from MinIO metadata first
        try {
            StatObjectResponse stat = getVideoStat(objectKey);
            if (stat.contentType() != null && !stat.contentType().equals("application/octet-stream")) {
                return stat.contentType();
            }
        } catch (Exception e) {
            LOG.debug("Could not get content type from MinIO stat for: {}", objectKey);
        }

        // Fallback: derive from extension
        String extension = "";
        int dotIndex = objectKey.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = objectKey.substring(dotIndex + 1).toLowerCase();
        }

        return switch (extension) {
            case "mp4" -> "video/mp4";
            case "webm" -> "video/webm";
            case "ogg" -> "video/ogg";
            case "mov" -> "video/quicktime";
            case "avi" -> "video/x-msvideo";
            case "mkv" -> "video/x-matroska";
            default -> "application/octet-stream";
        };
    }

    // ─── Image Storage ─────────────────────────────────────────────────────

    /**
     * Store an image file in MinIO. Returns the generated object key.
     */
    public String storeImage(MultipartFile file) throws Exception {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("Invalid file path: " + originalFilename);
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }

        // Store under images/ prefix
        String objectKey = "images/" + UUID.randomUUID().toString() + extension;

        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );
        }

        LOG.info("Stored image in MinIO: {} -> {}/{}", originalFilename, bucket, objectKey);
        return objectKey;
    }

    /**
     * Load an image file from MinIO as a Resource.
     */
    public Resource loadImageAsResource(String objectKey) throws Exception {
        InputStream stream = minioClient.getObject(
            GetObjectArgs.builder()
                .bucket(bucket)
                .object(objectKey)
                .build()
        );
        return new InputStreamResource(stream);
    }

    /**
     * Get the content type of an image from the object key.
     */
    public String getImageContentType(String objectKey) {
        try {
            StatObjectResponse stat = getVideoStat(objectKey);
            if (stat.contentType() != null && !stat.contentType().equals("application/octet-stream")) {
                return stat.contentType();
            }
        } catch (Exception e) {
            LOG.debug("Could not get content type from MinIO stat for: {}", objectKey);
        }

        String extension = "";
        int dotIndex = objectKey.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = objectKey.substring(dotIndex + 1).toLowerCase();
        }

        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            case "svg" -> "image/svg+xml";
            case "bmp" -> "image/bmp";
            default -> "application/octet-stream";
        };
    }

    /**
     * Delete an image file from MinIO.
     */
    public boolean deleteImage(String objectKey) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .build()
            );
            LOG.info("Deleted image from MinIO: {}/{}", bucket, objectKey);
            return true;
        } catch (Exception e) {
            LOG.error("Failed to delete image from MinIO: {}", objectKey, e);
            return false;
        }
    }
}
