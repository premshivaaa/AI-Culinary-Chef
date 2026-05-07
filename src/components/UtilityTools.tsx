"use client";

import { useState } from "react";
import styles from "../app/page.module.css";

export default function UtilityTools() {
  const [activeTab, setActiveTab] = useState<'converter' | 'substitutes'>('converter');
  
  // Converter State
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cups");
  const [toUnit, setToUnit] = useState("grams");
  const [result, setResult] = useState<number | null>(null);

  // Simple static conversion logic (assuming flour/sugar averages for cups to grams)
  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return setResult(null);

    let baseMl = val; // Convert everything to ml first
    if (fromUnit === "cups") baseMl = val * 236.588;
    else if (fromUnit === "tablespoons") baseMl = val * 14.7868;
    else if (fromUnit === "teaspoons") baseMl = val * 4.92892;
    else if (fromUnit === "grams") baseMl = val; // rough estimate 1g = 1ml for water
    else baseMl = val;

    let finalVal = baseMl;
    if (toUnit === "cups") finalVal = baseMl / 236.588;
    else if (toUnit === "tablespoons") finalVal = baseMl / 14.7868;
    else if (toUnit === "teaspoons") finalVal = baseMl / 4.92892;
    else if (toUnit === "grams") finalVal = baseMl; // rough

    setResult(finalVal);
  };

  // Substitution Engine State
  const [subIngredient, setSubIngredient] = useState("");
  const [subResult, setSubResult] = useState<string | null>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(false);

  const handleSubstitute = async () => {
    if (!subIngredient.trim()) return;
    setIsLoadingSub(true);
    setSubResult(null);
    try {
      const response = await fetch("/api/substitute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient: subIngredient }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setSubResult(data.substitute);
    } catch {
      setSubResult("Could not find a substitute. Please try another ingredient.");
    } finally {
      setIsLoadingSub(false);
    }
  };

  return (
    <div className={`glass-panel ${styles.formContainer}`}>
      <h2>Utility Tools</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button 
          className={`btn ${activeTab === 'converter' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('converter')}
        >
          Measurement Converter
        </button>
        <button 
          className={`btn ${activeTab === 'substitutes' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('substitutes')}
        >
          Substitution Engine
        </button>
      </div>

      {activeTab === 'converter' && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input 
              type="number" 
              className={styles.textarea} 
              style={{ minHeight: "40px", padding: "10px", width: "100px" }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Amount"
            />
            <select className={styles.textarea} style={{ minHeight: "40px", padding: "10px", flex: 1 }} value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
              <option value="cups">Cups</option>
              <option value="tablespoons">Tablespoons</option>
              <option value="teaspoons">Teaspoons</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="grams">Grams (g)</option>
            </select>
            <span>to</span>
            <select className={styles.textarea} style={{ minHeight: "40px", padding: "10px", flex: 1 }} value={toUnit} onChange={e => setToUnit(e.target.value)}>
              <option value="grams">Grams (g)</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="cups">Cups</option>
              <option value="tablespoons">Tablespoons</option>
              <option value="teaspoons">Teaspoons</option>
            </select>
            <button className="btn btn-primary" onClick={handleConvert}>Convert</button>
          </div>
          {result !== null && (
            <div style={{ padding: "15px", background: "var(--surface-border)", borderRadius: "8px", textAlign: "center" }}>
              <h3 style={{ margin: 0 }}>{result.toFixed(2)} {toUnit}</h3>
            </div>
          )}
        </div>
      )}

      {activeTab === 'substitutes' && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              className={styles.textarea} 
              style={{ minHeight: "40px", padding: "10px", flex: 1 }}
              value={subIngredient}
              onChange={(e) => setSubIngredient(e.target.value)}
              placeholder="e.g., egg, buttermilk, baking powder..."
            />
            <button className="btn btn-primary" onClick={handleSubstitute} disabled={isLoadingSub}>
              {isLoadingSub ? "Searching..." : "Find Substitute"}
            </button>
          </div>
          {subResult && (
            <div style={{ padding: "15px", background: "var(--surface-border)", borderRadius: "8px" }}>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{subResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
