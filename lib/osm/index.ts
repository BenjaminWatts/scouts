/**
 * OSM API Client - Main Entry Point
 *
 * Automatically returns either the real OSM API client or mock client
 * based on the USE_MOCK_DATA environment variable
 */

import { OSMClient, createOSMClient } from './client';
import { MockOSMClient } from './mock-client';
import type { OSMConfig } from './types';

// Re-export types
export * from './types';

/**
 * Create an OSM API client instance
 * Returns MockOSMClient if USE_MOCK_DATA=true, otherwise returns real OSMClient
 */
export function createClient(config?: OSMConfig): OSMClient | MockOSMClient {
  const useMockData = process.env.USE_MOCK_DATA === 'true';

  if (useMockData) {
    console.log('🎭 Using mock OSM API data');
    return new MockOSMClient(config || { apiId: '', apiToken: '' });
  }

  if (!config) {
    throw new Error(
      'OSM API configuration required. Please provide apiId and apiToken.'
    );
  }

  return createOSMClient(config);
}

/**
 * Create an OSM API client from environment variables
 * Returns MockOSMClient if USE_MOCK_DATA=true
 * Otherwise returns real OSMClient using OSM_API_ID and OSM_API_TOKEN
 */
export function createClientFromEnv(): OSMClient | MockOSMClient {
  const useMockData = process.env.USE_MOCK_DATA === 'true';

  if (useMockData) {
    console.log('🎭 Using mock OSM API data');
    return new MockOSMClient({ apiId: '', apiToken: '' });
  }

  const apiId = process.env.OSM_API_ID;
  const apiToken = process.env.OSM_API_TOKEN;

  if (!apiId || !apiToken) {
    throw new Error(
      'Missing OSM API credentials. Please set OSM_API_ID and OSM_API_TOKEN environment variables, or set USE_MOCK_DATA=true to use mock data.'
    );
  }

  return createOSMClient({
    apiId,
    apiToken,
  });
}
