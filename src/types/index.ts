export { ApiError } from './api';
export type { ApiErrorResponse, Paginated, PaginationParams } from './api';

/** A value that may be `null`. */
export type Nullable<T> = T | null;

/** A value that may be `null` or `undefined`. */
export type Maybe<T> = T | null | undefined;

/** Canonical entity identifier type. */
export type ID = string;
