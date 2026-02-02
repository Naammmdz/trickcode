import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { CourseLevel } from 'app/shared/model/enumerations/course-level.model';
import { CourseStatus } from 'app/shared/model/enumerations/course-status.model';
import { createEntity, getEntity, reset, updateEntity } from './course.reducer';

export const CourseUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const courseEntity = useAppSelector(state => state.course.entity);
  const loading = useAppSelector(state => state.course.loading);
  const updating = useAppSelector(state => state.course.updating);
  const updateSuccess = useAppSelector(state => state.course.updateSuccess);
  const courseLevelValues = Object.keys(CourseLevel);
  const courseStatusValues = Object.keys(CourseStatus);

  const handleClose = () => {
    navigate(`/course${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.price !== undefined && typeof values.price !== 'number') {
      values.price = Number(values.price);
    }
    if (values.oldPrice !== undefined && typeof values.oldPrice !== 'number') {
      values.oldPrice = Number(values.oldPrice);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);
    values.publishedAt = convertDateTimeToServer(values.publishedAt);

    const entity = {
      ...courseEntity,
      ...values,
      instructor: users.find(it => it.id.toString() === values.instructor?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
          publishedAt: displayDefaultDateTime(),
        }
      : {
          level: 'BEGINNER',
          status: 'DRAFT',
          ...courseEntity,
          createdAt: convertDateTimeFromServer(courseEntity.createdAt),
          updatedAt: convertDateTimeFromServer(courseEntity.updatedAt),
          publishedAt: convertDateTimeFromServer(courseEntity.publishedAt),
          instructor: courseEntity?.instructor?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="trickcodeApp.course.home.createOrEditLabel" data-cy="CourseCreateUpdateHeading">
            <Translate contentKey="trickcodeApp.course.home.createOrEditLabel">Create or edit a Course</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="course-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('trickcodeApp.course.title')}
                id="course-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('trickcodeApp.course.description')}
                id="course-description"
                name="description"
                data-cy="description"
                type="textarea"
              />
              <ValidatedField label={translate('trickcodeApp.course.price')} id="course-price" name="price" data-cy="price" type="text" />
              <ValidatedField
                label={translate('trickcodeApp.course.oldPrice')}
                id="course-oldPrice"
                name="oldPrice"
                data-cy="oldPrice"
                type="text"
              />
              <ValidatedField label={translate('trickcodeApp.course.level')} id="course-level" name="level" data-cy="level" type="select">
                {courseLevelValues.map(courseLevel => (
                  <option value={courseLevel} key={courseLevel}>
                    {translate(`trickcodeApp.CourseLevel.${courseLevel}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('trickcodeApp.course.status')}
                id="course-status"
                name="status"
                data-cy="status"
                type="select"
              >
                {courseStatusValues.map(courseStatus => (
                  <option value={courseStatus} key={courseStatus}>
                    {translate(`trickcodeApp.CourseStatus.${courseStatus}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('trickcodeApp.course.thumbnailUrl')}
                id="course-thumbnailUrl"
                name="thumbnailUrl"
                data-cy="thumbnailUrl"
                type="text"
              />
              <ValidatedField
                label={translate('trickcodeApp.course.videoPreviewUrl')}
                id="course-videoPreviewUrl"
                name="videoPreviewUrl"
                data-cy="videoPreviewUrl"
                type="text"
              />
              <ValidatedField
                label={translate('trickcodeApp.course.rejectionReason')}
                id="course-rejectionReason"
                name="rejectionReason"
                data-cy="rejectionReason"
                type="text"
              />
              <ValidatedField
                label={translate('trickcodeApp.course.createdAt')}
                id="course-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('trickcodeApp.course.updatedAt')}
                id="course-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('trickcodeApp.course.publishedAt')}
                id="course-publishedAt"
                name="publishedAt"
                data-cy="publishedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="course-instructor"
                name="instructor"
                data-cy="instructor"
                label={translate('trickcodeApp.course.instructor')}
                type="select"
              >
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/course" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CourseUpdate;
