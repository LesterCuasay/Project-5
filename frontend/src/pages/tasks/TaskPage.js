import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import appStyles from "../../App.module.css";

import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Task from "./Task";
import NoteCreateForm from "../notes/NoteCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Note from "../notes/Note";

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [notes, setNotes] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: task }, { data: notes }] = await Promise.all([
          axiosReq.get(`/tasks/${id}`),
          axiosReq.get(`/notes/?tasks/${id}`),
        ]);
        setTask({ results: [task] });
        setNotes(notes);
        console.log(task);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Container className={appStyles.Container}>
      <Row className="justify-content-center">
        <Col md={8}>
          <Task {...task.results[0]} setTasks={setTask} taskPage />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} className={appStyles.Content}>
          {currentUser ? (
            <NoteCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              task={id}
              setTask={setTask}
              setNotes={setNotes}
            />
          ) : notes.results.length ? (
            "Notes"
          ) : null}
          {notes.results.length ? (
            notes.results.map(notes => (
              <Note key={notes.id} {...notes} />
            ))
          ) : currentUser ?(
            <span>No notes yet, be the first one to add a note!</span>
          ) : (
            <span>No notes...yet</span>
          )}
        </Col>
        
      </Row>
    </Container>
  );
};

export default TaskPage;
