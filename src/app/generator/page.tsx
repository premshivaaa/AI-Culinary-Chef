"use client";

import { useState } from "react";
import styles from "../page.module.css";
import IngredientForm from "../../components/IngredientForm";
import RecipeDisplay from "../../components/RecipeDisplay";
import ChatBot from "../../components/ChatBot";
import type { RecipePreferences } from "../../components/IngredientForm";

interface GenerateRecipeResponse {
  recipe?: string;
  error?: string;
}

export default function GeneratorPage() {
  const [recipe, setRecipe] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateRecipe = async (ingredients: string, prefs: RecipePreferences) => {
    setIsLoading(true);
    setRecipe(""); // Clear previous recipe
    setErrorMessage("");
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients, prefs }),
      });

      const responseText = await response.text();
      let data: GenerateRecipeResponse = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText) as GenerateRecipeResponse;
        } catch {
          throw new Error("The server returned an invalid response. Please try again.");
        }
      }

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Failed to generate recipe"
        );
      }

      if (typeof data.recipe !== "string" || !data.recipe.trim()) {
        throw new Error("The server returned an empty recipe. Please try again.");
      }

      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't generate a recipe right now. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header} style={{ marginBottom: "0" }}>
          <h1 className={styles.title} style={{ fontSize: "2.5rem" }}>
            Recipe Generator
          </h1>
          <p className={styles.subtitle}>
            Tell me what&apos;s in your kitchen, and I&apos;ll create something delicious.
          </p>
        </div>

        <div className={styles.contentArea}>
          <IngredientForm onSubmit={handleGenerateRecipe} isLoading={isLoading} />
          {(recipe || isLoading) && (
            <RecipeDisplay recipe={recipe} isLoading={isLoading} />
          )}
          {!isLoading && errorMessage && (
            <div
              className={`glass-panel ${styles.recipeContainer}`}
              style={{ border: "1px solid var(--error-border)" }}
            >
              <h2 style={{ color: "var(--error-soft)", marginTop: 0 }}>Invalid Input</h2>
              <p style={{ marginBottom: 0 }}>{errorMessage}</p>
            </div>
          )}
        </div>

        {recipe && <ChatBot recipeContext={recipe} />}
      </main>
    </div>
  );
}
