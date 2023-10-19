import React, { useState } from "react";
import { useHistory } from "react-router";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/TaskCreateEditForm.module.css";

import { axiosReq } from "../../api/axiosDefaults";

function TaskCreateForm() {
  const [errors, setErrors] = useState();

  const today = new Date().toISOString().substr(0, 10);

  const [taskData, setTaskData] = useState({
    task_name: "",
    task_description: "",
    status: "",
    due_date: today,
  });

  const { task_name, task_description, status, due_date } = taskData;

  const history = useHistory();

  const handleChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("task_name", task_name);
    formData.append("task_description", task_description);
    formData.append("status", status);
    formData.append("due_date", due_date);

    try {
      const { data } = await axiosReq.post("/tasks/", formData);
      history.push(`/tasks/${data.id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div>
      <Form.Group>
        <Form.Label className="mt-2">Task Name</Form.Label>
        <Form.Control
          type="text"
          name="task_name"
          className={styles.Input}
          value={task_name}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.task_name?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Task Description</Form.Label>
        <Form.Control
          type="text"
          name="task_description"
          className={styles.Input}
          value={task_description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.task_description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          name="due_date"
          className={styles.Input}
          value={due_date}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.due_date?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          name="status"
          className={styles.Input}
          value={status}
          onChange={handleChange}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </Form.Control>
      </Form.Group>
      {errors?.status?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button className={`${btnStyles.Button} ${btnStyles.Wide} mt-2`} type="submit">
        Create
      </Button>
    </div>
  );
  return (
    <Container className={appStyles.Container}>
      <Row className="justify-content-center">
        <Col md={6} className={appStyles.Content}>
          <h1 className={styles.Header}>Create Task</h1>
          <Form onSubmit={handleSubmit}>{textFields}</Form>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskCreateForm;
