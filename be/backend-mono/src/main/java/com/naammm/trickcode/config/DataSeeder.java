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
        // Guard: chỉ seed nếu chưa có course nào
        if (courseRepository.count() == 0) {
            seedCourses();
        }
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
        Set<Authority> authorities = new HashSet<>();
        for (String role : roles) {
            authorityRepository.findById(role).ifPresent(authorities::add);
        }
        u.setAuthorities(authorities);
        return u;
    }

    // ─── Courses ────────────────────────────────────────────────────────────────

    private void seedCourses() {
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
        // Section 1
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
                 "Optimal Substructure", "Overlapping Subproblems", "Greedy Choice Property", "Có thể lưu cache",
                 "2"},
                {"Memoization thuộc phương pháp nào?",
                 "Bottom-up", "Top-down", "Greedy", "Divide & Conquer",
                 "1"},
                {"Độ phức tạp thời gian của Fibonacci DP là?",
                 "O(2^n)", "O(n log n)", "O(n)", "O(1)",
                 "2"},
                {"Tabulation dùng cấu trúc dữ liệu nào?",
                 "Stack", "Queue", "Bảng (Array/Table)", "Heap",
                 "2"},
                {"Khi nào nên dùng DP thay vì Greedy?",
                 "Khi bài toán có Greedy Choice Property", "Khi cần kết quả gần đúng",
                 "Khi lời giải tối ưu phụ thuộc vào nhiều lựa chọn con", "Khi input nhỏ",
                 "2"}
            })));
        dp_s1.addLessons(buildCodeLesson("Climbing Stairs", 4,
            buildCodeConfig(
                "Climbing Stairs",
                "Bạn đang leo cầu thang có `n` bậc. Mỗi lần bạn có thể leo 1 hoặc 2 bậc. Hỏi có bao nhiêu cách khác nhau để leo lên đỉnh?\n\n**Ví dụ:**\n- Input: n = 2 → Output: 2 (1+1, 2)\n- Input: n = 3 → Output: 3 (1+1+1, 1+2, 2+1)",
                "def climbStairs(n: int) -> int:\n    # Viết code của bạn ở đây\n    pass",
                "function climbStairs(n) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public int climbStairs(int n) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}",
                new String[]{"n = 2", "n = 3", "n = 5"},
                new String[]{"2", "3", "8"}
            )));
        dp.addSections(dp_s1);

        // Section 2
        Section dp_s2 = buildSection("Chapter 2: Knapsack & Subsequence", 2);
        dp_s2.addLessons(buildVideoLesson("0/1 Knapsack Problem", 1,
            "https://www.youtube.com/watch?v=nLmhmB6NzcM", 2100, false,
            "## 0/1 Knapsack\n\nCho `n` vật phẩm, mỗi vật có trọng lượng `w[i]` và giá trị `v[i]`. Túi có sức chứa `W`. Chọn các vật để tổng giá trị lớn nhất.\n\n```python\ndef knapsack(W, weights, values, n):\n    dp = [[0] * (W + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(W + 1):\n            dp[i][w] = dp[i-1][w]\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])\n    return dp[n][W]\n```"));
        dp_s2.addLessons(buildVideoLesson("Longest Common Subsequence (LCS)", 2,
            "https://www.youtube.com/watch?v=Ua0GhsJSlWM", 1980, false,
            "## LCS\n\nTìm dãy con chung dài nhất của hai chuỗi.\n\n```python\ndef lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n```"));
        dp_s2.addLessons(buildCodeLesson("House Robber", 3,
            buildCodeConfig(
                "House Robber",
                "Bạn là tên trộm muốn cướp các ngôi nhà trên một con phố. Mỗi nhà có một lượng tiền `nums[i]`. Không thể cướp hai nhà liền kề. Tìm số tiền tối đa có thể cướp.\n\n**Ví dụ:**\n- Input: [1,2,3,1] → Output: 4 (nhà 0 + nhà 2)\n- Input: [2,7,9,3,1] → Output: 12 (nhà 0 + nhà 2 + nhà 4)",
                "def rob(nums):\n    # Viết code của bạn ở đây\n    pass",
                "function rob(nums) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public int rob(int[] nums) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}",
                new String[]{"nums = [1,2,3,1]", "nums = [2,7,9,3,1]", "nums = [0]"},
                new String[]{"4", "12", "0"}
            )));
        dp.addSections(dp_s2);

        courseRepository.save(dp);

        // ── Course 2: Data Structures Fundamentals (PUBLISHED, BEGINNER) ──────
        Course ds = buildCourse(
            "Data Structures Fundamentals",
            "Khóa học toàn diện về các cấu trúc dữ liệu cơ bản: Array, LinkedList, Stack, Queue, Tree, và HashMap. Phù hợp cho người mới bắt đầu chuẩn bị phỏng vấn.",
            BigDecimal.ZERO, new BigDecimal("49.99"),
            CourseLevel.BEGINNER, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
            instructor
        );
        Section ds_s1 = buildSection("Chapter 1: Array & LinkedList", 1);
        ds_s1.addLessons(buildVideoLesson("Array là gì? Khi nào dùng?", 1,
            "https://www.youtube.com/watch?v=QJNwK2uJyGs", 1200, true,
            "## Array\n\nArray là cấu trúc dữ liệu lưu trữ các phần tử **cùng kiểu** trong bộ nhớ **liên tiếp**.\n\n### Ưu điểm\n- Truy cập O(1) theo index\n- Cache-friendly\n\n### Nhược điểm\n- Insert/Delete O(n)\n- Kích thước cố định (static array)\n\n### Khi nào dùng?\n- Cần truy cập ngẫu nhiên nhanh\n- Biết trước số lượng phần tử"));
        ds_s1.addLessons(buildVideoLesson("LinkedList: Singly & Doubly", 2,
            "https://www.youtube.com/watch?v=njTh_OwMljA", 1500, false,
            "## LinkedList\n\nMỗi node chứa **data** và **pointer** đến node tiếp theo.\n\n```python\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, val):\n        node = Node(val)\n        if not self.head:\n            self.head = node\n            return\n        cur = self.head\n        while cur.next:\n            cur = cur.next\n        cur.next = node\n```"));
        ds_s1.addLessons(buildQuizLesson("Quiz: Array vs LinkedList", 3,
            buildQuizConfig(new String[][]{
                {"Truy cập phần tử theo index trong Array có độ phức tạp?",
                 "O(n)", "O(log n)", "O(1)", "O(n²)",
                 "2"},
                {"Insert vào đầu LinkedList có độ phức tạp?",
                 "O(n)", "O(1)", "O(log n)", "O(n log n)",
                 "1"},
                {"Cấu trúc nào cache-friendly hơn?",
                 "LinkedList", "Array", "Tree", "HashMap",
                 "1"},
                {"Doubly LinkedList khác Singly LinkedList ở điểm nào?",
                 "Có thêm pointer đến node trước", "Lưu được nhiều data hơn",
                 "Nhanh hơn khi tìm kiếm", "Tốn ít bộ nhớ hơn",
                 "0"}
            })));
        ds_s1.addLessons(buildCodeLesson("Reverse a LinkedList", 4,
            buildCodeConfig(
                "Reverse Linked List",
                "Đảo ngược một Linked List.\n\n**Ví dụ:**\n- Input: 1 → 2 → 3 → 4 → 5\n- Output: 5 → 4 → 3 → 2 → 1\n\nHàm nhận vào `head` là node đầu tiên, trả về node đầu tiên sau khi đảo ngược.",
                "def reverseList(head):\n    prev = None\n    curr = head\n    # Viết code của bạn ở đây\n    pass",
                "function reverseList(head) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Viết code của bạn ở đây\n        return null;\n    }\n}",
                new String[]{"[1,2,3,4,5]", "[1,2]", "[]"},
                new String[]{"[5,4,3,2,1]", "[2,1]", "[]"}
            )));
        ds.addSections(ds_s1);

        Section ds_s2 = buildSection("Chapter 2: Stack, Queue & HashMap", 2);
        ds_s2.addLessons(buildVideoLesson("Stack & Queue: LIFO vs FIFO", 1,
            "https://www.youtube.com/watch?v=wjI1WNcIntg", 1320, false,
            "## Stack (LIFO)\n\n```python\nstack = []\nstack.append(1)  # push\nstack.pop()      # pop\nstack[-1]        # peek\n```\n\n## Queue (FIFO)\n\n```python\nfrom collections import deque\nqueue = deque()\nqueue.append(1)    # enqueue\nqueue.popleft()    # dequeue\n```\n\n### Ứng dụng\n- **Stack**: Undo/Redo, DFS, Parsing\n- **Queue**: BFS, Task scheduling"));
        ds_s2.addLessons(buildVideoLesson("HashMap: Hashing & Collision", 2,
            "https://www.youtube.com/watch?v=KyUTuwz_b7Q", 1680, false,
            "## HashMap\n\nLưu trữ key-value pairs với truy cập O(1) trung bình.\n\n```python\n# Python dict là HashMap\nhashmap = {}\nhashmap['key'] = 'value'  # O(1)\nvalue = hashmap.get('key')  # O(1)\ndel hashmap['key']          # O(1)\n\n# Đếm tần suất\nfrom collections import Counter\ncount = Counter([1, 2, 2, 3, 3, 3])\n# Counter({3: 3, 2: 2, 1: 1})\n```"));
        ds_s2.addLessons(buildQuizLesson("Quiz: Stack, Queue & HashMap", 3,
            buildQuizConfig(new String[][]{
                {"Stack hoạt động theo nguyên tắc nào?",
                 "FIFO", "LIFO", "Random", "Priority",
                 "1"},
                {"Thuật toán BFS dùng cấu trúc dữ liệu nào?",
                 "Stack", "HashMap", "Queue", "Array",
                 "2"},
                {"Độ phức tạp trung bình của HashMap lookup?",
                 "O(n)", "O(log n)", "O(n²)", "O(1)",
                 "3"},
                {"Collision trong HashMap xảy ra khi nào?",
                 "Khi HashMap đầy", "Hai key khác nhau có cùng hash value",
                 "Khi xóa một phần tử", "Khi thêm quá nhiều phần tử",
                 "1"},
                {"Dùng gì để implement Stack trong Python?",
                 "list với append/pop", "deque với appendleft/popleft",
                 "dict", "set",
                 "0"}
            })));
        ds.addSections(ds_s2);

        courseRepository.save(ds);

        // ── Course 3: Trees & Graphs Masterclass (PUBLISHED, INTERMEDIATE) ───
        Course tg = buildCourse(
            "Trees & Graphs Masterclass",
            "Từ Binary Tree đến Graph algorithms: BFS, DFS, Dijkstra, Union-Find. Giải quyết các bài toán phỏng vấn phổ biến nhất về cây và đồ thị.",
            new BigDecimal("34.99"), new BigDecimal("69.99"),
            CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
            instructor
        );
        Section tg_s1 = buildSection("Chapter 1: Binary Tree Traversals", 1);
        tg_s1.addLessons(buildVideoLesson("Binary Tree: Inorder, Preorder, Postorder", 1,
            "https://www.youtube.com/watch?v=WLvU5EQVZqY", 1860, true,
            "## Binary Tree Traversals\n\n```python\nclass TreeNode:\n    def __init__(self, val=0):\n        self.val = val\n        self.left = None\n        self.right = None\n\n# Inorder: Left → Root → Right\ndef inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)\n\n# Preorder: Root → Left → Right\ndef preorder(root):\n    if not root: return []\n    return [root.val] + preorder(root.left) + preorder(root.right)\n\n# Postorder: Left → Right → Root\ndef postorder(root):\n    if not root: return []\n    return postorder(root.left) + postorder(root.right) + [root.val]\n```"));
        tg_s1.addLessons(buildVideoLesson("BFS: Level Order Traversal", 2,
            "https://www.youtube.com/watch?v=6ZnyEApgFYg", 1440, false,
            "## BFS - Breadth First Search\n\n```python\nfrom collections import deque\n\ndef levelOrder(root):\n    if not root: return []\n    result = []\n    queue = deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result\n```\n\n**Time**: O(n) | **Space**: O(n)"));
        tg_s1.addLessons(buildQuizLesson("Quiz: Tree Traversals", 3,
            buildQuizConfig(new String[][]{
                {"Inorder traversal của BST cho kết quả như thế nào?",
                 "Ngẫu nhiên", "Giảm dần", "Tăng dần", "Theo level",
                 "2"},
                {"BFS dùng cấu trúc dữ liệu nào?",
                 "Stack", "Queue", "HashMap", "Array",
                 "1"},
                {"DFS dùng cấu trúc dữ liệu nào (iterative)?",
                 "Queue", "Stack", "Heap", "LinkedList",
                 "1"},
                {"Postorder traversal thăm node theo thứ tự nào?",
                 "Root → Left → Right", "Left → Root → Right",
                 "Left → Right → Root", "Right → Left → Root",
                 "2"},
                {"Level Order Traversal tương đương với?",
                 "DFS", "BFS", "Inorder", "Postorder",
                 "1"}
            })));
        tg_s1.addLessons(buildCodeLesson("Maximum Depth of Binary Tree", 4,
            buildCodeConfig(
                "Maximum Depth of Binary Tree",
                "Tìm chiều sâu lớn nhất của một Binary Tree.\n\nChiều sâu là số node trên đường đi dài nhất từ root đến leaf.\n\n**Ví dụ:**\n```\n    3\n   / \\\n  9  20\n    /  \\\n   15   7\n```\nOutput: 3",
                "def maxDepth(root) -> int:\n    # Viết code của bạn ở đây\n    pass",
                "function maxDepth(root) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public int maxDepth(TreeNode root) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}",
                new String[]{"root = [3,9,20,null,null,15,7]", "root = [1,null,2]", "root = []"},
                new String[]{"3", "2", "0"}
            )));
        tg.addSections(tg_s1);

        Section tg_s2 = buildSection("Chapter 2: Graph Algorithms", 2);
        tg_s2.addLessons(buildVideoLesson("Graph Representation: Adjacency List & Matrix", 1,
            "https://www.youtube.com/watch?v=tWVWeAqZ0WU", 1620, false,
            "## Graph Representation\n\n### Adjacency List\n```python\ngraph = {\n    0: [1, 2],\n    1: [0, 3],\n    2: [0, 4],\n    3: [1],\n    4: [2]\n}\n```\n\n### DFS trên Graph\n```python\ndef dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited\n```"));
        tg_s2.addLessons(buildVideoLesson("Dijkstra's Shortest Path Algorithm", 2,
            "https://www.youtube.com/watch?v=GazC3A4OQTE", 2040, false,
            "## Dijkstra's Algorithm\n\nTìm đường đi ngắn nhất từ một node nguồn đến tất cả các node khác.\n\n```python\nimport heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    \n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist\n```\n\n**Time**: O((V + E) log V)"));
        tg_s2.addLessons(buildQuizLesson("Quiz: Graph Algorithms", 3,
            buildQuizConfig(new String[][]{
                {"Dijkstra không hoạt động khi nào?",
                 "Graph có chu trình", "Graph có cạnh âm",
                 "Graph không liên thông", "Graph có nhiều node",
                 "1"},
                {"Độ phức tạp của BFS trên Graph?",
                 "O(V²)", "O(V + E)", "O(E log V)", "O(V log V)",
                 "1"},
                {"Adjacency List phù hợp với loại graph nào?",
                 "Dense graph", "Sparse graph", "Complete graph", "Weighted graph",
                 "1"},
                {"Thuật toán nào tìm cây khung nhỏ nhất?",
                 "Dijkstra", "BFS", "Kruskal/Prim", "DFS",
                 "2"}
            })));
        tg.addSections(tg_s2);

        courseRepository.save(tg);

        // ── Thêm các khóa học khác (ít section hơn) ──────────────────────────
        courseRepository.save(buildSimpleCourse("Binary Search Deep Dive",
            "Master binary search và các biến thể: tìm kiếm trong rotated array, tìm boundary, search space reduction.",
            new BigDecimal("24.99"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80", instructor));

        courseRepository.save(buildSimpleCourse("Greedy Algorithms 101",
            "Khi nào dùng Greedy? Interval Scheduling, Activity Selection, Huffman Coding, và các bài toán tham lam kinh điển.",
            new BigDecimal("14.50"), CourseLevel.BEGINNER, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80", instructor));

        courseRepository.save(buildSimpleCourse("Backtracking Visualized",
            "Giải quyết N-Queens, Sudoku, Permutations, Combinations bằng kỹ thuật backtracking với visualization rõ ràng.",
            new BigDecimal("27.50"), CourseLevel.INTERMEDIATE, CourseStatus.PUBLISHED,
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", instructor));

        // Pending (chờ admin duyệt)
        courseRepository.save(buildSimpleCourse("System Design Basics",
            "Thiết kế hệ thống scalable: Load Balancing, Caching, Database Sharding, Microservices. Chuẩn bị cho vòng System Design interview.",
            new BigDecimal("59.99"), CourseLevel.INTERMEDIATE, CourseStatus.PENDING,
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", instructor));

        courseRepository.save(buildSimpleCourse("Segment Trees Explained",
            "Cấu trúc dữ liệu nâng cao: Segment Tree, Fenwick Tree, Lazy Propagation cho các bài toán range query.",
            new BigDecimal("45.00"), CourseLevel.ADVANCED, CourseStatus.PENDING,
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", instructor));

        // Draft
        courseRepository.save(buildSimpleCourse("Mock Interview Preparation",
            "Luyện tập phỏng vấn với các câu hỏi thực tế từ Google, Meta, Amazon. Phân tích time/space complexity chi tiết.",
            new BigDecimal("49.99"), CourseLevel.INTERMEDIATE, CourseStatus.DRAFT,
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", instructor));
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

    /** Khóa học đơn giản với 1 section, 3 lesson (video + quiz + code) */
    private Course buildSimpleCourse(String title, String description, BigDecimal price,
                                     CourseLevel level, CourseStatus status, String thumbnailUrl, User instructor) {
        Course c = buildCourse(title, description, price, price.multiply(new BigDecimal("2")),
            level, status, thumbnailUrl, instructor);

        Section s = buildSection("Chapter 1: Giới thiệu", 1);
        s.addLessons(buildVideoLesson("Giới thiệu " + title, 1,
            "https://www.youtube.com/watch?v=oBt53YbR9Kk", 1200, true,
            "## " + title + "\n\n" + description + "\n\n### Nội dung khóa học\n- Lý thuyết cơ bản\n- Bài tập thực hành\n- Phân tích độ phức tạp"));
        s.addLessons(buildQuizLesson("Quiz: Kiến thức nền tảng", 2,
            buildQuizConfig(new String[][]{
                {"Câu hỏi nào sau đây đúng về " + title + "?",
                 "Luôn có độ phức tạp O(n²)", "Phụ thuộc vào bài toán cụ thể",
                 "Không thể áp dụng trong thực tế", "Chỉ dùng cho số nguyên",
                 "1"},
                {"Khi nào nên áp dụng kỹ thuật này?",
                 "Khi bài toán quá đơn giản", "Khi cần tối ưu thời gian/không gian",
                 "Khi không có giải pháp nào khác", "Không bao giờ",
                 "1"},
                {"Độ phức tạp không gian tốt nhất thường là?",
                 "O(n²)", "O(n log n)", "O(1) hoặc O(n)", "O(2^n)",
                 "2"}
            })));
        s.addLessons(buildCodeLesson("Bài tập thực hành", 3,
            buildCodeConfig(
                "Bài tập: " + title,
                "Áp dụng kiến thức đã học để giải bài toán sau:\n\nCho một mảng số nguyên, tìm tổng lớn nhất của một dãy con liên tiếp (Maximum Subarray Sum).\n\n**Ví dụ:**\n- Input: [-2,1,-3,4,-1,2,1,-5,4] → Output: 6 (dãy [4,-1,2,1])",
                "def maxSubArray(nums):\n    # Viết code của bạn ở đây\n    pass",
                "function maxSubArray(nums) {\n    // Viết code của bạn ở đây\n}",
                "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}",
                new String[]{"nums = [-2,1,-3,4,-1,2,1,-5,4]", "nums = [1]", "nums = [5,4,-1,7,8]"},
                new String[]{"6", "1", "23"}
            )));
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

    /** Tạo quizConfig JSON từ mảng câu hỏi.
     *  Mỗi câu: [question, opt0, opt1, opt2, opt3, correctIndex] */
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

    /** Tạo codeChallengeConfig JSON */
    private String buildCodeConfig(String title, String problemDescription,
                                   String pythonCode, String jsCode, String javaCode,
                                   String[] inputs, String[] expected) {
        StringBuilder sb = new StringBuilder();
        sb.append("{")
          .append("\"title\":\"").append(escape(title)).append("\",")
          .append("\"problemDescription\":\"").append(escape(problemDescription)).append("\",")
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
