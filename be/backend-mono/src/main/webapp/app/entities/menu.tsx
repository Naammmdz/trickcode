import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/course">
        <Translate contentKey="global.menu.entities.course" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/section">
        <Translate contentKey="global.menu.entities.section" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/lesson">
        <Translate contentKey="global.menu.entities.lesson" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/enrollment">
        <Translate contentKey="global.menu.entities.enrollment" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/lesson-progress">
        <Translate contentKey="global.menu.entities.lessonProgress" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/order">
        <Translate contentKey="global.menu.entities.order" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
