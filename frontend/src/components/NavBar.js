import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  return (
    <div>
      <Navbar className={styles.NavBar} expand="md" fixed="top">
        <Container>
          <Navbar.Brand className={styles.NavBarBrand} href="#home">
            TaskMaster
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto text-left">
              <Nav.Link className={styles.NavLink}>
                {" "}
                <i className="fas fa-home"></i>Home
              </Nav.Link>
              <Nav.Link className={styles.NavLink}>
                <i className="fas fa-sign-in-alt"></i>Sign in
              </Nav.Link>
              <Nav.Link className={styles.NavLink}>
                <i className="fas fa-user-plus"></i>Sign up
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
