import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './section.reducer';

export const SectionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const sectionEntity = useAppSelector(state => state.section.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="sectionDetailsHeading">
          <Translate contentKey="trickcodeApp.section.detail.title">Section</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{sectionEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="trickcodeApp.section.title">Title</Translate>
            </span>
          </dt>
          <dd>{sectionEntity.title}</dd>
          <dt>
            <span id="orderIndex">
              <Translate contentKey="trickcodeApp.section.orderIndex">Order Index</Translate>
            </span>
          </dt>
          <dd>{sectionEntity.orderIndex}</dd>
          <dt>
            <Translate contentKey="trickcodeApp.section.course">Course</Translate>
          </dt>
          <dd>{sectionEntity.course ? sectionEntity.course.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/section" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/section/${sectionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SectionDetail;
