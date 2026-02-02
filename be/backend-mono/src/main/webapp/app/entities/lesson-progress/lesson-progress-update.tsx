import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities as getLessons } from 'app/entities/lesson/lesson.reducer';
import { getEntities as getEnrollments } from 'app/entities/enrollment/enrollment.reducer';
import { createEntity, getEntity, reset, updateEntity } from './lesson-progress.reducer';

export const LessonProgressUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const lessons = useAppSelector(state => state.lesson.entities);
  const enrollments = useAppSelector(state => state.enrollment.entities);
  const lessonProgressEntity = useAppSelector(state => state.lessonProgress.entity);
  const loading = useAppSelector(state => state.lessonProgress.loading);
  const updating = useAppSelector(state => state.lessonProgress.updating);
  const updateSuccess = useAppSelector(state => state.lessonProgress.updateSuccess);

  const handleClose = () => {
    navigate('/lesson-progress');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
    dispatch(getLessons({}));
    dispatch(getEnrollments({}));
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
    values.completedAt = convertDateTimeToServer(values.completedAt);

    const entity = {
      ...lessonProgressEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user?.toString()),
      lesson: lessons.find(it => it.id.toString() === values.lesson?.toString()),
      enrollment: enrollments.find(it => it.id.toString() === values.enrollment?.toString()),
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
          completedAt: displayDefaultDateTime(),
        }
      : {
          ...lessonProgressEntity,
          completedAt: convertDateTimeFromServer(lessonProgressEntity.completedAt),
          user: lessonProgressEntity?.user?.id,
          lesson: lessonProgressEntity?.lesson?.id,
          enrollment: lessonProgressEntity?.enrollment?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="trickcodeApp.lessonProgress.home.createOrEditLabel" data-cy="LessonProgressCreateUpdateHeading">
            <Translate contentKey="trickcodeApp.lessonProgress.home.createOrEditLabel">Create or edit a LessonProgress</Translate>
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
                  id="lesson-progress-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('trickcodeApp.lessonProgress.completedAt')}
                id="lesson-progress-completedAt"
                name="completedAt"
                data-cy="completedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('trickcodeApp.lessonProgress.isCompleted')}
                id="lesson-progress-isCompleted"
                name="isCompleted"
                data-cy="isCompleted"
                check
                type="checkbox"
              />
              <ValidatedField
                id="lesson-progress-user"
                name="user"
                data-cy="user"
                label={translate('trickcodeApp.lessonProgress.user')}
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
              <ValidatedField
                id="lesson-progress-lesson"
                name="lesson"
                data-cy="lesson"
                label={translate('trickcodeApp.lessonProgress.lesson')}
                type="select"
              >
                <option value="" key="0" />
                {lessons
                  ? lessons.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="lesson-progress-enrollment"
                name="enrollment"
                data-cy="enrollment"
                label={translate('trickcodeApp.lessonProgress.enrollment')}
                type="select"
              >
                <option value="" key="0" />
                {enrollments
                  ? enrollments.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/lesson-progress" replace color="info">
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

export default LessonProgressUpdate;
