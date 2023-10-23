import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Task from "./Task";

import appStyles from "../../App.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";

function TasksPage({ message, filter = "" }) {
  const [tasks, setTasks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/?${filter}`);
        setTasks(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    fetchTasks();
  }, [filter, pathname]);
  return (
    <Container className={appStyles.Container}>
      <Row className="justify-content-center">
        <Col md={6}>
          {hasLoaded ? (
            <>
              {tasks.results.length ? (
                tasks.results.map((task) => (
                  <Task key={task.id} {...task} setPosts={setTasks} />
                ))
              ) : (
                <Container className="text-center">
                  <Asset src={NoResults} message={message} />
                </Container>
              )}
            </>
          ) : (
            <Container>
              <Asset spinner />
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default TasksPage;
