import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './lesson.reducer';

export const LessonDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const lessonEntity = useAppSelector(state => state.lesson.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="lessonDetailsHeading">
          <Translate contentKey="trickcodeApp.lesson.detail.title">Lesson</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="trickcodeApp.lesson.title">Title</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.title}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="trickcodeApp.lesson.type">Type</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.type}</dd>
          <dt>
            <span id="orderIndex">
              <Translate contentKey="trickcodeApp.lesson.orderIndex">Order Index</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.orderIndex}</dd>
          <dt>
            <span id="durationSeconds">
              <Translate contentKey="trickcodeApp.lesson.durationSeconds">Duration Seconds</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.durationSeconds}</dd>
          <dt>
            <span id="isPreview">
              <Translate contentKey="trickcodeApp.lesson.isPreview">Is Preview</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.isPreview ? 'true' : 'false'}</dd>
          <dt>
            <span id="videoUrl">
              <Translate contentKey="trickcodeApp.lesson.videoUrl">Video Url</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.videoUrl}</dd>
          <dt>
            <span id="captionUrl">
              <Translate contentKey="trickcodeApp.lesson.captionUrl">Caption Url</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.captionUrl}</dd>
          <dt>
            <span id="markdownContent">
              <Translate contentKey="trickcodeApp.lesson.markdownContent">Markdown Content</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.markdownContent}</dd>
          <dt>
            <span id="quizConfig">
              <Translate contentKey="trickcodeApp.lesson.quizConfig">Quiz Config</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.quizConfig}</dd>
          <dt>
            <span id="codeChallengeConfig">
              <Translate contentKey="trickcodeApp.lesson.codeChallengeConfig">Code Challenge Config</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.codeChallengeConfig}</dd>
          <dt>
            <Translate contentKey="trickcodeApp.lesson.section">Section</Translate>
          </dt>
          <dd>{lessonEntity.section ? lessonEntity.section.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/lesson" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/lesson/${lessonEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default LessonDetail;
