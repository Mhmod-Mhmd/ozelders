/**
 * Shared API contract types and the normalized error shape used across the app.
 */

/** Standard error payload returned by the backend. Adjust to match your API. */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  /** Field-level validation errors, keyed by field name. */
  errors?: Record<string, string[]>;
}

/** Envelope for paginated list endpoints. */
export interface Paginated<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** Common query params for list/pagination endpoints. */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
}

/**
 * Normalized application error. The Axios response interceptor converts every
 * failed request into one of these, so UI code never has to special-case Axios.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    fieldErrors?: Record<string, string[]>;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors;
  }

  /** True for network/timeout failures where no HTTP response was received. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}
