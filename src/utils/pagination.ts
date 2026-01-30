/**
 * Pagination Utilities
 *
 * Helpers for handling pagination with Gusto API.
 * Gusto uses page-based pagination with 'page' and 'per' parameters.
 */

import type { PaginatedResponse, PaginationParams } from '../types/entities.js';

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  per: 25,
  maxPer: 100,
} as const;

/**
 * Normalize pagination parameters
 */
export function normalizePaginationParams(
  params?: PaginationParams,
  maxPer = PAGINATION_DEFAULTS.maxPer
): Required<Pick<PaginationParams, 'per'>> & Omit<PaginationParams, 'per'> {
  return {
    per: Math.min(params?.per || PAGINATION_DEFAULTS.per, maxPer),
    page: params?.page,
  };
}

/**
 * Create an empty paginated response
 */
export function emptyPaginatedResponse<T>(): PaginatedResponse<T> {
  return {
    items: [],
    count: 0,
    hasMore: false,
  };
}

/**
 * Create a paginated response from an array
 */
export function createPaginatedResponse<T>(
  items: T[],
  options: {
    total?: number;
    hasMore?: boolean;
    nextPage?: number;
  } = {}
): PaginatedResponse<T> {
  return {
    items,
    count: items.length,
    total: options.total,
    hasMore: options.hasMore ?? false,
    nextPage: options.nextPage,
  };
}

/**
 * Calculate if there are more items based on page pagination
 */
export function hasMoreItems(page: number, per: number, total: number): boolean {
  return page * per < total;
}

/**
 * Calculate next page for page-based pagination
 */
export function getNextPage(
  currentPage: number,
  per: number,
  total: number
): number | undefined {
  const next = currentPage + 1;
  return (currentPage * per) < total ? next : undefined;
}
