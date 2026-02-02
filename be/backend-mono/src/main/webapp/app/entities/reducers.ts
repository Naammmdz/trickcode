import course from 'app/entities/course/course.reducer';
import section from 'app/entities/section/section.reducer';
import lesson from 'app/entities/lesson/lesson.reducer';
import enrollment from 'app/entities/enrollment/enrollment.reducer';
import lessonProgress from 'app/entities/lesson-progress/lesson-progress.reducer';
import order from 'app/entities/order/order.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  course,
  section,
  lesson,
  enrollment,
  lessonProgress,
  order,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
