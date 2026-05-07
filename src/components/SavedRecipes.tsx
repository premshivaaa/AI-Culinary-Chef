"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import RecipeDisplay from "./RecipeDisplay";

interface SavedRecipe {
  title: string;
  content: string;
  date: string;
}

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const saved = localStorage.getItem("savedRecipes");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const handleDelete = (index: number) => {
    const recipeToDelete = savedRecipes[index];
    const newSaved = [...savedRecipes];
    newSaved.splice(index, 1);
    setSavedRecipes(newSaved);
    localStorage.setItem('savedRecipes', JSON.stringify(newSaved));
    if (selectedRecipe && recipeToDelete?.content === selectedRecipe) {
      setSelectedRecipe(null);
    }
  };

  if (savedRecipes.length === 0) {
    return (
      <div className={`glass-panel ${styles.formContainer}`} style={{ textAlign: "center", padding: "3rem" }}>
        <h2>No Saved Recipes</h2>
        <p style={{ color: "var(--secondary)", marginTop: "1rem" }}>Generate a recipe and click &quot;Save Recipe&quot; to see it here.</p>
      </div>
    );
  }

  if (selectedRecipe) {
    return (
      <div>
        <button className="btn" onClick={() => setSelectedRecipe(null)} style={{ marginBottom: "1rem" }}>
          ← Back to Saved Recipes
        </button>
        <RecipeDisplay recipe={selectedRecipe} isLoading={false} />
      </div>
    );
  }

  return (
    <div className={`glass-panel ${styles.formContainer}`}>
      <h2>Saved Recipes</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        {savedRecipes.map((recipe, index) => (
          <div key={index} style={{ padding: "1rem", border: "1px solid var(--surface-border)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--primary)" }}>{recipe.title}</h3>
              <small style={{ color: "var(--secondary)" }}>{new Date(recipe.date).toLocaleDateString()}</small>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-primary" onClick={() => setSelectedRecipe(recipe.content)}>View</button>
              <button className="btn" onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
