// Mock lesson data - sẽ được thay thế bằng API calls sau này
export const mockLesson = {
  id: 3,
  courseId: 1,
  courseTitle: 'Data Structures Master',
  title: 'Singly vs Doubly Linked Lists',
  slug: 'singly-vs-doubly-linked-lists',
  duration: 15,
  difficulty: 'INTERMEDIATE',
  readTime: '15 MIN READ',
  progress: 45,
  videoProgress: 35,
  videoDuration: '12:45',
  currentTime: '04:20',
  type: 'INTERACTIVE',
  status: 'IN_PROGRESS',
  content: {
    introduction: [
      'When architecting linear data storage, the choice between a singly linked list and a doubly linked list often dictates the efficiency of your algorithms. While both structures allow for dynamic memory allocation, their traversal capabilities differ significantly.'
    ],
    sections: [
      {
        title: 'Structural Differences',
        content: [
          'A Singly Linked List node contains data and a pointer to the next node. This allows traversal in one direction (forward). It is memory efficient but limited in flexibility.',
          'A Doubly Linked List node contains data, a pointer to the next node, and a pointer to the previous node. This bidirectional capability enables O(1) deletion if the node address is known, but comes at the cost of extra memory overhead for the `prev` pointer.'
        ],
        code: {
          language: 'cpp',
          title: 'TERMINAL_VIEW // C++',
          content: `// Definition for singly-linked list node
struct SinglyListNode {
    int val;
    SinglyListNode *next;
    SinglyListNode(int x) : val(x), next(NULL) {}
};
// Definition for doubly-linked list node
struct DoublyListNode {
    int val;
    DoublyListNode *next;
    DoublyListNode *prev; // Extra pointer overhead
    DoublyListNode(int x) 
        : val(x), next(NULL), prev(NULL) {}
};`
        }
      },
      {
        title: 'When to Use Each',
        content: [
          'The choice depends heavily on the specific requirements of your application. If you need to perform frequent deletions or navigate backwards (e.g., browser history, undo functionality), a Doubly Linked List is preferred despite the extra memory cost.'
        ]
      }
    ]
  },
  syllabus: {
    progress: 45,
    sections: [
      {
        title: '1. Memory Fundamentals',
        items: [
          {
            id: 1,
            title: 'Pointers & References',
            completed: true,
            itemType: 'lesson'
          },
          {
            id: 2,
            title: 'Heap vs Stack Memory',
            completed: true,
            itemType: 'lesson'
          }
        ]
      },
      {
        title: '2. Linked Lists',
        items: [
          {
            id: 3,
            title: 'Introduction to Nodes',
            completed: true,
            itemType: 'lesson'
          },
          {
            id: 4,
            title: 'Singly vs Doubly',
            completed: false,
            isCurrent: true,
            itemType: 'lesson'
          },
          {
            id: 1,
            title: 'Quiz: Linked Lists',
            completed: false,
            itemType: 'quiz'
          },
          {
            id: 5,
            title: 'Insertion & Deletion',
            completed: false,
            locked: false,
            itemType: 'lesson'
          },
          {
            id: 6,
            title: "Cycle Detection (Floyd's)",
            completed: false,
            locked: true,
            itemType: 'lesson'
          }
        ]
      }
    ]
  },
  navigation: {
    previous: {
      id: 2,
      title: 'Memory Basics'
    },
    next: {
      id: 5,
      title: 'Insertion & Deletion'
    }
  },
  breadcrumb: [
    { label: 'Learn', path: '/learn' },
    { label: 'Data Structures Master', path: '/learn/1' },
    { label: 'Singly vs Doubly Linked Lists', path: null }
  ]
};

// Fetch lesson by ID (mock function)
export const fetchLessonById = async (courseId, lessonId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data (in real app, this would call API)
  return mockLesson;
};
