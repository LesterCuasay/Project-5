import React, { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import styles from "../../styles/TaskCreateEditForm.module.css"
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { axiosRes } from "../../api/axiosDefaults";
import { useHistory, useParams } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

const UsernameForm = ({ isDark }) => {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/");
    }
  }, [currentUser, history, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });

      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      history.goBack();
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col
          md={8}
          className={`${
            isDark ? appStyles.ContentDarkMode : appStyles.Content
          } ${appStyles.Container} text-center`}
        >
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>
                <h1>Change Username</h1>
                <div>
                  <p>
                    Hey {currentUser.username}! What do you want to change your
                    name to?
                  </p>
                </div>
              </Form.Label>
              <Form.Control
                className={`${isDark ? styles.InputDarkMode : styles.Input } mt-2`}
                placeholder="Username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div>
              <Button
                onClick={() => history.goBack()}
                className={`mt-3 ${
                  isDark ? btnStyles.ButtonDarkMode : btnStyles.Button
                }`}
              >
                Cancel
              </Button>
              <Button
                className={`mt-3 ${
                  isDark ? btnStyles.ButtonDarkMode : btnStyles.Button
                }`}
                type="submit"
              >
                Save
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UsernameForm;
