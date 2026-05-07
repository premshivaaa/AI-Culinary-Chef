const BLOCKED_PATTERNS = [
  /\bfuck(?:er|ers|ing|ed)?\b/i,
  /\bshit(?:ty)?\b/i,
  /\bbitch(?:es)?\b/i,
  /\basshole\b/i,
  /\bcunt\b/i,
  /\bdick\b/i,
  /\bpussy\b/i,
  /\bslut\b/i,
  /\bwhore\b/i,
  /\bsex\b/i,
  /\bporn\b/i,
];

const INVALID_CHARACTER_PATTERN = /[^a-zA-Z\s,.'()/%+-]/g;

export interface IngredientValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateIngredientInput(input: string): IngredientValidationResult {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      isValid: false,
      error: "Please enter valid ingredients.",
    };
  }

  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(trimmedInput))) {
    return {
      isValid: false,
      error: "The entered ingredients are incorrect. Please enter valid cooking ingredients only.",
    };
  }

  const cleanedInput = trimmedInput.replace(INVALID_CHARACTER_PATTERN, " ");
  const ingredientParts = cleanedInput
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (ingredientParts.length === 0) {
    return {
      isValid: false,
      error: "Please enter valid ingredients.",
    };
  }

  const hasMeaningfulWord = ingredientParts.some((part) => /[a-zA-Z]{2,}/.test(part));

  if (!hasMeaningfulWord) {
    return {
      isValid: false,
      error: "The entered ingredients are incorrect. Please enter recognizable cooking ingredients.",
    };
  }

  return { isValid: true };
}
