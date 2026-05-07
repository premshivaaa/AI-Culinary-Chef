"use client";

import { useState, useRef } from "react";
import styles from "../app/page.module.css";
import { FaMicrophone, FaCircle } from "react-icons/fa";

export interface RecipePreferences {
  dietary: string;
  cuisine: string;
  spiceLevel: string;
  servings: number;
}

interface IngredientFormProps {
  onSubmit: (ingredients: string, prefs: RecipePreferences) => void;
  isLoading: boolean;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<SpeechRecognitionAlternativeLike>>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type WindowWithSpeechRecognition = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

export default function IngredientForm({ onSubmit, isLoading }: IngredientFormProps) {
  const [ingredients, setIngredients] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const [prefs, setPrefs] = useState<RecipePreferences>({
    dietary: "None",
    cuisine: "Any",
    spiceLevel: "Medium",
    servings: 2,
  });

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const startListening = () => {
    const speechWindow = window as WindowWithSpeechRecognition;
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0][0].transcript;
      setIngredients((prev) => prev ? prev + ", " + transcript : transcript);
    };
    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEventLike) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.trim() && !isLoading) {
      onSubmit(ingredients, prefs);
    }
  };

  return (
    <div className={`glass-panel ${styles.formContainer}`}>
      <form onSubmit={handleSubmit} className={styles.inputGroup}>
        <label htmlFor="ingredients">What&apos;s in your kitchen?</label>
        <div style={{ position: "relative" }}>
          <textarea
            id="ingredients"
            className={styles.textarea}
            placeholder="e.g., chicken breast, garlic, soy sauce, broccoli..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={startListening}
            className="btn"
            style={{ position: "absolute", bottom: "10px", right: "10px", padding: "0.5rem" }}
            title="Dictate ingredients"
          >
            {isListening ? (
              <FaCircle size={16} color="#ef4444" />
            ) : (
              <FaMicrophone size={16} />
            )}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.inputGroup}>
            <label>Dietary Prefs</label>
            <select className={styles.textarea} style={{minHeight: "40px", padding: "0.5rem"}} value={prefs.dietary} onChange={e => setPrefs({...prefs, dietary: e.target.value})}>
              <option value="None">None</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="High-Protein">High-Protein</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Cuisine</label>
            <select className={styles.textarea} style={{minHeight: "40px", padding: "0.5rem"}} value={prefs.cuisine} onChange={e => setPrefs({...prefs, cuisine: e.target.value})}>
              <option value="Any">Any</option>
              <option value="Italian">Italian</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
              <option value="Asian">Asian</option>
              <option value="American">American</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Spice Level</label>
            <select className={styles.textarea} style={{minHeight: "40px", padding: "0.5rem"}} value={prefs.spiceLevel} onChange={e => setPrefs({...prefs, spiceLevel: e.target.value})}>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Servings</label>
            <input type="number" min="1" max="10" className={styles.textarea} style={{minHeight: "40px", padding: "0.5rem"}} value={prefs.servings} onChange={e => setPrefs({...prefs, servings: Math.max(1, Number(e.target.value) || 1)})} />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          style={{marginTop: "1rem"}}
          disabled={!ingredients.trim() || isLoading}
        >
          {isLoading ? "Generating Recipe..." : "Generate Recipe"}
        </button>
      </form>
    </div>
  );
}
