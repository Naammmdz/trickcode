import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './lesson-progress.reducer';

export const LessonProgressDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const lessonProgressEntity = useAppSelector(state => state.lessonProgress.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="lessonProgressDetailsHeading">
          <Translate contentKey="trickcodeApp.lessonProgress.detail.title">LessonProgress</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{lessonProgressEntity.id}</dd>
          <dt>
            <span id="completedAt">
              <Translate contentKey="trickcodeApp.lessonProgress.completedAt">Completed At</Translate>
            </span>
          </dt>
          <dd>
            {lessonProgressEntity.completedAt ? (
              <TextFormat value={lessonProgressEntity.completedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="isCompleted">
              <Translate contentKey="trickcodeApp.lessonProgress.isCompleted">Is Completed</Translate>
            </span>
          </dt>
          <dd>{lessonProgressEntity.isCompleted ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="trickcodeApp.lessonProgress.user">User</Translate>
          </dt>
          <dd>{lessonProgressEntity.user ? lessonProgressEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="trickcodeApp.lessonProgress.lesson">Lesson</Translate>
          </dt>
          <dd>{lessonProgressEntity.lesson ? lessonProgressEntity.lesson.id : ''}</dd>
          <dt>
            <Translate contentKey="trickcodeApp.lessonProgress.enrollment">Enrollment</Translate>
          </dt>
          <dd>{lessonProgressEntity.enrollment ? lessonProgressEntity.enrollment.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/lesson-progress" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/lesson-progress/${lessonProgressEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default LessonProgressDetail;
