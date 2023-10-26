import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const UserPasswordForm = () => {
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;

  const history = useHistory();
  const { id } = useParams();

  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      history.push("/");
    }
  }, [currentUser, history, id]);

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
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
          className={`${appStyles.Content} ${appStyles.Container} text-center`}
        >
          <Form onSubmit={handleSubmit}>
            <h1>Change Password</h1>
            <div>
              <p>
                Hey {currentUser.username}! What do you want to change your
                password to?
              </p>
            </div>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                className="mt-2 text-center"
                type="password"
                value={new_password1}
                onChange={handleChange}
                name="new_password1"
              />
            </Form.Group>

            {errors?.new_password1?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group className="mt-2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                className="text-center"
                type="password"
                value={new_password2}
                onChange={handleChange}
                name="new_password2"
              />
            </Form.Group>

            {errors?.new_password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div>
              <Button
                onClick={() => history.goBack()}
                className={`mt-3 ${btnStyles.Button}`}
              >
                Cancel
              </Button>
              <Button className={`mt-3 ${btnStyles.Button}`} type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default UserPasswordForm;
