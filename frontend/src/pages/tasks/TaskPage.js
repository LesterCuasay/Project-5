import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InfiniteScroll from "react-infinite-scroll-component";

import appStyles from "../../App.module.css";

import Task from "./Task";
import NoteCreateForm from "../notes/NoteCreateForm";
import Note from "../notes/Note";
import Asset from "../../components/Asset";
import PopularProfiles from "../profiles/PopularProfiles";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { fetchMoreData } from "../../utils/utils";

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
          axiosReq.get(`/notes/?task=${id}`),
        ]);
        setTask({ results: [task] });
        setNotes(notes);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
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
      <Row className="justify-content-center">
        <Col lg={8} className={appStyles.Container}>
          <PopularProfiles mobile />
          {hasLoaded ? (
            <>
              <Task {...task.results[0]} setTasks={setTask} taskPage />

              {currentUser && (
                <Container className={appStyles.Content}>
                  <NoteCreateForm
                    profile_id={currentUser.profile_id}
                    profileImage={profile_image}
                    task={id}
                    setTask={setTask}
                    setNotes={setNotes}
                  />
                </Container>
              )}

              <Container
                className={`${appStyles.Container} ${appStyles.Content}`}
              >
                {notes.results.length > 0 ? (
                  <>
                    <h5 className="text-center">Notes</h5>
                    <InfiniteScroll
                      className="overflow-hidden p-2"
                      children={notes.results.map((notes) => (
                        <Note
                          key={notes.id}
                          {...notes}
                          setTask={setTask}
                          setNotes={setNotes}
                        />
                      ))}
                      dataLength={notes.results.length}
                      loader={<Asset spinner />}
                      hasMore={!!notes.next}
                      next={() => fetchMoreData(notes, setNotes)}
                    />
                  </>
                ) : currentUser ? (
                  <p className="text-center m-0">
                    No notes yet, be the first to comment!
                  </p>
                ) : (
                  <p className="text-center m-0">No notes... yet</p>
                )}
              </Container>
            </>
          ) : (
            <Container>
              <Asset spinner />
            </Container>
          )}
        </Col>
        <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
          <PopularProfiles />
        </Col>
      </Row>
    </>
  );
};

export default TaskPage;
