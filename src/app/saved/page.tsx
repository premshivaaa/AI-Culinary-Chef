"use client";

import styles from "../page.module.css";
import SavedRecipes from "../../components/SavedRecipes";

export default function SavedPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header} style={{ marginBottom: "0" }}>
          <h1 className={styles.title} style={{ fontSize: "2.5rem" }}>
            Saved Recipes
          </h1>
          <p className={styles.subtitle}>
            Your personal collection of culinary masterpieces.
          </p>
        </div>

        <div className={styles.contentArea}>
          <SavedRecipes />
        </div>
      </main>
    </div>
  );
}
