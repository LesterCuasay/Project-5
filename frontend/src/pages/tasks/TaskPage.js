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

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [notes, setNotes] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: task }] = await Promise.all([
          axiosReq.get(`/tasks/${id}`),
        ]);
        setTask({ results: [task] });
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
        <Col md={8}>
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
        </Col>
      </Row>
    </Container>
  );
};

export default TaskPage;
