import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/NoteCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import Avatar from "../../components/Avatar";

import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import useAlert from "../../hooks/useAlert";

function NoteCreateForm(props) {
  const { task, setTask, setNotes, profileImage, profile_id, isDark } = props;

  const [content, setContent] = useState("");
  const { setAlert } = useAlert();
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/notes/", {
        content,
        task,
      });

      setNotes((prevNotes) => ({
        ...prevNotes,
        results: [data, ...prevNotes.results],
      }));
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            notes_count: prevTask.results[0].notes_count + 1,
          },
        ],
      }));
      setContent("");
      setAlert("Note created!", "success");
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="My Notes.."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${
          isDark ? btnStyles.ButtonDarkMode : btnStyles.Button
        } d-block ml-auto px-2`}
        disabled={!content.trim()}
        type="submit"
      >
        Post
      </button>
    </Form>
  );
}

export default NoteCreateForm;
