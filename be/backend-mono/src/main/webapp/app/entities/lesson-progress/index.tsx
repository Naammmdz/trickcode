import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import LessonProgress from './lesson-progress';
import LessonProgressDetail from './lesson-progress-detail';
import LessonProgressUpdate from './lesson-progress-update';
import LessonProgressDeleteDialog from './lesson-progress-delete-dialog';

const LessonProgressRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<LessonProgress />} />
    <Route path="new" element={<LessonProgressUpdate />} />
    <Route path=":id">
      <Route index element={<LessonProgressDetail />} />
      <Route path="edit" element={<LessonProgressUpdate />} />
      <Route path="delete" element={<LessonProgressDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default LessonProgressRoutes;
