import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css"
import styles from "../../styles/SignInUpForm.module.css";

const SignUpForm = () => {
  return (
    <Container className={styles.Container}>
      <Row className="justify-content-center">
        <Col md={6} className={appStyles.Content}>
          <div className={styles.TitleWrapper}>
            <h1 className={styles.FormTitle}>Sign Up</h1>
          </div>
          <Form>
            <Form.Group className={styles.FormGroup} controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
              ></Form.Control>
            </Form.Group>
            <Form.Group className={styles.FormGroup} controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
              ></Form.Control>
            </Form.Group>
            <Form.Group className={styles.FormGroup} controlId="password2">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm Password"
                name="password2"
              ></Form.Control>
            </Form.Group>
            <Button className={`${btnStyles.Wide} ${btnStyles.Button}`}>Sign Up</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;
