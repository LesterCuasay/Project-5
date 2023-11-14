import React, { useEffect, useRef, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import styles from "../../styles/TaskCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { useParams, useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";
import useAlert from "../../hooks/useAlert";

const ProfileEditForm = ({ isDark }) => {
  const [errors, setErrors] = useState({});
  const { setAlert } = useAlert();
  const [hasLoaded, setHasLoaded] = useState(false);

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
          setHasLoaded(true);
        } catch (err) {
          // console.log(err);
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      handleMount();
    }, 300);
    return () => {
      clearTimeout(timer);
    };
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
      setAlert("Profile Updated!", "success")
    } catch (err) {
      // console.log(err);
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
          className={`${
            isDark ? styles.InputDarkMode : styles.Input
          } text-left`}
        />
      </Form.Group>

      {errors?.content?.map((message, idx) => (
        <Alert className={appStyles.Alert} key={idx}>
          {message}
        </Alert>
      ))}
      <div className="mt-3">
        <Button
          onClick={() => history.goBack()}
          className={`${isDark ? btnStyles.ButtonDarkMode : btnStyles.Button}`}
        >
          Cancel
        </Button>
        <Button
          className={`${isDark ? btnStyles.ButtonDarkMode : btnStyles.Button}`}
          type="submit"
        >
          Save
        </Button>
      </div>
    </>
  );

  return (
    <Row className="justify-content-center">
      {hasLoaded ? (
        <Col
          className={`${
            isDark ? appStyles.ContentDarkMode : appStyles.Content
          } ${appStyles.Container} text-center`}
        >
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              {image && (
                <figure>
                  <Image src={image} fluid />{" "}
                </figure>
              )}

              {errors?.image?.map((message, idx) => (
                <Alert className={appStyles.Alert} key={idx}>
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
      ) : (
        <Asset spinner />
      )}
    </Row>
  );
};

export default ProfileEditForm;
