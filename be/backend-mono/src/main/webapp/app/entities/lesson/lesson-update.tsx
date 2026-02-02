import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getSections } from 'app/entities/section/section.reducer';
import { LessonType } from 'app/shared/model/enumerations/lesson-type.model';
import { createEntity, getEntity, reset, updateEntity } from './lesson.reducer';

export const LessonUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const sections = useAppSelector(state => state.section.entities);
  const lessonEntity = useAppSelector(state => state.lesson.entity);
  const loading = useAppSelector(state => state.lesson.loading);
  const updating = useAppSelector(state => state.lesson.updating);
  const updateSuccess = useAppSelector(state => state.lesson.updateSuccess);
  const lessonTypeValues = Object.keys(LessonType);

  const handleClose = () => {
    navigate(`/lesson${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getSections({}));
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
    if (values.orderIndex !== undefined && typeof values.orderIndex !== 'number') {
      values.orderIndex = Number(values.orderIndex);
    }
    if (values.durationSeconds !== undefined && typeof values.durationSeconds !== 'number') {
      values.durationSeconds = Number(values.durationSeconds);
    }

    const entity = {
      ...lessonEntity,
      ...values,
      section: sections.find(it => it.id.toString() === values.section?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          type: 'VIDEO',
          ...lessonEntity,
          section: lessonEntity?.section?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="trickcodeApp.lesson.home.createOrEditLabel" data-cy="LessonCreateUpdateHeading">
            <Translate contentKey="trickcodeApp.lesson.home.createOrEditLabel">Create or edit a Lesson</Translate>
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
                  id="lesson-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('trickcodeApp.lesson.title')}
                id="lesson-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField label={translate('trickcodeApp.lesson.type')} id="lesson-type" name="type" data-cy="type" type="select">
                {lessonTypeValues.map(lessonType => (
                  <option value={lessonType} key={lessonType}>
                    {translate(`trickcodeApp.LessonType.${lessonType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('trickcodeApp.lesson.orderIndex')}
                id="lesson-orderIndex"
                name="orderIndex"
                data-cy="orderIndex"
                type="text"
              />
              <ValidatedField
                label={translate('trickcodeApp.lesson.durationSeconds')}
                id="lesson-durationSeconds"
                name="durationSeconds"
                data-cy="durationSeconds"
                type="text"
              />
              <ValidatedField
                label={translate('trickcodeApp.lesson.isPreview')}
                id="lesson-isPreview"
                name="isPreview"
                data-cy="isPreview"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('trickcodeApp.lesson.videoUrl')}
                id="lesson-videoUrl"
                name="videoUrl"
                data-cy="videoUrl"
                type="text"
              />
              <ValidatedField
                label={translate('trickcodeApp.lesson.captionUrl')}
                id="lesson-captionUrl"
                name="captionUrl"
                data-cy="captionUrl"
                type="text"
              />
              <ValidatedField
                label={translate('trickcodeApp.lesson.markdownContent')}
                id="lesson-markdownContent"
                name="markdownContent"
                data-cy="markdownContent"
                type="textarea"
              />
              <ValidatedField
                label={translate('trickcodeApp.lesson.quizConfig')}
                id="lesson-quizConfig"
                name="quizConfig"
                data-cy="quizConfig"
                type="textarea"
              />
              <ValidatedField
                label={translate('trickcodeApp.lesson.codeChallengeConfig')}
                id="lesson-codeChallengeConfig"
                name="codeChallengeConfig"
                data-cy="codeChallengeConfig"
                type="textarea"
              />
              <ValidatedField
                id="lesson-section"
                name="section"
                data-cy="section"
                label={translate('trickcodeApp.lesson.section')}
                type="select"
              >
                <option value="" key="0" />
                {sections
                  ? sections.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/lesson" replace color="info">
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

export default LessonUpdate;
