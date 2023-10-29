import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import styles from "../../styles/NoteCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

const NoteEditForm = (props) => {
  const { id, content, setShowEditForm, setNotes, isDark } = props;

  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/notes/${id}/`, {
        content: formContent.trim(),
      });
      setNotes((prevNotes) => ({
        ...prevNotes,
        results: prevNotes.results.map((notes) => {
          return notes.id === id
            ? { ...notes, content: formContent.trim(), updated_at: "now" }
            : notes;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <Button
          className={`${isDark ? btnStyles.ButtonDarkMode : btnStyles.Button}`}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          Cancel
        </Button>
        <Button
          className={`${isDark ? btnStyles.ButtonDarkMode : btnStyles.Button}`}
          disabled={!content.trim()}
          type="submit"
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default NoteEditForm;
