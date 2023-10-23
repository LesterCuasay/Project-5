import React from 'react'

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import appStyles from "../../App.module.css";

const TasksPage = () => {
  return (
    <Container className={appStyles.Container}>
      <Row className="justify-content-center">
        <Col md={6}>
        </Col>
      </Row>
    </Container>
  )
}

export default TasksPage