"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import StepByStepMode from "./StepByStepMode";

interface RecipeDisplayProps {
  recipe: string;
  isLoading: boolean;
}

interface SavedRecipe {
  title: string;
  content: string;
  date: string;
}

export default function RecipeDisplay({ recipe, isLoading }: RecipeDisplayProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showStepByStep, setShowStepByStep] = useState(false);

  if (isLoading) {
    return (
      <div className={`glass-panel ${styles.recipeContainer} ${styles.loadingState}`}>
        <div className={styles.spinner}></div>
        <p>The AI Chef is cooking up something special...</p>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(recipe);
    alert("Recipe copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Culinary Chef Recipe",
          text: recipe,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("Web Share API is not supported in this browser.");
    }
  };

  const handleSave = () => {
    const saved = localStorage.getItem("savedRecipes");
    const parsed: SavedRecipe[] = saved ? JSON.parse(saved) : [];
    const title =
      recipe
        .split("\n")
        .find((line) => line.startsWith("# "))
        ?.replace("# ", "") || "My Saved Recipe";

    const newRecipe: SavedRecipe = {
      title,
      content: recipe,
      date: new Date().toISOString(),
    };

    localStorage.setItem("savedRecipes", JSON.stringify([...parsed, newRecipe]));
    setIsSaved(true);
    alert("Recipe saved!");
  };

  const formatRecipe = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("## ")) {
        return <h2 key={index}>{line.replace("## ", "")}</h2>;
      }

      if (line.startsWith("# ")) {
        return <h1 key={index}>{line.replace("# ", "")}</h1>;
      }

      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={index}>{line.replace(/\*\*/g, "")}</h3>;
      }

      if (line.startsWith("* ")) {
        return <li key={index}>{line.replace("* ", "")}</li>;
      }

      if (line.startsWith("- ")) {
        return <li key={index}>{line.replace("- ", "")}</li>;
      }

      if (line.trim() === "") {
        return <br key={index} />;
      }

      const parts = line.split("**");
      if (parts.length > 1) {
        return (
          <p key={index}>
            {parts.map((part, partIndex) =>
              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
            )}
          </p>
        );
      }

      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className={`glass-panel ${styles.recipeContainer}`}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button className="btn" onClick={handleSave} disabled={isSaved}>
          {isSaved ? "Saved ✔" : "Save Recipe"}
        </button>
        <button className="btn" onClick={handleCopy}>
          Copy Text
        </button>
        <button className="btn" onClick={handleShare}>
          Share
        </button>
        <button className="btn btn-primary" onClick={() => setShowStepByStep(true)}>
          Start Cooking (Step-by-Step)
        </button>
      </div>

      <div className={styles.recipeContent}>{formatRecipe(recipe)}</div>

      {showStepByStep && (
        <StepByStepMode recipe={recipe} onClose={() => setShowStepByStep(false)} />
      )}
    </div>
  );
}
