package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.service.FileStorageService;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller for uploading and serving files (videos, etc.) via MinIO.
 */
@RestController
@RequestMapping("/api/files")
public class FileResource {

    private static final Logger LOG = LoggerFactory.getLogger(FileResource.class);

    // Max video file size: 500MB
    private static final long MAX_VIDEO_SIZE = 500L * 1024 * 1024;

    // Max image file size: 10MB
    private static final long MAX_IMAGE_SIZE = 10L * 1024 * 1024;

    private final FileStorageService fileStorageService;

    public FileResource(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * {@code POST /api/files/upload/video} : Upload a video file to MinIO.
     *
     * @param file the video file to upload
     * @return the object key and URL of the uploaded video
     */
    @PostMapping("/upload/video")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload video: {}", file.getOriginalFilename());

        // Validate file is not empty
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        // Validate file size
        if (file.getSize() > MAX_VIDEO_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds maximum of 500MB"));
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only video files are allowed"));
        }

        try {
            String objectKey = fileStorageService.storeVideo(file);
            // The objectKey is like "videos/uuid.mp4"
            // Serve URL: /api/files/video/{uuid.mp4}
            String filename = objectKey.replace("videos/", "");
            String videoUrl = "/api/files/video/" + filename;

            return ResponseEntity.ok(Map.of(
                "filename", filename,
                "objectKey", objectKey,
                "videoUrl", videoUrl,
                "originalName", file.getOriginalFilename(),
                "size", file.getSize(),
                "contentType", contentType
            ));
        } catch (Exception e) {
            LOG.error("Failed to upload video", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload video: " + e.getMessage()));
        }
    }

    /**
     * {@code GET /api/files/video/:filename} : Stream a video file from MinIO.
     *
     * @param filename the filename of the video (UUID.ext)
     * @return the video file as a streaming resource
     */
    @GetMapping("/video/{filename:.+}")
    public ResponseEntity<Resource> getVideo(@PathVariable String filename) {
        try {
            // Reconstruct the object key: videos/{filename}
            String objectKey = "videos/" + filename;
            Resource resource = fileStorageService.loadVideoAsResource(objectKey);
            String contentType = fileStorageService.getVideoContentType(objectKey);

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(resource);
        } catch (Exception e) {
            LOG.error("Failed to serve video: {}", filename, e);
            return ResponseEntity.notFound().build();
        }
    }

    // ─── Image Endpoints ───────────────────────────────────────────────────

    /**
     * {@code POST /api/files/upload/image} : Upload an image file to MinIO.
     *
     * @param file the image file to upload
     * @return the object key and URL of the uploaded image
     */
    @PostMapping("/upload/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to upload image: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds maximum of 10MB"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
        }

        try {
            String objectKey = fileStorageService.storeImage(file);
            String filename = objectKey.replace("images/", "");
            String imageUrl = "/api/files/image/" + filename;

            return ResponseEntity.ok(Map.of(
                "filename", filename,
                "objectKey", objectKey,
                "imageUrl", imageUrl,
                "originalName", file.getOriginalFilename(),
                "size", file.getSize(),
                "contentType", contentType
            ));
        } catch (Exception e) {
            LOG.error("Failed to upload image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    /**
     * {@code GET /api/files/image/:filename} : Serve an image file from MinIO.
     *
     * @param filename the filename of the image (UUID.ext)
     * @return the image file as a resource
     */
    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            String objectKey = "images/" + filename;
            Resource resource = fileStorageService.loadImageAsResource(objectKey);
            String contentType = fileStorageService.getImageContentType(objectKey);

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
        } catch (Exception e) {
            LOG.error("Failed to serve image: {}", filename, e);
            return ResponseEntity.notFound().build();
        }
    }
}
