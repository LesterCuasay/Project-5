import React, { useEffect, useRef, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { useParams, useHistory } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import { Image } from "react-bootstrap";

const ProfileEditForm = () => {
  const [errors, setErrors] = useState({});

  const history = useHistory();
  const { id } = useParams();
  const imageFile = useRef();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const [profileData, setProfileData] = useState({
    name: "",
    image: "",
    content: "",
  });

  const { name, image, content } = profileData;

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { name, image, content } = data;
          setProfileData({ name, image, content });
        } catch (err) {
          console.log(err);
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();
  }, [currentUser, history, id]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label className="mt-3">Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={content}
          onChange={handleChange}
          name="content"
          rows={7}
        />
      </Form.Group>

      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <div className="mt-3">
        <Button onClick={() => history.goBack()} className={btnStyles.Button}>
          Cancel
        </Button>
        <Button className={btnStyles.Button} type="submit">
          Save
        </Button>
      </div>
    </>
  );

  return (
    <Container
      className={`${appStyles.Content} ${appStyles.Container} text-center`}
    >
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              {image && (
                <figure>
                  <Image src={image} fluid />{" "}
                </figure>
              )}

              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} mb-2`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.Control
                className="d-none"
                id="image-upload"
                type="file"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
            <Col className="d-none d-md-block text-center">
              <Container>{textFields}</Container>
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileEditForm;
