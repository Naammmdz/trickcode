import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './lesson.reducer';

export const Lesson = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const lessonList = useAppSelector(state => state.lesson.entities);
  const loading = useAppSelector(state => state.lesson.loading);
  const totalItems = useAppSelector(state => state.lesson.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="lesson-heading" data-cy="LessonHeading">
        <Translate contentKey="trickcodeApp.lesson.home.title">Lessons</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="trickcodeApp.lesson.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/lesson/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="trickcodeApp.lesson.home.createLabel">Create new Lesson</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {lessonList && lessonList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="trickcodeApp.lesson.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('title')}>
                  <Translate contentKey="trickcodeApp.lesson.title">Title</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('title')} />
                </th>
                <th className="hand" onClick={sort('type')}>
                  <Translate contentKey="trickcodeApp.lesson.type">Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('type')} />
                </th>
                <th className="hand" onClick={sort('orderIndex')}>
                  <Translate contentKey="trickcodeApp.lesson.orderIndex">Order Index</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('orderIndex')} />
                </th>
                <th className="hand" onClick={sort('durationSeconds')}>
                  <Translate contentKey="trickcodeApp.lesson.durationSeconds">Duration Seconds</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('durationSeconds')} />
                </th>
                <th className="hand" onClick={sort('isPreview')}>
                  <Translate contentKey="trickcodeApp.lesson.isPreview">Is Preview</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isPreview')} />
                </th>
                <th className="hand" onClick={sort('videoUrl')}>
                  <Translate contentKey="trickcodeApp.lesson.videoUrl">Video Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('videoUrl')} />
                </th>
                <th className="hand" onClick={sort('captionUrl')}>
                  <Translate contentKey="trickcodeApp.lesson.captionUrl">Caption Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('captionUrl')} />
                </th>
                <th className="hand" onClick={sort('markdownContent')}>
                  <Translate contentKey="trickcodeApp.lesson.markdownContent">Markdown Content</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('markdownContent')} />
                </th>
                <th className="hand" onClick={sort('quizConfig')}>
                  <Translate contentKey="trickcodeApp.lesson.quizConfig">Quiz Config</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('quizConfig')} />
                </th>
                <th className="hand" onClick={sort('codeChallengeConfig')}>
                  <Translate contentKey="trickcodeApp.lesson.codeChallengeConfig">Code Challenge Config</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('codeChallengeConfig')} />
                </th>
                <th>
                  <Translate contentKey="trickcodeApp.lesson.section">Section</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lessonList.map((lesson, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/lesson/${lesson.id}`} color="link" size="sm">
                      {lesson.id}
                    </Button>
                  </td>
                  <td>{lesson.title}</td>
                  <td>
                    <Translate contentKey={`trickcodeApp.LessonType.${lesson.type}`} />
                  </td>
                  <td>{lesson.orderIndex}</td>
                  <td>{lesson.durationSeconds}</td>
                  <td>{lesson.isPreview ? 'true' : 'false'}</td>
                  <td>{lesson.videoUrl}</td>
                  <td>{lesson.captionUrl}</td>
                  <td>{lesson.markdownContent}</td>
                  <td>{lesson.quizConfig}</td>
                  <td>{lesson.codeChallengeConfig}</td>
                  <td>{lesson.section ? <Link to={`/section/${lesson.section.id}`}>{lesson.section.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/lesson/${lesson.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/lesson/${lesson.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        onClick={() =>
                          (window.location.href = `/lesson/${lesson.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
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
              <Translate contentKey="trickcodeApp.lesson.home.notFound">No Lessons found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={lessonList && lessonList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Lesson;
