import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: task }] = await Promise.all([
          axiosReq.get(`/tasks/${id}`),
        ]);
        setTask({ results: [task] });
        console.log(task)
      } catch (err) {
        console.log(err);
      }
    };
    handleMount()
  }, [id]);

  return (
    <Container className={appStyles.Container}>
      <Row className="justify-content-center">
        <Col md={6} className={appStyles.Content}>
          Tasks
        </Col>
      </Row>
    </Container>
  );
};

export default TaskPage;
