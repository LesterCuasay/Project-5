import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.Footer} mt-5`}>
      <Container className="d-flex justify-content-center text-center">
        <Row>
          <Col>
            <div className="mt-3">
              Developed by &copy;{" "}
              <a
                className="font-italic"
                href="https://github.com/LesterCuasay?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lester Cuasay 2023
              </a>
            </div>
            <div className="mb-1">
              <a
                className=" btn-floating m-1"
                href="https://github.com/LesterCuasay?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                className="btn btn-floating m-1"
                href="https://www.linkedin.com/in/lester-cuasay/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
