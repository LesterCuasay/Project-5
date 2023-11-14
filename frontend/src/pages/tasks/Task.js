import React from "react";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import styles from "../../styles/Task.module.css";

import Avatar from "../../components/Avatar";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import useAlert from "../../hooks/useAlert";

const Task = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    notes_count,
    favourite_id,
    favourites_count,
    task_name,
    task_description,
    due_date,
    status,
    updated_at,
    taskPage,
    setTasks,
    attachment,
    is_overdue,
    profilePage,
    isDark,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const fileName = attachment ? attachment.split("/").pop().split("_")[0] : "";
  const history = useHistory();
  const { setAlert } = useAlert();

  const statusOverride = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
  };

  const classOverride = taskPage && is_overdue && is_owner;

  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      history.goBack();
      setAlert("Task Deleted!", "danger");
    } catch (err) {
      // console.log(err);
    }
  };

  const formattedDueDate = new Date(due_date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleFavourite = async () => {
    try {
      const { data } = await axiosRes.post("/favourites/", { task: id });
      setTasks((prevTasks) => ({
        ...prevTasks,
        results: prevTasks.results.map((task) => {
          return task.id === id
            ? {
                ...task,
                favourites_count: task.favourites_count + 1,
                favourite_id: data.id,
              }
            : task;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnfavourite = async () => {
    try {
      await axiosRes.delete(`/favourites/${favourite_id}/`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        results: prevTasks.results.map((task) => {
          return task.id === id
            ? {
                ...task,
                favourites_count: task.favourites_count - 1,
                favourite_id: null,
              }
            : task;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <Card
      className={`mb-4 ${isDark ? styles.TaskDarkMode : styles.Task} ${
        taskPage && is_overdue && is_owner ? styles.OverdueTask : ""
      } ${profilePage && is_overdue && is_owner ? styles.OverdueTask : ""}`}
    >
      {taskPage && is_overdue && is_owner && (
        <h4 className="text-danger">This task is overdue!</h4>
      )}
      {profilePage && is_overdue && is_owner && (
        <h4 className="text-danger">This task is overdue!</h4>
      )}
      <Row className={`align-items-center ${styles.HeaderRow}`}>
        <Col xs={6} className={`d-flex ${styles.HeaderCol}`}>
          <Link to={`/profiles/${profile_id}`}>
            <div className="mb-2">
              <Avatar src={profile_image} height={55} />
            </div>
            <div className="mb-2">{owner}</div>
          </Link>
        </Col>
        <Col
          xs={6}
          className={`d-flex justify-content-sm-end ${styles.HeaderCol}`}
        >
          <span>{updated_at}</span>
          {is_owner && taskPage && (
            <MoreDropdown
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              overDueDropdown={`${classOverride ? styles.OverdueDropDown : ""}`}
            />
          )}
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="mb-2">
          <Link to={`/tasks/${id}`}>
            <Card.Title className="text-capitalize">
              <h3>{task_name}</h3>
            </Card.Title>
          </Link>
          {task_description && (
            <Card.Title className={styles.TaskDescription}>
              {task_description}
            </Card.Title>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="d-flex align-items-center justify-content-between">
          {due_date && (
            <Card.Title>
              <i className="fa-solid fa-calendar-days mr-2" />
              {formattedDueDate}
            </Card.Title>
          )}
          {attachment && (
            <Card.Title>
              <a href={attachment} target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-folder" />
                {fileName}
              </a>
            </Card.Title>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="d-flex align-items-center justify-content-between">
          {status && (
            <Card.Title>
              <i className="fa-solid fa-bars-progress" />
              {statusOverride[status]}
            </Card.Title>
          )}

          <div className={`${styles.Stars} mr-2`}>
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>You can&#39;t favourite your own task!</Tooltip>
                }
                animation={null}
                transition={false}
              >
                <i className="fa-regular fa-star"></i>
              </OverlayTrigger>
            ) : favourite_id ? (
              <span onClick={handleUnfavourite}>
                <i className={`fa-solid fa-star ${styles.Star}`}></i>
              </span>
            ) : currentUser ? (
              <span onClick={handleFavourite}>
                <i className={`fa-regular fa-star ${styles.StarOutline}`}></i>
              </span>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to favourite tasks!</Tooltip>}
                animation={null}
                transition={false}
              >
                <i className="fa-regular fa-star"></i>
              </OverlayTrigger>
            )}
            {favourites_count}
            <Link to={`/tasks/${id}`}>
              <i className={`fa-regular fa-comments ml-3 ${styles.Stars}`}></i>
            </Link>
            {notes_count}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Task;
