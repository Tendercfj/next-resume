export type Issues = Record<string, string>;

export class InputValidationError extends Error {
  issues: Issues;

  constructor(issues: Issues) {
    super("Invalid input");
    this.name = "InputValidationError";
    this.issues = issues;
  }
}

export function isInputValidationError(
  error: unknown,
): error is InputValidationError {
  return error instanceof InputValidationError;
}
