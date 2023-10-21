import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

const Task = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    notes_count,
    task_name,
    task_description,
    due_date,
    status,
    attachment,
    updated_at,
    taskPage,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
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
            {is_owner && taskPage && '...'}
          </div>
        </Media>
      </Card.Body>
      <Link to={`tasks/${id}`}>
        <div className="text-center">{task_name}</div>
      </Link>
      <Card.Body>
        {task_name && <Card.Title className="text-center">{task_name}</Card.Title>}
        {task_description && <Card.Title className="text-center">{task_description}</Card.Title>}
        {due_date && <Card.Title className="text-center">{due_date}</Card.Title>}
        {status && <Card.Title className="text-center">{status}</Card.Title>}
        <div>
            
        </div>
      </Card.Body>
    </Card>
  );
};

export default Task;
