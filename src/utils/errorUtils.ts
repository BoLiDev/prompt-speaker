/**
 * @format
 * @module src/utils/errorUtils
 * @description Utility functions for error handling and formatting
 */

/**
 * Formats an error object into a detailed string
 * @param error The error object to format
 * @returns A string with detailed error information
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    let formattedError = `${error.name}: ${error.message}`;

    if (error.stack) {
      formattedError += `\nStack: ${error.stack.split("\n")[1]?.trim() || "N/A"}`;
    }

    const additionalProps: Record<string, unknown> = {};
    for (const key in error) {
      if (key !== "name" && key !== "message" && key !== "stack") {
        const unknownError = error as unknown;
        const typedError = unknownError as Record<string, unknown>;
        additionalProps[key] = typedError[key];
      }
    }

    if (Object.keys(additionalProps).length > 0) {
      formattedError += `\nAdditional Info: ${JSON.stringify(additionalProps, null, 2)}`;
    }

    return formattedError;
  } else if (error !== null && typeof error === "object") {
    try {
      return `Object Error: ${JSON.stringify(error, null, 2)}`;
    } catch {
      return `Object Error: [Circular Object]`;
    }
  } else if (typeof error === "string") {
    return `String Error: ${error}`;
  } else {
    return `Unknown Error: ${String(error)}`;
  }
}

/**
 * Extracts a user-friendly message from an error
 * @param error The error object
 * @param fallbackMessage A fallback message if no error message can be extracted
 * @returns A user-friendly error message
 */
export function getUserErrorMessage(
  error: unknown,
  fallbackMessage: string = "An unknown error occurred",
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error !== null && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;
    if ("message" in errorObj && typeof errorObj.message === "string") {
      return errorObj.message;
    }
  }

  return fallbackMessage;
}

/**
 * Logs an error with detailed information to the console
 * @param prefix A prefix for the error log
 * @param error The error object
 */
export function logError(prefix: string, error: unknown): void {
  console.error(`${prefix}:`, error);
  console.error(`Detailed Error: ${formatError(error)}`);
}

/**
 * Creates a standardized error handler for use in try-catch blocks
 * @param errorSetter Function to set the error message in state
 * @param logPrefix Prefix for console logging
 * @returns An error handler function
 */
export function createErrorHandler(
  errorSetter: (message: string) => void,
  logPrefix: string,
): (error: unknown) => void {
  return (error: unknown) => {
    logError(logPrefix, error);

    errorSetter(
      getUserErrorMessage(error, `${logPrefix}: An unknown error occurred`),
    );
  };
}
