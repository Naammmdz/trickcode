import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { TextFormat, Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './lesson-progress.reducer';

export const LessonProgress = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const lessonProgressList = useAppSelector(state => state.lessonProgress.entities);
  const loading = useAppSelector(state => state.lessonProgress.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="lesson-progress-heading" data-cy="LessonProgressHeading">
        <Translate contentKey="trickcodeApp.lessonProgress.home.title">Lesson Progresses</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="trickcodeApp.lessonProgress.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/lesson-progress/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="trickcodeApp.lessonProgress.home.createLabel">Create new Lesson Progress</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {lessonProgressList && lessonProgressList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="trickcodeApp.lessonProgress.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('completedAt')}>
                  <Translate contentKey="trickcodeApp.lessonProgress.completedAt">Completed At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('completedAt')} />
                </th>
                <th className="hand" onClick={sort('isCompleted')}>
                  <Translate contentKey="trickcodeApp.lessonProgress.isCompleted">Is Completed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isCompleted')} />
                </th>
                <th>
                  <Translate contentKey="trickcodeApp.lessonProgress.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="trickcodeApp.lessonProgress.lesson">Lesson</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="trickcodeApp.lessonProgress.enrollment">Enrollment</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lessonProgressList.map((lessonProgress, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/lesson-progress/${lessonProgress.id}`} color="link" size="sm">
                      {lessonProgress.id}
                    </Button>
                  </td>
                  <td>
                    {lessonProgress.completedAt ? (
                      <TextFormat type="date" value={lessonProgress.completedAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{lessonProgress.isCompleted ? 'true' : 'false'}</td>
                  <td>{lessonProgress.user ? lessonProgress.user.login : ''}</td>
                  <td>{lessonProgress.lesson ? <Link to={`/lesson/${lessonProgress.lesson.id}`}>{lessonProgress.lesson.id}</Link> : ''}</td>
                  <td>
                    {lessonProgress.enrollment ? (
                      <Link to={`/enrollment/${lessonProgress.enrollment.id}`}>{lessonProgress.enrollment.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/lesson-progress/${lessonProgress.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/lesson-progress/${lessonProgress.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/lesson-progress/${lessonProgress.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="trickcodeApp.lessonProgress.home.notFound">No Lesson Progresses found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LessonProgress;
