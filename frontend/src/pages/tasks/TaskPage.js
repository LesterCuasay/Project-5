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
import Asset from "../../components/Asset";

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

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
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      handleMount();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col lg={12}>
            {hasLoaded ? (
              <>
                <Container
                  className={`${appStyles.Container} ${appStyles.Content}`}
                >
                  <Task {...task.results[0]} setTasks={setTask} taskPage />
                  {currentUser ? (
                    <NoteCreateForm
                      profile_id={currentUser.profile_id}
                      profileImage={profile_image}
                      task={id}
                      setTask={setTask}
                      setNotes={setNotes}
                    />
                  ) : notes.results.length ? (
                    <h5>Notes</h5>
                  ) : null}
                  {notes.results.length ? (
                    notes.results.map((notes) => (
                      <Note
                        key={notes.id}
                        {...notes}
                        setTask={setTask}
                        setNotes={setNotes}
                      />
                    ))
                  ) : currentUser ? (
                    <span>No notes yet, be the first to comment!</span>
                  ) : (
                    <span>No notes... yet</span>
                  )}
                </Container>
              </>
            ) : (
              <Container>
                <Asset spinner />
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TaskPage;
