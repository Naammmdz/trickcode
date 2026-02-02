import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './course.reducer';

export const CourseDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const courseEntity = useAppSelector(state => state.course.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="courseDetailsHeading">
          <Translate contentKey="trickcodeApp.course.detail.title">Course</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{courseEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="trickcodeApp.course.title">Title</Translate>
            </span>
          </dt>
          <dd>{courseEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="trickcodeApp.course.description">Description</Translate>
            </span>
          </dt>
          <dd>{courseEntity.description}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="trickcodeApp.course.price">Price</Translate>
            </span>
          </dt>
          <dd>{courseEntity.price}</dd>
          <dt>
            <span id="oldPrice">
              <Translate contentKey="trickcodeApp.course.oldPrice">Old Price</Translate>
            </span>
          </dt>
          <dd>{courseEntity.oldPrice}</dd>
          <dt>
            <span id="level">
              <Translate contentKey="trickcodeApp.course.level">Level</Translate>
            </span>
          </dt>
          <dd>{courseEntity.level}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="trickcodeApp.course.status">Status</Translate>
            </span>
          </dt>
          <dd>{courseEntity.status}</dd>
          <dt>
            <span id="thumbnailUrl">
              <Translate contentKey="trickcodeApp.course.thumbnailUrl">Thumbnail Url</Translate>
            </span>
          </dt>
          <dd>{courseEntity.thumbnailUrl}</dd>
          <dt>
            <span id="videoPreviewUrl">
              <Translate contentKey="trickcodeApp.course.videoPreviewUrl">Video Preview Url</Translate>
            </span>
          </dt>
          <dd>{courseEntity.videoPreviewUrl}</dd>
          <dt>
            <span id="rejectionReason">
              <Translate contentKey="trickcodeApp.course.rejectionReason">Rejection Reason</Translate>
            </span>
          </dt>
          <dd>{courseEntity.rejectionReason}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="trickcodeApp.course.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{courseEntity.createdAt ? <TextFormat value={courseEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="trickcodeApp.course.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{courseEntity.updatedAt ? <TextFormat value={courseEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="publishedAt">
              <Translate contentKey="trickcodeApp.course.publishedAt">Published At</Translate>
            </span>
          </dt>
          <dd>{courseEntity.publishedAt ? <TextFormat value={courseEntity.publishedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="trickcodeApp.course.instructor">Instructor</Translate>
          </dt>
          <dd>{courseEntity.instructor ? courseEntity.instructor.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/course" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/course/${courseEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CourseDetail;
