/**
 * @desc Standardized Error class for CareerForge API
 * This ensures every error across the app follows the same JSON structure.
 */
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.success = false;
    this.message = message;

    if (stack) {
      this.stack = stack;
    } else {
      // Captures the stack trace to help with debugging in development
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * toJSON Method
   * Ensures that when this error is sent in a response, it only includes
   * necessary fields and excludes sensitive data like the stack trace.
   */
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      data: this.data,
    };
  }
}

export { ApiError };