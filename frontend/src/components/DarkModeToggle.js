import React from "react";

import styles from "../styles/DarkModeToggle.module.css";

const DarkModeToggle = ({ handleChange, isChecked }) => {
  return (
    <div className={styles.ToggleContainer}>
      <input
        type="checkbox"
        id="check"
        className={styles.ToggleInput}
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check">Dark Mode</label>
    </div>
  );
};

export default DarkModeToggle;
