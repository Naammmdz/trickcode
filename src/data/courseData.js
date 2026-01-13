// Mock course data - sẽ được thay thế bằng API calls sau này
export const mockCourse = {
  id: 1,
  title: 'Data Structures Master',
  slug: 'data-structures-master',
  description: 'Construct efficient solutions. Deep dive into Arrays, Linked Lists, Trees, and Graphs. Essential architecture for algorithm optimization.',
  status: 'ACTIVE_MODULE',
  difficulty: 'INTERMEDIATE',
  estimatedHours: 24,
  totalLessons: 24,
  xpReward: 1250,
  enrolled: 4200,
  progress: 58,
  currentLesson: 14,
  nextLesson: 'Linked Lists Pt. 2',
  version: 'V.2.4 UPDATE',
  overview: {
    description: [
      'Data structures are the backbone of efficient software. In this comprehensive module, you will not only learn the theoretical concepts but also implement them from scratch in C++, Java, and Python. We focus on real-world applications and interview problem patterns.',
      'Starting with linear structures like arrays and linked lists, we will progress to complex hierarchical data structures. By the end of this module, you will be able to analyze time and space complexity with confidence.'
    ],
    learningOutcomes: [
      {
        title: 'Complexity Analysis',
        description: 'Master Big-O notation and analyze algorithm efficiency.'
      },
      {
        title: 'Memory Management',
        description: 'Understand pointers, references, and heap vs stack memory.'
      },
      {
        title: 'Tree Traversals',
        description: 'Implement DFS, BFS, In-order, Pre-order, and Post-order traversals.'
      },
      {
        title: 'Graph Algorithms',
        description: 'Build adjacency lists and matrices for network modeling.'
      }
    ]
  },
  syllabus: [
    {
      phase: 'Phase 1: Linear Structures',
      items: [
        {
          id: 1,
          title: 'Arrays & Dynamic Arrays',
          status: 'COMPLETED',
          type: 'VIDEO + LAB',
          duration: 45,
          completed: true,
          itemType: 'lesson'
        },
        {
          id: 2,
          title: 'String Manipulation Techniques',
          status: 'COMPLETED',
          type: 'CODING_CHALLENGE',
          duration: 60,
          completed: true,
          itemType: 'lesson'
        },
        {
          id: 3,
          title: 'Linked Lists: Singly & Doubly',
          status: 'IN_PROGRESS',
          type: 'INTERACTIVE',
          duration: 90,
          completed: false,
          isCurrent: true,
          itemType: 'lesson'
        },
        {
          id: 1,
          title: 'Quiz: Linked Lists',
          status: 'LOCKED',
          type: 'KNOWLEDGE_CHECK',
          duration: 15,
          completed: false,
          locked: true,
          itemType: 'quiz'
        }
      ]
    },
    {
      phase: 'Phase 2: Hierarchical Data',
      items: [
        {
          id: 4,
          title: 'Stacks & Queues Implementation',
          status: 'LOCKED',
          type: 'LAB',
          duration: 50,
          completed: false,
          locked: true,
          itemType: 'lesson'
        },
        {
          id: 5,
          title: 'Trees & Binary Search Trees',
          status: 'LOCKED',
          type: 'PROJECT',
          duration: 120,
          completed: false,
          locked: true,
          itemType: 'lesson'
        }
      ]
    }
  ],
  prerequisites: [
    {
      title: 'Intro to Algorithms',
      completed: true
    },
    {
      title: 'Basic Python/Java Syntax',
      completed: true
    },
    {
      title: 'Discrete Mathematics',
      completed: false
    }
  ],
  instructor: {
    name: 'Dr. A. Turing',
    title: 'Sr. System Architect',
    avatar: null
  },
  breadcrumb: [
    { label: 'Learn', path: '/learn' },
    { label: 'Data Structures Master', path: null }
  ]
};

// Fetch course by ID (mock function)
export const fetchCourseById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data (in real app, this would call API)
  return mockCourse;
};
