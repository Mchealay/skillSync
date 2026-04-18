import { describe, it, expect } from 'vitest';
import { createActionResponse, actionSuccess, actionError } from '../api-response';

describe('API Response utilities', () => {
  it('createActionResponse formats correctly on success', () => {
    const response = createActionResponse(true, { id: 1 });
    expect(response).toEqual({ success: true, data: { id: 1 }, error: null });
  });

  it('actionError parses error message properly from string', () => {
    const errorMsg = 'Something went wrong';
    const response = actionError(errorMsg);
    expect(response).toEqual({ success: false, data: null, error: errorMsg });
  });

  it('actionError parses error message from error object', () => {
    const error = new Error('Database connection failed');
    const response = actionError(error);
    expect(response).toEqual({ success: false, data: null, error: 'Database connection failed' });
  });
});
