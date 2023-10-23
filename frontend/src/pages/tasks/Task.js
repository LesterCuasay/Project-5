import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

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
    attachment,
    updated_at,
    taskPage,
    setTasks,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

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
    <Card>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && taskPage && "..."}
          </div>
        </Media>
      </Card.Body>
      <Link to={`tasks/${id}`}>
        <div className="text-center">{task_name}</div>
      </Link>
      <Card.Body>
        {task_name && (
          <Card.Title className="text-center">{task_name}</Card.Title>
        )}
        {task_description && (
          <Card.Title className="text-center">{task_description}</Card.Title>
        )}
        {due_date && (
          <Card.Title className="text-center">{due_date}</Card.Title>
        )}
        {status && <Card.Title className="text-center">{status}</Card.Title>}
        <div>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't favourite your own task!</Tooltip>}
            >
              <i className="fa-regular fa-star"></i>
            </OverlayTrigger>
          ) : favourite_id ? (
            <span onClick={handleUnfavourite}>
              <i className="fa-solid fa-star"></i>
            </span>
          ) : currentUser ? (
            <span onClick={handleFavourite}>
              <i className="fa-regular fa-star"></i>
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to favourite tasks!</Tooltip>}
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
