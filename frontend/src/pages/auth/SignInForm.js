import axios from "axios";

import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Link, useHistory } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";
import useAlert from "../../hooks/useAlert";

const SignInForm = ({ isDark }) => {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const { setAlert } = useAlert();

  const history = useHistory();

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      history.goBack();
      setAlert(`${username} you logged in successfully!`, "success");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <>
      <Container className={`mt-5 ${styles.Container}`}>
        <Row className="justify-content-center">
          <Col
            lg={6}
            md={8}
            className={`${
              isDark ? appStyles.ContentDarkMode : appStyles.Content
            }`}
          >
            <div className={styles.TitleWrapper}>
              <h1 className={styles.FormTitle}>Sign In</h1>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={`${isDark ? styles.InputDarkMode : styles.Input}`}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              {errors.username?.map((message, idx) => (
                <Alert className={appStyles.Alert} key={idx}>
                  {message}
                </Alert>
              ))}

              <Form.Group controlId="password" className="mt-3">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={`${isDark ? styles.InputDarkMode : styles.Input}`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              {errors.password?.map((message, idx) => (
                <Alert key={idx} className={appStyles.Alert}>
                  {message}
                </Alert>
              ))}

              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} className={`mt-3 ${appStyles.Alert}`}>
                  {message}
                </Alert>
              ))}

              <Button
                className={`mt-3 ${btnStyles.Wide} ${
                  isDark ? btnStyles.ButtonDarkMode : btnStyles.Button
                } `}
                type="submit"
              >
                Sign In
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-center">
          <Col
            lg={6}
            md={8}
            className={`p-0 mt-3 ${
              isDark ? appStyles.ContentDarkMode : appStyles.Content
            }`}
          >
            <Link className={styles.Link} to="/signup">
              Don&#39;t have an account? <span>Sign up now!</span>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignInForm;
