package com.naammm.trickcode.config;

import com.naammm.trickcode.domain.Authority;
import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.domain.Lesson;
import com.naammm.trickcode.domain.Section;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.CourseLevel;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import com.naammm.trickcode.domain.enumeration.LessonType;
import com.naammm.trickcode.repository.AuthorityRepository;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.repository.UserRepository;
import com.naammm.trickcode.security.AuthoritiesConstants;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final AuthorityRepository authorityRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
        CourseRepository courseRepository,
        AuthorityRepository authorityRepository,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.courseRepository = courseRepository;
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedAuthorities();
        seedUsers();
        seedCourses();
    }

    private void seedAuthorities() {
        if (!authorityRepository.existsById(AuthoritiesConstants.STAFF)) {
            Authority auth = new Authority();
            auth.setName(AuthoritiesConstants.STAFF);
            authorityRepository.save(auth);
        }
        if (!authorityRepository.existsById(AuthoritiesConstants.INSTRUCTOR)) {
            Authority auth = new Authority();
            auth.setName(AuthoritiesConstants.INSTRUCTOR);
            authorityRepository.save(auth);
        }
    }

    private void seedUsers() {
        // Seed Staff
        if (userRepository.findOneByLogin("staff").isEmpty()) {
            User staff = new User();
            staff.setLogin("staff");
            staff.setPassword(passwordEncoder.encode("staff"));
            staff.setFirstName("Staff");
            staff.setLastName("Member");
            staff.setEmail("staff@trickcode.local");
            staff.setActivated(true);
            staff.setLangKey("en");
            
            Authority staffAuth = authorityRepository.findById(AuthoritiesConstants.STAFF).orElse(null);
            Authority userAuth = authorityRepository.findById(AuthoritiesConstants.USER).orElse(null);
            
            Set<Authority> authorities = new HashSet<>();
            if (staffAuth != null) authorities.add(staffAuth);
            if (userAuth != null) authorities.add(userAuth);
            
            staff.setAuthorities(authorities);
            userRepository.save(staff);
        }

        // Seed Instructor
        if (userRepository.findOneByLogin("instructor").isEmpty()) {
            User instructor = new User();
            instructor.setLogin("instructor");
            instructor.setPassword(passwordEncoder.encode("instructor"));
            instructor.setFirstName("Instructor");
            instructor.setLastName("Teacher");
            instructor.setEmail("instructor@trickcode.local");
            instructor.setActivated(true);
            instructor.setLangKey("en");
            
            Authority instructorAuth = authorityRepository.findById(AuthoritiesConstants.INSTRUCTOR).orElse(null);
            Authority userAuth = authorityRepository.findById(AuthoritiesConstants.USER).orElse(null);
            
            Set<Authority> authorities = new HashSet<>();
            if (instructorAuth != null) authorities.add(instructorAuth);
            if (userAuth != null) authorities.add(userAuth);
            
            instructor.setAuthorities(authorities);
            userRepository.save(instructor);
        }
    }

    private void seedCourses() {
        User instructor = userRepository.findOneByLogin("instructor").orElse(null);

        // Published courses
        createCourse("Dynamic Programming Patterns", "Deep dive into DP patterns for interviews.", 
            new BigDecimal("39.99"), CourseLevel.ADVANCED, CourseStatus.PUBLISHED, instructor);

        createCourse("Binary Search Deep Dive", "Master binary search variants.", 
            new BigDecimal("24.99"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED, instructor);

        createCourse("Recursion for Beginners", "Understand the base case and recursive step.", 
            BigDecimal.ZERO, CourseLevel.BEGINNER, CourseStatus.PUBLISHED, instructor);

        createCourse("Advanced 2D DP Grids", "Solving complex grid problems.", 
            new BigDecimal("29.99"), CourseLevel.ADVANCED, CourseStatus.PUBLISHED, instructor);

        createCourse("Knapsack Problems", "0/1 Knapsack, Unbounded Knapsack, and more.", 
            new BigDecimal("19.99"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED, instructor);

        createCourse("Greedy Algorithms 101", "When to be greedy and when not to be.", 
            new BigDecimal("14.50"), CourseLevel.BEGINNER, CourseStatus.PUBLISHED, instructor);

        createCourse("Trees & Graphs Masterclass", "BFS, DFS, Dijkstra, and beyond.", 
            new BigDecimal("34.99"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED, instructor);

        createCourse("Bit Manipulation Secrets", "Bitwise operations for optimization.", 
            new BigDecimal("22.00"), CourseLevel.ADVANCED, CourseStatus.PUBLISHED, instructor);

        createCourse("Backtracking Visualized", "Visualize the state space tree.", 
            new BigDecimal("27.50"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED, instructor);

        // Pending courses for admin review
        createCourse("Segment Trees Explained", "Advanced data structure for range queries and updates. Learn fenwick trees and lazy propagation.", 
            new BigDecimal("45.00"), CourseLevel.ADVANCED, CourseStatus.PENDING, instructor);

        createCourse("System Design Basics", "Design scalable systems from scratch. Cover load balancing, caching, database sharding, and microservices architecture.", 
            new BigDecimal("59.99"), CourseLevel.INTERMEDIATE, CourseStatus.PENDING, instructor);

        createCourse("Trie & String Algorithms", "Master prefix trees, suffix arrays, and KMP algorithm for string matching problems.", 
            new BigDecimal("32.50"), CourseLevel.ADVANCED, CourseStatus.PENDING, instructor);

        // Draft course
        createCourse("Mock Interview Preparation", "Practice real interview questions with detailed solutions and time complexity analysis.", 
            new BigDecimal("49.99"), CourseLevel.INTERMEDIATE, CourseStatus.DRAFT, instructor);
    }

    private void createCourse(String title, String description, BigDecimal price, CourseLevel level, CourseStatus status, User instructor) {
        Course c = new Course();
        c.setTitle(title);
        c.setDescription(description);
        c.setPrice(price);
        c.setLevel(level);
        c.setStatus(status);
        c.setCreatedAt(Instant.now());
        c.setThumbnailUrl("https://picsum.photos/400/300?random=" + title.hashCode());
        if (instructor != null) c.setInstructor(instructor);
        
        Section s1 = new Section();
        s1.setTitle("Chapter 1: Getting Started");
        s1.setOrderIndex(1);
        c.addSections(s1);
        
        Lesson l1 = new Lesson();
        l1.setTitle("Introduction to " + title);
        l1.setType(LessonType.VIDEO);
        l1.setOrderIndex(1);
        l1.setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        s1.addLessons(l1);

        Lesson l2 = new Lesson();
        l2.setTitle("Key Concepts Overview");
        l2.setType(LessonType.TEXT);
        l2.setOrderIndex(2);
        l2.setMarkdownContent("In this lesson we explore the fundamental concepts...");
        s1.addLessons(l2);

        Lesson l3 = new Lesson();
        l3.setTitle("Knowledge Check");
        l3.setType(LessonType.QUIZ);
        l3.setOrderIndex(3);
        s1.addLessons(l3);

        Lesson l4 = new Lesson();
        l4.setTitle("Coding Challenge: optimize()");
        l4.setType(LessonType.CODE);
        l4.setOrderIndex(4);
        s1.addLessons(l4);

        courseRepository.save(c);
    }
}
