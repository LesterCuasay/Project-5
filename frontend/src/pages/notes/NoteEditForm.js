import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import styles from "../../styles/NoteCreateEditForm.module.css";

import { axiosRes } from "../../api/axiosDefaults";

const NoteEditForm = (props) => {
  const { id, content, setShowEditForm, setNotes } = props;

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
      console.log(err);
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
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          Cancel
        </button>
        <button
          className={styles.Button}
          disabled={!content.trim()}
          type="submit"
        >
          Save
        </button>
      </div>
    </Form>
  );
};

export default NoteEditForm;
