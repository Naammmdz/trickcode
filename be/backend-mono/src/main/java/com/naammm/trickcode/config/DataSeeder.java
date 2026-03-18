package com.naammm.trickcode.config;

import com.naammm.trickcode.domain.*;
import com.naammm.trickcode.domain.enumeration.CourseLevel;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import com.naammm.trickcode.domain.enumeration.LessonType;
import com.naammm.trickcode.domain.enumeration.OrderStatus;
import com.naammm.trickcode.repository.*;
import com.naammm.trickcode.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger LOG = LoggerFactory.getLogger(DataSeeder.class);

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorityRepository authorityRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final PaymentProperties paymentProperties;

    public DataSeeder(
        CourseRepository courseRepository,
        CategoryRepository categoryRepository,
        AuthorityRepository authorityRepository,
        UserRepository userRepository,
        EnrollmentRepository enrollmentRepository,
        OrderRepository orderRepository,
        PasswordEncoder passwordEncoder,
        PaymentProperties paymentProperties
    ) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
        this.paymentProperties = paymentProperties;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedAuthorities();
        seedUsers();
        Map<String, Category> catMap = seedCategories();
        if (courseRepository.count() == 0) {
            seedCourses(catMap);
        }
        // Seed thêm students, courses, enrollments, orders nếu chưa có
        seedExtraData(catMap);
    }

    // ─── Extra Data Seeder ──────────────────────────────────────────────────────

    private void seedExtraData(Map<String, Category> catMap) {
        // Guard: chỉ seed 1 lần — check bằng marker user "student01"
        if (userRepository.findOneByLogin("student01").isPresent()) {
            return;
        }
        LOG.info("🌱 Seeding extra data: students, courses, enrollments, orders...");

        User instructor = userRepository.findOneByLogin("instructor").orElse(null);
        if (instructor == null) return;

        BigDecimal usdToVnd = paymentProperties.getUsdToVndRate() != null
            ? paymentProperties.getUsdToVndRate() : BigDecimal.valueOf(25000);

        // ─── 1. Create 2 more instructors ─────────────────────────────────
        User instructor2 = buildUser("instructor2", "instructor2", "Tran", "Minh B",
            "instructor2@trickcode.local", AuthoritiesConstants.INSTRUCTOR, AuthoritiesConstants.USER);
        instructor2 = userRepository.save(instructor2);

        User instructor3 = buildUser("instructor3", "instructor3", "Le", "Thi C",
            "instructor3@trickcode.local", AuthoritiesConstants.INSTRUCTOR, AuthoritiesConstants.USER);
        instructor3 = userRepository.save(instructor3);

        // ─── 2. Create 30 students ────────────────────────────────────────
        List<User> students = new ArrayList<>();
        String[] firstNames = {"Anh", "Binh", "Cuong", "Dung", "Em", "Phuc", "Giang", "Hung", "Khanh", "Linh",
            "Minh", "Nam", "Phuong", "Quang", "Son", "Tuan", "Uyen", "Vu", "Xuan", "Yen",
            "Bao", "Chi", "Dat", "Hai", "Khoa", "Long", "Ngoc", "Thinh", "Trung", "Vinh"};
        String[] lastNames = {"Nguyen", "Tran", "Le", "Pham", "Hoang", "Vo", "Dang", "Bui", "Do", "Ngo"};

        for (int i = 1; i <= 30; i++) {
            String login = String.format("student%02d", i);
            String fn = firstNames[i - 1];
            String ln = lastNames[(i - 1) % lastNames.length];
            String email = login + "@trickcode.local";
            User student = buildUser(login, "student", fn, ln, email, AuthoritiesConstants.USER);
            // Stagger creation dates over the past 90 days
            student.setCreatedDate(Instant.now().minus(90 - i * 3L, ChronoUnit.DAYS));
            students.add(userRepository.save(student));
        }
        LOG.info("  ✅ Created 30 students");

        // ─── 3. Create 14 new published courses (total = 20 published) ────
        //    Existing: 6 published by "instructor" (DP, DS, Trees&Graphs, BinarySearch, Greedy, Backtracking)
        //    Need: 14 more published across 3 instructors

        String[][] newCourses = {
            // {title, description, price, level, thumbnailUrl, instructorKey}
            {"Two Pointers & Sliding Window", "Hai kỹ thuật quan trọng nhất cho bài toán mảng/chuỗi: Two Pointers, Sliding Window, và Fast-Slow Pointers.", "19.99", "INTERMEDIATE",
                "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80", "instructor"},
            {"Bit Manipulation Tricks", "Từ XOR tricks đến bitmask DP: giải quyết các bài toán bit manipulation thường gặp trong phỏng vấn.", "22.00", "INTERMEDIATE",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", "instructor"},
            {"Heap & Priority Queue", "Master heap data structure: Min-Heap, Max-Heap, Top-K problems, Median finding, và Merge K Sorted Lists.", "29.99", "INTERMEDIATE",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80", "instructor"},
            {"Trie & String Algorithms", "Trie, KMP, Rabin-Karp, và các thuật toán xử lý chuỗi nâng cao cho competitive programming.", "35.00", "ADVANCED",
                "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80", "instructor"},
            {"Union-Find & Disjoint Sets", "Kỹ thuật Union-Find (DSU) với Path Compression và Union by Rank. Ứng dụng trong Kruskal, Connected Components.", "18.50", "INTERMEDIATE",
                "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=800&q=80", "instructor2"},
            {"Monotonic Stack Patterns", "Stack đơn điệu: Next Greater Element, Trapping Rain Water, Largest Rectangle in Histogram.", "21.00", "INTERMEDIATE",
                "https://images.unsplash.com/photo-1515879218367-8466d910auj?w=800&q=80", "instructor2"},
            {"BFS & DFS Patterns", "Tổng hợp các pattern BFS/DFS phổ biến: Multi-source BFS, Topological Sort, Cycle Detection, Bipartite Check.", "26.99", "INTERMEDIATE",
                "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800&q=80", "instructor2"},
            {"SQL Fundamentals for Devs", "SQL từ cơ bản đến nâng cao: JOIN, Subquery, Window Functions, CTE, Index Optimization cho developers.", "15.00", "BEGINNER",
                "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80", "instructor2"},
            {"Recursion Masterclass", "Hiểu sâu về đệ quy: từ base case đến tail recursion. Giải quyết các bài toán phức tạp bằng tư duy đệ quy.", "0.00", "BEGINNER",
                "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&q=80", "instructor2"},
            {"Advanced Graph: Network Flow", "Max Flow, Min Cut, Bipartite Matching, Hungarian Algorithm. Các bài toán đồ thị nâng cao nhất.", "49.99", "ADVANCED",
                "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80", "instructor3"},
            {"Competitive Programming Roadmap", "Lộ trình luyện tập CP: Codeforces, LeetCode, AtCoder. Strategies, time management, và contest tips.", "32.00", "BEGINNER",
                "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&q=80", "instructor3"},
            {"Math for Algorithms", "Number Theory, Modular Arithmetic, Combinatorics, Matrix Exponentiation, và FFT cho competitive programming.", "38.50", "ADVANCED",
                "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80", "instructor3"},
            {"Linked List Deep Dive", "Tất tần tật về Linked List: Reverse, Merge, Detect Cycle, Remove Nth Node, Copy List with Random Pointer.", "0.00", "BEGINNER",
                "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80", "instructor3"},
            {"Design Patterns in Java", "Singleton, Factory, Observer, Strategy, Decorator — 15+ design patterns với ví dụ thực tế bằng Java.", "42.99", "INTERMEDIATE",
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80", "instructor3"},
        };

        Map<String, User> instructorMap = new HashMap<>();
        instructorMap.put("instructor", instructor);
        instructorMap.put("instructor2", instructor2);
        instructorMap.put("instructor3", instructor3);

        Category[] categories = catMap.values().toArray(new Category[0]);
        List<Course> allPublishedCourses = new ArrayList<>(courseRepository.findAllByStatus(CourseStatus.PUBLISHED));

        for (int i = 0; i < newCourses.length; i++) {
            String[] c = newCourses[i];
            BigDecimal price = new BigDecimal(c[2]);
            CourseLevel level = CourseLevel.valueOf(c[3]);
            User inst = instructorMap.get(c[5]);

            Course course = buildCourse(c[0], c[1], price, price.multiply(new BigDecimal("2")),
                level, CourseStatus.PUBLISHED, c[4], inst);
            // Stagger published dates
            course.setCreatedAt(Instant.now().minus(60 - i * 3L, ChronoUnit.DAYS));
            course.setPublishedAt(Instant.now().minus(55 - i * 3L, ChronoUnit.DAYS));

            // Add a simple section with lessons
            Section s = buildSection("Chapter 1: Introduction", 1);
            s.addLessons(buildVideoLesson("Introduction to " + c[0], 1,
                "https://www.youtube.com/watch?v=oBt53YbR9Kk", 1200, true,
                "## " + c[0] + "\n\n" + c[1]));
            s.addLessons(buildQuizLesson("Quiz: Fundamentals", 2,
                buildQuizConfig(new String[][]{
                    {"What is the time complexity?", "O(1)", "O(n)", "O(n²)", "O(log n)", "1"},
                    {"Which data structure is most suitable?", "Array", "Stack", "Depends on the problem", "Queue", "2"},
                    {"When should you optimize?", "Always", "Never", "After profiling", "Before coding", "2"}
                })));
            s.addLessons(buildCodeLesson("Practice Problem", 3,
                buildCodeConfig(c[0], "Solve the practice problem.\n\n**Example:**\n- Input: [1,2,3] → Output: 6",
                    "solve",
                    "def solve(arr):\n    pass",
                    "function solve(arr) {\n    // your code\n}",
                    "class Solution {\n    public int solve(int[] arr) {\n        return 0;\n    }\n}",
                    new String[]{"arr = [1,2,3]", "arr = [0]"},
                    new String[]{"6", "0"})));
            course.addSections(s);

            // Random categories
            course.addCategories(categories[i % categories.length]);
            if (i % 3 == 0 && categories.length > 1) {
                course.addCategories(categories[(i + 1) % categories.length]);
            }

            Course saved = courseRepository.save(course);
            allPublishedCourses.add(saved);
        }
        LOG.info("  ✅ Created 14 new published courses (total: {})", allPublishedCourses.size());

        // ─── 4. Create enrollments & orders ──────────────────────────────
        Random rng = new Random(42); // deterministic for reproducibility
        int enrollmentCount = 0;
        int orderCount = 0;

        for (User student : students) {
            // Each student enrolls in 3-8 random courses
            int numCourses = 3 + rng.nextInt(6);
            List<Course> shuffled = new ArrayList<>(allPublishedCourses);
            Collections.shuffle(shuffled, rng);
            List<Course> enrolled = shuffled.subList(0, Math.min(numCourses, shuffled.size()));

            for (Course course : enrolled) {
                // Random enrollment date in the past 60 days
                int daysAgo = rng.nextInt(60);
                Instant enrolledAt = Instant.now().minus(daysAgo, ChronoUnit.DAYS)
                    .plusSeconds(rng.nextInt(86400));

                // Check no duplicate
                if (enrollmentRepository.existsByUserLoginAndCourseId(student.getLogin(), course.getId())) {
                    continue;
                }

                // Create enrollment
                Enrollment enrollment = new Enrollment();
                enrollment.setUser(student);
                enrollment.setCourse(course);
                enrollment.setEnrolledAt(enrolledAt);
                enrollment.setStatus("ACTIVE");
                enrollmentRepository.save(enrollment);
                enrollmentCount++;

                // Create matching completed order (convert price USD → VND like VNPay does)
                BigDecimal priceUsd = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;
                BigDecimal amountVnd = priceUsd.multiply(usdToVnd).setScale(0, RoundingMode.HALF_UP);

                Order order = new Order();
                order.setUser(student);
                order.setCourse(course);
                order.setTotalAmount(amountVnd);
                order.setStatus(OrderStatus.COMPLETED);
                order.setCreatedAt(enrolledAt.minus(1, ChronoUnit.HOURS));
                order.setPaidAt(enrolledAt);
                order.setPaymentMethod("VNPAY");
                order.setPaymentProvider("VNPAY");
                order.setPaymentTxnRef("SEED-" + UUID.randomUUID().toString().substring(0, 20));
                order.setVnpayResponseCode("00");
                order.setVnpayTransactionNo("SEED" + System.nanoTime());
                order.setTransactionId(order.getVnpayTransactionNo());
                orderRepository.save(order);
                orderCount++;
            }
        }
        LOG.info("  ✅ Created {} enrollments and {} orders", enrollmentCount, orderCount);
        LOG.info("🌱 Extra data seeding complete!");
    }

    // ─── Authorities ────────────────────────────────────────────────────────────

    private void seedAuthorities() {
        ensureAuthority(AuthoritiesConstants.ADMIN);
        ensureAuthority(AuthoritiesConstants.USER);
        ensureAuthority(AuthoritiesConstants.STAFF);
        ensureAuthority(AuthoritiesConstants.INSTRUCTOR);
    }

    private void ensureAuthority(String name) {
        if (!authorityRepository.existsById(name)) {
            Authority auth = new Authority();
            auth.setName(name);
            authorityRepository.save(auth);
        }
    }

    // ─── Users ──────────────────────────────────────────────────────────────────

    private void seedUsers() {
        if (userRepository.findOneByLogin("admin").isEmpty()) {
            User admin = buildUser("admin", "admin", "Admin", "User", "admin@trickcode.local",
                AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER);
            userRepository.save(admin);
        }
        if (userRepository.findOneByLogin("user").isEmpty()) {
            User user = buildUser("user", "user", "Normal", "User", "user@trickcode.local",
                AuthoritiesConstants.USER);
            userRepository.save(user);
        }
        if (userRepository.findOneByLogin("staff").isEmpty()) {
            User staff = buildUser("staff", "staff", "Staff", "Member", "staff@trickcode.local",
                AuthoritiesConstants.STAFF, AuthoritiesConstants.USER);
            userRepository.save(staff);
        }
        if (userRepository.findOneByLogin("instructor").isEmpty()) {
            User instructor = buildUser("instructor", "instructor", "Nguyen", "Van A", "instructor@trickcode.local",
                AuthoritiesConstants.INSTRUCTOR, AuthoritiesConstants.USER);
            userRepository.save(instructor);
        }
    }

    private User buildUser(String login, String password, String firstName, String lastName,
                           String email, String... roles) {
        User u = new User();
        u.setLogin(login);
        u.setPassword(passwordEncoder.encode(password));
        u.setFirstName(firstName);
        u.setLastName(lastName);
        u.setEmail(email);
        u.setActivated(true);
        u.setLangKey("en");
        u.setCreatedDate(Instant.now());
        Set<Authority> authorities = new HashSet<>();
        for (String role : roles) {
            authorityRepository.findById(role).ifPresent(authorities::add);
        }
        u.setAuthorities(authorities);
        return u;
    }

    // ─── Categories ─────────────────────────────────────────────────────────────

    private Map<String, Category> seedCategories() {
        Map<String, Category> map = new HashMap<>();
        map.put("ds", ensureCategory("Data Structures", "Arrays, LinkedList, Stack, Queue, Tree, HashMap", 1));
        map.put("algo", ensureCategory("Algorithms", "Sorting, Searching, Divide & Conquer", 2));
        map.put("graph", ensureCategory("Graph Theory", "BFS, DFS, Dijkstra, Union-Find, Topological Sort", 3));
        map.put("tree", ensureCategory("Trees & Graphs", "Binary Tree, BST, AVL, Red-Black Tree", 4));
        map.put("sort", ensureCategory("Sorting & Searching", "Binary Search, Merge Sort, Quick Sort", 5));
        map.put("math", ensureCategory("Math & Geometry", "Number Theory, Combinatorics, Computational Geometry", 6));
        map.put("dp", ensureCategory("Dynamic Programming", "Memoization, Tabulation, Knapsack, LCS, LIS", 7));
        map.put("sd", ensureCategory("System Design", "Scalability, Load Balancing, Caching, Database Design", 8));
        return map;
    }

    private Category ensureCategory(String name, String description, int orderIndex) {
        return categoryRepository.findAll().stream()
            .filter(c -> c.getName().equals(name))
            .findFirst()
            .orElseGet(() -> {
                Category cat = new Category();
                cat.setName(name);
                cat.setDescription(description);
                cat.setOrderIndex(orderIndex);
                cat.setIsActive(true);
                return categoryRepository.save(cat);
            });
    }

    // ─── Courses (original 9) ───────────────────────────────────────────────────

    private void seedCourses(Map<String, Category> catMap) {
        User instructor = userRepository.findOneByLogin("instructor").orElse(null);

        // ── Course 1: Dynamic Programming Patterns (PUBLISHED, ADVANCED) ──────
        Course dp = buildCourse(
            "Dynamic Programming Patterns",
            "Nắm vững các pattern DP thường gặp nhất trong phỏng vấn kỹ thuật: Fibonacci, Knapsack, LCS, LIS, và Grid DP. Khóa học đi từ tư duy đệ quy → memoization → tabulation với hơn 30 bài tập thực hành.",
            new BigDecimal("39.99"), new BigDecimal("79.99"),
            CourseLevel.ADVANCED, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
            instructor
        );
        Section dp_s1 = buildSection("Chapter 1: Tư duy Đệ quy & Memoization", 1);
        dp_s1.addLessons(buildVideoLesson("Giới thiệu Dynamic Programming", 1,
            "https://www.youtube.com/watch?v=oBt53YbR9Kk", 2520, true,
            "## Dynamic Programming là gì?\n\nDP là kỹ thuật tối ưu hóa bằng cách lưu kết quả của các bài toán con (subproblems) để tránh tính lại.\n\n### Hai đặc điểm cần có:\n1. **Optimal Substructure** – Lời giải tối ưu của bài toán lớn được xây dựng từ lời giải tối ưu của bài toán con.\n2. **Overlapping Subproblems** – Các bài toán con xuất hiện lặp lại nhiều lần.\n\n### Top-down vs Bottom-up\n- **Top-down (Memoization)**: Đệ quy + cache\n- **Bottom-up (Tabulation)**: Vòng lặp + bảng DP"));
        dp_s1.addLessons(buildVideoLesson("Fibonacci: Top-down vs Bottom-up", 2,
            "https://www.youtube.com/watch?v=vYquumk4nfE", 1800, false,
            "## Bài toán Fibonacci\n\n```python\n# Top-down (Memoization)\ndef fib(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n\n# Bottom-up (Tabulation)\ndef fib(n):\n    if n <= 1: return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n```\n\n**Time Complexity**: O(n) | **Space Complexity**: O(n)"));
        dp_s1.addLessons(buildQuizLesson("Quiz: Tư duy DP cơ bản", 3,
            buildQuizConfig(new String[][]{
                {"Đặc điểm nào KHÔNG phải của bài toán DP?",
                 "Optimal Substructure", "Overlapping Subproblems", "Greedy Choice Property", "Có thể lưu cache", "2"},
                {"Memoization thuộc phương pháp nào?",
                 "Bottom-up", "Top-down", "Greedy", "Divide & Conquer", "1"},
                {"Độ phức tạp thời gian của Fibonacci DP là?",
                 "O(2^n)", "O(n log n)", "O(n)", "O(1)", "2"},
                {"Tabulation dùng cấu trúc dữ liệu nào?",
                 "Stack", "Queue", "Bảng (Array/Table)", "Heap", "2"},
                {"Khi nào nên dùng DP thay vì Greedy?",
                 "Khi bài toán có Greedy Choice Property", "Khi cần kết quả gần đúng",
                 "Khi lời giải tối ưu phụ thuộc vào nhiều lựa chọn con", "Khi input nhỏ", "2"}
            })));
        dp_s1.addLessons(buildCodeLesson("Climbing Stairs", 4,
            buildCodeConfig("Climbing Stairs",
                "Bạn đang leo cầu thang có `n` bậc. Mỗi lần bạn có thể leo 1 hoặc 2 bậc. Hỏi có bao nhiêu cách khác nhau để leo lên đỉnh?\n\n**Ví dụ:**\n- Input: n = 2 → Output: 2 (1+1, 2)\n- Input: n = 3 → Output: 3 (1+1+1, 1+2, 2+1)",
                "climbStairs",
                "def climbStairs(n: int) -> int:\n    # Viết code của bạn ở đây\n    pass",
                "function climbStairs(n) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public int climbStairs(int n) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}",
                new String[]{"n = 2", "n = 3", "n = 5"},
                new String[]{"2", "3", "8"})));
        dp.addSections(dp_s1);

        Section dp_s2 = buildSection("Chapter 2: Knapsack & Subsequence", 2);
        dp_s2.addLessons(buildVideoLesson("0/1 Knapsack Problem", 1,
            "https://www.youtube.com/watch?v=nLmhmB6NzcM", 2100, false,
            "## 0/1 Knapsack\n\nCho `n` vật phẩm, mỗi vật có trọng lượng `w[i]` và giá trị `v[i]`. Túi có sức chứa `W`. Chọn các vật để tổng giá trị lớn nhất.\n\n```python\ndef knapsack(W, weights, values, n):\n    dp = [[0] * (W + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(W + 1):\n            dp[i][w] = dp[i-1][w]\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])\n    return dp[n][W]\n```"));
        dp_s2.addLessons(buildVideoLesson("Longest Common Subsequence (LCS)", 2,
            "https://www.youtube.com/watch?v=Ua0GhsJSlWM", 1980, false,
            "## LCS\n\nTìm dãy con chung dài nhất của hai chuỗi.\n\n```python\ndef lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n```"));
        dp_s2.addLessons(buildCodeLesson("House Robber", 3,
            buildCodeConfig("House Robber",
                "Bạn là tên trộm muốn cướp các ngôi nhà trên một con phố. Mỗi nhà có một lượng tiền `nums[i]`. Không thể cướp hai nhà liền kề. Tìm số tiền tối đa có thể cướp.\n\n**Ví dụ:**\n- Input: [1,2,3,1] → Output: 4 (nhà 0 + nhà 2)\n- Input: [2,7,9,3,1] → Output: 12 (nhà 0 + nhà 2 + nhà 4)",
                "rob",
                "def rob(nums):\n    # Viết code của bạn ở đây\n    pass",
                "function rob(nums) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public int rob(int[] nums) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}",
                new String[]{"nums = [1,2,3,1]", "nums = [2,7,9,3,1]", "nums = [0]"},
                new String[]{"4", "12", "0"})));
        dp.addSections(dp_s2);

        dp.addCategories(catMap.get("dp"));
        dp.addCategories(catMap.get("algo"));
        courseRepository.save(dp);

        // ── Course 2: Data Structures Fundamentals (PUBLISHED, BEGINNER) ──────
        Course ds = buildCourse("Data Structures Fundamentals",
            "Khóa học toàn diện về các cấu trúc dữ liệu cơ bản: Array, LinkedList, Stack, Queue, Tree, và HashMap. Phù hợp cho người mới bắt đầu chuẩn bị phỏng vấn.",
            BigDecimal.ZERO, new BigDecimal("49.99"),
            CourseLevel.BEGINNER, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80", instructor);
        Section ds_s1 = buildSection("Chapter 1: Array & LinkedList", 1);
        ds_s1.addLessons(buildVideoLesson("Array là gì? Khi nào dùng?", 1,
            "https://www.youtube.com/watch?v=QJNwK2uJyGs", 1200, true,
            "## Array\n\nArray là cấu trúc dữ liệu lưu trữ các phần tử **cùng kiểu** trong bộ nhớ **liên tiếp**."));
        ds_s1.addLessons(buildVideoLesson("LinkedList: Singly & Doubly", 2,
            "https://www.youtube.com/watch?v=njTh_OwMljA", 1500, false, "## LinkedList\n\nMỗi node chứa **data** và **pointer** đến node tiếp theo."));
        ds_s1.addLessons(buildQuizLesson("Quiz: Array vs LinkedList", 3,
            buildQuizConfig(new String[][]{
                {"Truy cập phần tử theo index trong Array có độ phức tạp?", "O(n)", "O(log n)", "O(1)", "O(n²)", "2"},
                {"Insert vào đầu LinkedList có độ phức tạp?", "O(n)", "O(1)", "O(log n)", "O(n log n)", "1"},
                {"Cấu trúc nào cache-friendly hơn?", "LinkedList", "Array", "Tree", "HashMap", "1"},
                {"Doubly LinkedList khác Singly LinkedList ở điểm nào?", "Có thêm pointer đến node trước", "Lưu được nhiều data hơn", "Nhanh hơn khi tìm kiếm", "Tốn ít bộ nhớ hơn", "0"}
            })));
        ds.addSections(ds_s1);
        ds.addCategories(catMap.get("ds"));
        courseRepository.save(ds);

        // ── Course 3-6: Simpler courses ──────────────────────────────────
        Course tg = buildSimpleCourse("Trees & Graphs Masterclass",
            "Từ Binary Tree đến Graph algorithms: BFS, DFS, Dijkstra, Union-Find.",
            new BigDecimal("34.99"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", instructor);
        tg.addCategories(catMap.get("tree"));
        tg.addCategories(catMap.get("graph"));
        courseRepository.save(tg);

        Course bs = buildSimpleCourse("Binary Search Deep Dive",
            "Master binary search và các biến thể.",
            new BigDecimal("24.99"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80", instructor);
        bs.addCategories(catMap.get("sort"));
        courseRepository.save(bs);

        Course greedy = buildSimpleCourse("Greedy Algorithms 101",
            "Khi nào dùng Greedy? Interval Scheduling, Activity Selection.",
            new BigDecimal("14.50"), CourseLevel.BEGINNER, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80", instructor);
        greedy.addCategories(catMap.get("algo"));
        courseRepository.save(greedy);

        Course bt = buildSimpleCourse("Backtracking Visualized",
            "N-Queens, Sudoku, Permutations, Combinations bằng backtracking.",
            new BigDecimal("27.50"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", instructor);
        bt.addCategories(catMap.get("algo"));
        courseRepository.save(bt);

        // Pending & Draft
        Course sysdesign = buildSimpleCourse("System Design Basics",
            "Thiết kế hệ thống scalable cho System Design interview.",
            new BigDecimal("59.99"), CourseLevel.INTERMEDIATE, CourseStatus.PENDING,
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", instructor);
        sysdesign.addCategories(catMap.get("sd"));
        courseRepository.save(sysdesign);

        Course seg = buildSimpleCourse("Segment Trees Explained",
            "Segment Tree, Fenwick Tree, Lazy Propagation cho range query.",
            new BigDecimal("45.00"), CourseLevel.ADVANCED, CourseStatus.PENDING,
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", instructor);
        seg.addCategories(catMap.get("ds"));
        courseRepository.save(seg);

        Course mock = buildSimpleCourse("Mock Interview Preparation",
            "Luyện tập phỏng vấn với các câu hỏi thực tế từ Google, Meta, Amazon.",
            new BigDecimal("49.99"), CourseLevel.INTERMEDIATE, CourseStatus.DRAFT,
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", instructor);
        mock.addCategories(catMap.get("algo"));
        courseRepository.save(mock);
    }

    // ─── Builder helpers ─────────────────────────────────────────────────────────

    private Course buildCourse(String title, String description, BigDecimal price, BigDecimal oldPrice,
                               CourseLevel level, CourseStatus status, String thumbnailUrl, User instructor) {
        Course c = new Course();
        c.setTitle(title);
        c.setDescription(description);
        c.setPrice(price);
        c.setOldPrice(oldPrice);
        c.setLevel(level);
        c.setStatus(status);
        c.setThumbnailUrl(thumbnailUrl);
        c.setCreatedAt(Instant.now());
        if (status == CourseStatus.PUBLISHED) c.setPublishedAt(Instant.now());
        if (instructor != null) c.setInstructor(instructor);
        return c;
    }

    private Course buildSimpleCourse(String title, String description, BigDecimal price,
                                     CourseLevel level, CourseStatus status, String thumbnailUrl, User instructor) {
        Course c = buildCourse(title, description, price, price.multiply(new BigDecimal("2")),
            level, status, thumbnailUrl, instructor);

        Section s = buildSection("Chapter 1: Giới thiệu", 1);
        s.addLessons(buildVideoLesson("Giới thiệu " + title, 1,
            "https://www.youtube.com/watch?v=oBt53YbR9Kk", 1200, true,
            "## " + title + "\n\n" + description));
        s.addLessons(buildQuizLesson("Quiz: Kiến thức nền tảng", 2,
            buildQuizConfig(new String[][]{
                {"Câu hỏi nào sau đây đúng về " + title + "?",
                 "Luôn có độ phức tạp O(n²)", "Phụ thuộc vào bài toán cụ thể",
                 "Không thể áp dụng trong thực tế", "Chỉ dùng cho số nguyên", "1"},
                {"Khi nào nên áp dụng kỹ thuật này?",
                 "Khi bài toán quá đơn giản", "Khi cần tối ưu thời gian/không gian",
                 "Khi không có giải pháp nào khác", "Không bao giờ", "1"},
                {"Độ phức tạp không gian tốt nhất thường là?",
                 "O(n²)", "O(n log n)", "O(1) hoặc O(n)", "O(2^n)", "2"}
            })));
        s.addLessons(buildCodeLesson("Bài tập thực hành", 3,
            buildCodeConfig("Bài tập: " + title,
                "Áp dụng kiến thức đã học để giải bài toán sau:\n\nCho một mảng số nguyên, tìm tổng lớn nhất của một dãy con liên tiếp (Maximum Subarray Sum).\n\n**Ví dụ:**\n- Input: [-2,1,-3,4,-1,2,1,-5,4] → Output: 6 (dãy [4,-1,2,1])",
                "maxSubArray",
                "def maxSubArray(nums):\n    # Viết code của bạn ở đây\n    pass",
                "function maxSubArray(nums) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}",
                new String[]{"nums = [-2,1,-3,4,-1,2,1,-5,4]", "nums = [1]", "nums = [5,4,-1,7,8]"},
                new String[]{"6", "1", "23"})));
        c.addSections(s);
        return c;
    }

    private Section buildSection(String title, int orderIndex) {
        Section s = new Section();
        s.setTitle(title);
        s.setOrderIndex(orderIndex);
        return s;
    }

    private Lesson buildVideoLesson(String title, int orderIndex, String videoUrl,
                                    int durationSeconds, boolean isPreview, String markdownContent) {
        Lesson l = new Lesson();
        l.setTitle(title);
        l.setType(LessonType.VIDEO);
        l.setOrderIndex(orderIndex);
        l.setVideoUrl(videoUrl);
        l.setDurationSeconds(durationSeconds);
        l.setIsPreview(isPreview);
        l.setMarkdownContent(markdownContent);
        return l;
    }

    private Lesson buildQuizLesson(String title, int orderIndex, String quizConfig) {
        Lesson l = new Lesson();
        l.setTitle(title);
        l.setType(LessonType.QUIZ);
        l.setOrderIndex(orderIndex);
        l.setDurationSeconds(600);
        l.setIsPreview(false);
        l.setQuizConfig(quizConfig);
        return l;
    }

    private Lesson buildCodeLesson(String title, int orderIndex, String codeChallengeConfig) {
        Lesson l = new Lesson();
        l.setTitle(title);
        l.setType(LessonType.CODE);
        l.setOrderIndex(orderIndex);
        l.setDurationSeconds(1800);
        l.setIsPreview(false);
        l.setCodeChallengeConfig(codeChallengeConfig);
        return l;
    }

    private String buildQuizConfig(String[][] questions) {
        StringBuilder sb = new StringBuilder("{\"questions\":[");
        for (int i = 0; i < questions.length; i++) {
            String[] q = questions[i];
            if (i > 0) sb.append(",");
            sb.append("{\"id\":").append(i + 1)
              .append(",\"question\":\"").append(escape(q[0])).append("\"")
              .append(",\"options\":[")
              .append("\"").append(escape(q[1])).append("\",")
              .append("\"").append(escape(q[2])).append("\",")
              .append("\"").append(escape(q[3])).append("\",")
              .append("\"").append(escape(q[4])).append("\"")
              .append("]")
              .append(",\"correctAnswer\":").append(q[5])
              .append("}");
        }
        sb.append("]}");
        return sb.toString();
    }

    private String buildCodeConfig(String title, String problemDescription,
                                   String functionName,
                                   String pythonCode, String jsCode, String javaCode,
                                   String[] inputs, String[] expected) {
        StringBuilder sb = new StringBuilder();
        sb.append("{")
          .append("\"title\":\"").append(escape(title)).append("\",")
          .append("\"problemDescription\":\"").append(escape(problemDescription)).append("\",")
          .append("\"functionName\":\"").append(escape(functionName)).append("\",")
          .append("\"initialCode\":{")
          .append("\"python\":\"").append(escape(pythonCode)).append("\",")
          .append("\"javascript\":\"").append(escape(jsCode)).append("\",")
          .append("\"java\":\"").append(escape(javaCode)).append("\"")
          .append("},")
          .append("\"testCases\":[");
        for (int i = 0; i < inputs.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("{\"input\":\"").append(escape(inputs[i]))
              .append("\",\"expected\":\"").append(escape(expected[i])).append("\"}");
        }
        sb.append("]}");
        return sb.toString();
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
