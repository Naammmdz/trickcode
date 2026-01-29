// Mock quiz data - sẽ được thay thế bằng API calls sau này
export const mockQuiz = {
  id: 1,
  lessonId: 4,
  courseId: 1,
  courseTitle: 'Data Structures Master',
  title: 'Quiz: Linked Lists',
  type: 'KNOWLEDGE_CHECK',
  totalQuestions: 5,
  currentQuestion: 1,
  progress: 20, // (currentQuestion / totalQuestions) * 100
  questions: [
    {
      id: 1,
      question: 'What is the main advantage of a Doubly Linked List over a Singly Linked List?',
      highlightedText: 'Doubly Linked List',
      options: [
        {
          id: 'A',
          text: 'It uses significantly less memory per node.',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'B',
          text: 'It allows bidirectional traversal (forward & backward).',
          isSelected: true,
          isCorrect: true
        },
        {
          id: 'C',
          text: 'It provides faster insertion time at the tail.',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'D',
          text: 'It eliminates the need for dynamic memory allocation.',
          isSelected: false,
          isCorrect: false
        }
      ],
      explanation: 'A Doubly Linked List contains both next and previous pointers, enabling traversal in both directions.'
    },
    {
      id: 2,
      question: 'What is the time complexity of inserting a node at the beginning of a Singly Linked List?',
      highlightedText: null,
      options: [
        {
          id: 'A',
          text: 'O(n)',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'B',
          text: 'O(1)',
          isSelected: false,
          isCorrect: true
        },
        {
          id: 'C',
          text: 'O(log n)',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'D',
          text: 'O(n log n)',
          isSelected: false,
          isCorrect: false
        }
      ],
      explanation: 'Insertion at the head of a linked list is O(1) because we only need to update the head pointer.'
    },
    {
      id: 3,
      question: 'Which data structure is best for implementing a browser\'s back/forward navigation?',
      highlightedText: null,
      options: [
        {
          id: 'A',
          text: 'Singly Linked List',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'B',
          text: 'Doubly Linked List',
          isSelected: false,
          isCorrect: true
        },
        {
          id: 'C',
          text: 'Array',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'D',
          text: 'Stack',
          isSelected: false,
          isCorrect: false
        }
      ],
      explanation: 'Doubly Linked List allows efficient bidirectional traversal, perfect for back/forward navigation.'
    },
    {
      id: 4,
      question: 'What is the space complexity of a Singly Linked List with n nodes?',
      highlightedText: null,
      options: [
        {
          id: 'A',
          text: 'O(1)',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'B',
          text: 'O(log n)',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'C',
          text: 'O(n)',
          isSelected: false,
          isCorrect: true
        },
        {
          id: 'D',
          text: 'O(n²)',
          isSelected: false,
          isCorrect: false
        }
      ],
      explanation: 'Each node requires constant space, so n nodes require O(n) space.'
    },
    {
      id: 5,
      question: 'How do you detect a cycle in a Linked List?',
      highlightedText: null,
      options: [
        {
          id: 'A',
          text: 'Using a hash set to track visited nodes',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'B',
          text: "Using Floyd's Cycle Detection (Tortoise and Hare)",
          isSelected: false,
          isCorrect: true
        },
        {
          id: 'C',
          text: 'Counting the number of nodes',
          isSelected: false,
          isCorrect: false
        },
        {
          id: 'D',
          text: 'Sorting the linked list',
          isSelected: false,
          isCorrect: false
        }
      ],
      explanation: "Floyd's Cycle Detection uses two pointers moving at different speeds to detect cycles efficiently."
    }
  ],
  breadcrumb: [
    { label: 'Learn', path: '/learn' },
    { label: 'Data Structures Master', path: '/learn/1' },
    { label: 'Quiz: Linked Lists', path: null }
  ],
  navigation: {
    previous: {
      id: 3,
      title: 'Singly vs Doubly',
      type: 'lesson'
    },
    next: {
      id: 5,
      title: 'Insertion & Deletion',
      type: 'lesson'
    }
  }
};

// Fetch quiz by lesson ID (mock function)
export const fetchQuizByLessonId = async (courseId, lessonId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data (in real app, this would call API)
  return mockQuiz;
};

// Submit quiz answer (mock function)
export const submitQuizAnswer = async (quizId, questionId, answerId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock response
  return {
    correct: true,
    explanation: 'Your answer is correct!'
  };
};
