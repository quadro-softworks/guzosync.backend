import 'reflect-metadata';
import request from 'supertest';
import { Express } from 'express';
import http from 'http';
import { setupTestApp, teardownTestApp, createAuthenticatedRequest, testData } from '../integration/test-utils';

export {
  setupTestApp,
  teardownTestApp,
  createAuthenticatedRequest,
  testData,
};

/**
 * Helper function to verify response structure for standardized API responses
 * @param response HTTP response object
 * @param expectedStatus Expected HTTP status code
 * @param expectedDataProps Array of property names that should exist in the data object
 */
export const verifySuccessResponse = (
  response: request.Response,
  expectedStatus = 200,
  expectedDataProps: string[] = []
) => {
  expect(response.status).toBe(expectedStatus);
  
  if (expectedStatus < 400) {
    // For success responses, verify data structure
    if (expectedDataProps.length > 0) {
      expect(response.body).toBeDefined();
      expectedDataProps.forEach(prop => {
        expect(response.body).toHaveProperty(prop);
      });
    }
  }
};

/**
 * Helper function to verify error response structure
 * @param response HTTP response object
 * @param expectedStatus Expected HTTP status code
 * @param expectedErrorMessage Expected error message (optional)
 */
export const verifyErrorResponse = (
  response: request.Response,
  expectedStatus: number,
  expectedErrorMessage?: string
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('message');
  
  if (expectedErrorMessage) {
    expect(response.body.message).toEqual(expect.stringContaining(expectedErrorMessage));
  }
}; 