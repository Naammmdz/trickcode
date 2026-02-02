package com.naammm.course.config;

import com.naammm.course.domain.Course;
import com.naammm.course.domain.Lesson;
import com.naammm.course.domain.Section;
import com.naammm.course.domain.enumeration.CourseLevel;
import com.naammm.course.domain.enumeration.CourseStatus;
import com.naammm.course.domain.enumeration.LessonType;
import com.naammm.course.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;

    public DataSeeder(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (courseRepository.count() > 0) {
            return;
        }

        // Course 1: Advanced React
        Course c1 = new Course();
        c1.setTitle("Advanced React Patterns & Performance");
        c1.setPrice(new BigDecimal("49.99"));
        c1.setStatus(CourseStatus.PUBLISHED);
        c1.setLevel(CourseLevel.ADVANCED);
        c1.setInstructorId(101L);
        c1.setDescription("Deep dive into React performance.");
        c1.setThumbnailUrl("https://example.com/react.jpg");
        c1.setCreatedAt(Instant.now());
        
        Section s1 = new Section();
        s1.setTitle("Chapter 1: Introduction");
        s1.setOrderIndex(1);
        c1.addSections(s1);
        
        Lesson l1 = new Lesson();
        l1.setTitle("Welcome to the course");
        l1.setType(LessonType.VIDEO);
        l1.setOrderIndex(1);
        l1.setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        s1.addLessons(l1);

        courseRepository.save(c1);

        // Course 2: Pending Rust Course
        Course c2 = new Course();
        c2.setTitle("Introduction to Rust Programming");
        c2.setPrice(new BigDecimal("39.99"));
        c2.setStatus(CourseStatus.PENDING);
        c2.setLevel(CourseLevel.BEGINNER);
        c2.setInstructorId(102L);
        c2.setDescription("Learn Rust from scratch.");
        c2.setCreatedAt(Instant.now());
        
        Section s2 = new Section();
        s2.setTitle("Chapter 1: Ownership");
        s2.setOrderIndex(1);
        c2.addSections(s2);
        
        Lesson l2 = new Lesson();
        l2.setTitle("What is Ownership?");
        l2.setType(LessonType.VIDEO);
        l2.setOrderIndex(1);
        l2.setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        s2.addLessons(l2);
        
        courseRepository.save(c2);
    }
}
