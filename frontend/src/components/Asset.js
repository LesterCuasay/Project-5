import React from "react";
import styles from "../styles/Asset.module.css";

const Asset = ({ message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
        <i className="fa-solid fa-upload"></i>
        {message && <p className="mt-4">{message}</p>}
    </div>
  )
};

export default Asset;
