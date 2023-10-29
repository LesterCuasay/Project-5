import axios from "axios";
import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/SignInUpForm.module.css";

import { Link, useHistory } from "react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";

const SignUpForm = ({ isDark }) => {
  useRedirect("loggedIn");
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin");
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
              <h1 className={styles.FormTitle}>Sign Up</h1>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              {errors.username?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              <Form.Group controlId="password1" className="mt-3">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              {errors.password1?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              <Form.Group controlId="password2" className="mt-3">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              {errors.password2?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}

              <Button
                className={`mt-3 ${btnStyles.Wide} ${
                  isDark ? btnStyles.ButtonDarkMode : btnStyles.Button
                }`}
                type="submit"
              >
                Sign Up
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
            <Link className={styles.Link} to="/signin">
              Already have an account? <span>Sign in here!</span>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUpForm;
