// Course Syllabus Data Structure
// This will be replaced with API call when backend is ready

export const getCourseSyllabus = async (courseId) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/courses/${courseId}/syllabus`);
  // return await response.json();
  
  // Mock data structure matching backend format
  return {
    courseId: courseId,
    courseTitle: "Dynamic Programming Patterns",
    progress: {
      percentage: 25,
      completed: 12,
      total: 48
    },
    chapters: [
      {
        id: 1,
        title: "Foundations",
        order: 1,
        items: [
          {
            id: 1,
            type: "lesson", // lesson, quiz, code
            title: "Intro to DP Concepts",
            duration: "12:40",
            status: "completed", // completed, active, locked
            route: `/my-courses/${courseId}/lesson/1`
          },
          {
            id: 2,
            type: "lesson",
            title: "Fibonacci: Top-Down vs Bottom-Up",
            duration: "12:40",
            status: "active",
            route: `/my-courses/${courseId}/lesson/2`
          },
          {
            id: 3,
            type: "quiz",
            title: "Space Complexity Quiz",
            questionCount: 5,
            status: "locked",
            route: `/my-courses/${courseId}/quiz/3`,
            resultRoute: `/my-courses/${courseId}/quiz/3/result`
          },
          {
            id: 4,
            type: "code",
            title: "Climbing Stairs",
            status: "locked",
            route: `/my-courses/${courseId}/code/4`
          }
        ]
      },
      {
        id: 2,
        title: "1D Dynamic Programming",
        order: 2,
        items: [
          {
            id: 5,
            type: "code",
            title: "House Robber",
            status: "locked",
            route: `/my-courses/${courseId}/code/5`
          }
        ]
      }
    ]
  };
};

// Helper function to determine current item status based on route
export const getCurrentItemStatus = (currentRoute, itemRoute, itemStatus) => {
  // If current route matches item route, it's active
  if (currentRoute === itemRoute) {
    return "active";
  }
  return itemStatus;
};

// Helper function to get item icon based on type
export const getItemIcon = (type) => {
  switch (type) {
    case "lesson":
      return "play_circle";
    case "quiz":
      return "quiz";
    case "code":
      return "code";
    default:
      return "radio_button_unchecked";
  }
};

// Helper function to get item type label
export const getItemTypeLabel = (item) => {
  switch (item.type) {
    case "lesson":
      return `VIDEO • ${item.duration || ""}`;
    case "quiz":
      return `QUIZ • ${item.questionCount || 0} Qs`;
    case "code":
      return "CODE";
    default:
      return "";
  }
};
