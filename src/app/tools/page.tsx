"use client";

import styles from "../page.module.css";
import UtilityTools from "../../components/UtilityTools";

export default function ToolsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header} style={{ marginBottom: "0" }}>
          <h1 className={styles.title} style={{ fontSize: "2.5rem" }}>
            Utility Tools
          </h1>
          <p className={styles.subtitle}>
            Handy tools to help you substitute ingredients and convert measurements.
          </p>
        </div>

        <div className={styles.contentArea}>
          <UtilityTools />
        </div>
      </main>
    </div>
  );
}
