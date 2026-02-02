import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Course from './course';
import Section from './section';
import Lesson from './lesson';
import Enrollment from './enrollment';
import LessonProgress from './lesson-progress';
import Order from './order';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="course/*" element={<Course />} />
        <Route path="section/*" element={<Section />} />
        <Route path="lesson/*" element={<Lesson />} />
        <Route path="enrollment/*" element={<Enrollment />} />
        <Route path="lesson-progress/*" element={<LessonProgress />} />
        <Route path="order/*" element={<Order />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
