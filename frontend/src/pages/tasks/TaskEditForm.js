import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/TaskCreateEditForm.module.css";
import assetStyles from "../../styles/Asset.module.css";

import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import useAlert from "../../hooks/useAlert";

function TaskEditForm({ isDark }) {
  const [errors, setErrors] = useState();
  const [hasLoaded, setHasLoaded] = useState(false);
  const { setAlert } = useAlert();

  const today = new Date().toISOString().substr(0, 10);

  const [taskData, setTaskData] = useState({
    task_name: "",
    task_description: "",
    status: "",
    due_date: today,
    attachment: "",
  });

  const { task_name, task_description, status, due_date, attachment } =
    taskData;

  const history = useHistory();
  const { id } = useParams();
  const fileInput = useRef(null);

  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}/`);
        const {
          task_name,
          task_description,
          status,
          due_date,
          attachment,
          is_owner,
        } = data;

        const fileName = attachment ? attachment.split("/").pop() : "";

        setTaskData({
          task_name,
          task_description,
          status,
          due_date,
          attachment,
        });
        setFileName(fileName);

        is_owner
          ? setTaskData({
              task_name,
              task_description,
              status,
              due_date,
              attachment,
            })
          : history.push(`/`);
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
  }, [history, id]);

  const handleChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeFile = (event) => {
    if (event.target.files.length) {
      const selectedFile = event.target.files[0];
      const fileName = selectedFile.name;
      URL.revokeObjectURL(attachment);
      setTaskData({
        ...taskData,
        attachment: URL.createObjectURL(selectedFile),
      });
      setFileName(fileName);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("task_name", task_name);
    formData.append("task_description", task_description);
    formData.append("status", status);
    formData.append("due_date", due_date);

    if (fileInput?.current?.files[0]) {
      formData.append("attachment", fileInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/tasks/${id}/`, formData);
      history.push(`/tasks/${id}`);
      setAlert("Task Updated!", "success");
    } catch (err) {
      // console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div>
      <Form.Group className="mt-3">
        <Form.Label className="mt-2">Task Name</Form.Label>
        <Form.Control
          type="text"
          name="task_name"
          className={`${isDark ? styles.InputDarkMode : styles.Input}`}
          value={task_name}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.task_name?.map((message, idx) => (
        <Alert className={appStyles.Alert} key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group className="mt-3">
        <Form.Label>Task Description (optional)</Form.Label>
        <Form.Control
          type="text"
          name="task_description"
          className={`${isDark ? styles.InputDarkMode : styles.Input}`}
          value={task_description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.task_description?.map((message, idx) => (
        <Alert className={appStyles.Alert} key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group className="mt-3">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          name="due_date"
          className={`${isDark ? styles.InputDarkMode : styles.Input}`}
          value={due_date}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.due_date?.map((message, idx) => (
        <Alert className={appStyles.Alert} key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group className="mt-3">
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          name="status"
          className={`${isDark ? styles.InputDarkMode : styles.Input}`}
          value={status}
          onChange={handleChange}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </Form.Control>
      </Form.Group>
      {errors?.status?.map((message, idx) => (
        <Alert className={appStyles.Alert} key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group className="mt-3">
        {attachment ? (
          <>
            <figure>
              <div className={assetStyles.Asset}>
                <i className="mt-3 fa-solid fa-file-arrow-up"></i>
                <p>Selected File: {fileName}</p>
              </div>
            </figure>
            <div>
              <Form.Label
                className={`${
                  isDark ? btnStyles.ButtonDarkMode : btnStyles.Button
                } ${btnStyles.Wide} mt-2`}
                htmlFor="file-upload"
              >
                Change File
              </Form.Label>
            </div>
          </>
        ) : (
          <Form.Label htmlFor="file-upload">
            <Asset src={Upload} message="Click or Tap here to upload a file" />
          </Form.Label>
        )}
        <Form.Control
          className="d-none"
          type="file"
          name="attachment"
          accept=".docx, .pdf"
          id="file-upload"
          onChange={handleChangeFile}
          ref={fileInput}
        />
      </Form.Group>
      <Button
        className={`${isDark ? btnStyles.ButtonDarkMode : btnStyles.Button} ${
          btnStyles.Wide
        } mt-2`}
        onClick={() => history.goBack()}
        type="submit"
      >
        Cancel
      </Button>
      <Button
        className={`${isDark ? btnStyles.ButtonDarkMode : btnStyles.Button} ${
          btnStyles.Wide
        } mt-2`}
        type="submit"
      >
        Create
      </Button>
    </div>
  );
  return (
    <Container className={appStyles.Container}>
      <Row className="justify-content-center">
        {hasLoaded ? (
          <Col
            md={8}
            className={`mb-5 ${
              isDark ? appStyles.ContentDarkMode : appStyles.Content
            }`}
          >
            <h1 className={styles.Header}>Edit Task</h1>
            <Form className="text-center" onSubmit={handleSubmit}>
              {textFields}
            </Form>
          </Col>
        ) : (
          <Asset spinner />
        )}
      </Row>
    </Container>
  );
}

export default TaskEditForm;
