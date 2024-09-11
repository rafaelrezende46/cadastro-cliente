export default class CustomValidationError extends Error {
  constructor(
    public field: string,
    public message: string,
  ) {
    super(`Validation - ${field}: ${message}`);
  }
}
