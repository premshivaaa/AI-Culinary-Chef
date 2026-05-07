"use client";

import { useState } from "react";

interface StepByStepModeProps {
  recipe: string;
  onClose: () => void;
}

export default function StepByStepMode({ recipe, onClose }: StepByStepModeProps) {
  // Very basic parsing to find the Instructions section
  const lines = recipe.split('\n');
  const instructionsStartIndex = lines.findIndex(line => line.toLowerCase().includes('## instructions'));
  
  let steps: string[] = [];
  if (instructionsStartIndex !== -1) {
    steps = lines.slice(instructionsStartIndex + 1).filter(line => line.trim() !== '' && !line.startsWith('##'));
  } else {
    // Fallback if formatting is weird
    steps = lines.filter(line => /^\d+\./.test(line) || line.startsWith('* ') || line.startsWith('- '));
  }

  const [currentStep, setCurrentStep] = useState(0);

  if (steps.length === 0) {
    return (
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'var(--overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
        <div className="glass-panel" style={{padding: '2rem', maxWidth: '600px', width: '90%', textAlign: 'center'}}>
          <h2>Could not extract steps.</h2>
          <button className="btn btn-primary" onClick={onClose} style={{marginTop: '1rem'}}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'var(--overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div className="glass-panel" style={{padding: '3rem', maxWidth: '800px', width: '90%', minHeight: '400px', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h2 style={{margin: 0}}>Step {currentStep + 1} of {steps.length}</h2>
          <button className="btn" onClick={onClose}>Close ✕</button>
        </div>
        
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', lineHeight: '1.6', textAlign: 'center'}}>
          <p>{steps[currentStep].replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '')}</p>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>
          <button 
            className="btn" 
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
              } else {
                onClose();
              }
            }}
          >
            {currentStep === steps.length - 1 ? "Finish Cooking 🎉" : "Next Step →"}
          </button>
        </div>
      </div>
    </div>
  );
}
