import React from "react";
import styles from "./typewriter-loader.module.css";

const TypewriterLoader = () => {
  return (
    <div className={styles.typewriter}>
      <div className={styles.slide}><i></i></div>
      <div className={styles.paper}></div>
      <div className={styles.keyboard}></div>
    </div>
  );
}

export { TypewriterLoader }