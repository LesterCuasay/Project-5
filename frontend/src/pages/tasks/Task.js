import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import styles from "../../styles/Task.module.css";

import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

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
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`)
      history.goBack()
    } catch (err) {
      console.log(err);
    }
  }
  
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
      console.log(err);
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
      console.log(err);
    }
  };

  return (
    <Card className={`mb-4 ${styles.Task}`}>
      <Card.Body>
        <Row>
          <Col xs={6}>
            <Link
              className="d-flex justify-content-start align-items-center"
              to={`/profiles/${profile_id}`}
            >
              <Avatar src={profile_image} height={55} />
              {owner}
            </Link>
          </Col>
          <Col xs={6} className="d-flex justify-content-end align-items-center">
            <span>{updated_at}</span>
            {is_owner && taskPage && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />}
          </Col>
        </Row>
      </Card.Body>
      <Row>
        <Col xs={6}>
          <Link to={`tasks/${id}`}>
            <div className="text-left ml-5">{task_name}</div>
          </Link>
          {task_description && (
            <Card.Title className="text-left text-muted ml-5">
              {task_description}
            </Card.Title>
          )}
        </Col>
        <Col xs={6}>
          {due_date && (
            <Card.Title className="text-right mr-5">
              {formattedDueDate}
            </Card.Title>
          )}
          {status && (
            <Card.Title className="text-right mr-5">{status}</Card.Title>
          )}
        </Col>
      </Row>

      <Card.Body>
        <div>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't favourite your own task!</Tooltip>}
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
            <i className="fa-regular fa-comments"></i>
          </Link>
          {notes_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Task;
