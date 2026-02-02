import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Section from './section';
import SectionDetail from './section-detail';
import SectionUpdate from './section-update';
import SectionDeleteDialog from './section-delete-dialog';

const SectionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Section />} />
    <Route path="new" element={<SectionUpdate />} />
    <Route path=":id">
      <Route index element={<SectionDetail />} />
      <Route path="edit" element={<SectionUpdate />} />
      <Route path="delete" element={<SectionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SectionRoutes;
