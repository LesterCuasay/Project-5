import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import appStyles from "../../App.module.css";
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
            <Form.Group className={styles.FormGroup} controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
              ></Form.Control>
            </Form.Group>
            <Form.Group
              className={styles.FormGroup}
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="password"
              ></Form.Control>
            </Form.Group>
            <Button className={styles.Submit}>Sign Up</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;
