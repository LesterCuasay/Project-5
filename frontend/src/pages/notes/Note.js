import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Avatar from "../../components/Avatar";
import NoteEditForm from "./NoteEditForm";

import styles from "../../styles/Note.module.css";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

const Note = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setTask,
    setNotes,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/notes/${id}`);
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            notes_count: prevTask.results[0].notes_count - 1,
          },
        ],
      }));
      setNotes((prevNotes) => ({
        ...prevNotes,
        results: prevNotes.results.filter((note) => note.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <hr />
      <Row>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Col className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <NoteEditForm 
            id={id}
            profile_id={profile_id}
            content={content}
            profileImage={profile_image}
            setNotes={setNotes}
            setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Col>
        {is_owner && (
          <MoreDropdown handleEdit={() => setShowEditForm(true)} handleDelete={handleDelete} />
        )}
      </Row>
    </div>
  );
};

export default Note;
