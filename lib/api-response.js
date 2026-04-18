/**
 * Standardizes the response format for Server Actions.
 * 
 * @param {boolean} success - Whether the operation succeeded.
 * @param {any} data - The data to return on success.
 * @param {string|null} error - The error message to return on failure.
 * @returns {Object} { success, data, error }
 */
export function createActionResponse(success, data = null, error = null) {
  return {
    success,
    data,
    error: typeof error === "string" ? error : error?.message || "An unexpected error occurred",
  };
}

export const actionSuccess = (data) => createActionResponse(true, data);
export const actionError = (error) => createActionResponse(false, null, error);
