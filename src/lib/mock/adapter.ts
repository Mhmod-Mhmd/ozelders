import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  TUTORS,
  SUBJECTS,
  TESTIMONIALS,
  CONVERSATIONS,
  getSavedTutorIds,
  addSavedTutor,
  removeSavedTutor,
  getReviewsForTutor,
} from '@/data';
import { type MessageFolder } from '@/features/messages/types/message.types';
import { filterTutors, sortTutors } from '@/features/tutors/utils/filterTutors';
import {
  type AvailabilityPeriod,
  type SortKey,
  type Weekday,
} from '@/features/tutors/types/tutor.types';
import { type Paginated } from '@/types';

/**
 * In-browser mock backend.
 *
 * This is a fake HTTP server wired in as an Axios adapter so that every request
 * still flows through the real `httpClient` (interceptors, auth header, error
 * normalization). It reads from the static `src/data` "database" — the only
 * place in the app allowed to touch that data directly. Swapping in a real API
 * is just removing `installMockApi()`; components and hooks stay untouched.
 */

/** Simulated network latency, in ms. */
function networkDelay(): Promise<void> {
  const ms = 200 + Math.floor(Math.random() * 400);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type Query = Record<string, unknown>;

function asString(value: unknown): string | undefined {
  return value === undefined || value === null || value === ''
    ? undefined
    : String(value);
}

function asNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function asBool(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return value === true || value === 'true';
}

function asArray<T = string>(value: unknown): T[] | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return (Array.isArray(value) ? value : [value]) as T[];
}

function paginate<T>(items: T[], page = 1, pageSize?: number): Paginated<T> {
  const size = pageSize && pageSize > 0 ? pageSize : items.length || 1;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * size;
  return {
    data: items.slice(start, start + size),
    meta: { page: safePage, pageSize: size, total, totalPages },
  };
}

/** Error thrown by a handler; turned into a rejected request below. */
class HttpError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/* ------------------------------------------------------------------ */
/* Route handlers                                                      */
/* ------------------------------------------------------------------ */

interface RouteContext {
  /** Capture groups from the route pattern, in order. */
  params: string[];
  query: Query;
}

type Handler = (ctx: RouteContext) => unknown;

interface Route {
  method: string;
  pattern: RegExp;
  handler: Handler;
}

const routes: Route[] = [
  {
    method: 'GET',
    pattern: /^\/tutors$/,
    handler: ({ query }) => {
      const filtered = filterTutors(TUTORS, {
        category: asString(query.category),
        subject: asString(query.subject),
        search: asString(query.search),
        minPrice: asNumber(query.minPrice),
        maxPrice: asNumber(query.maxPrice),
        minRating: asNumber(query.minRating),
        nativeOnly: asBool(query.nativeOnly),
        countries: asArray<string>(query.countries),
        availability: asArray<AvailabilityPeriod>(query.availability),
        days: asArray<Weekday>(query.days),
      });
      const sorted = sortTutors(
        filtered,
        (asString(query.sort) as SortKey) ?? 'top-rated',
      );
      return paginate(sorted, asNumber(query.page), asNumber(query.pageSize));
    },
  },
  {
    method: 'GET',
    pattern: /^\/tutors\/saved$/,
    handler: ({ query }) => {
      const ids = getSavedTutorIds();
      const saved = TUTORS.filter((t) => ids.includes(t.id));
      return paginate(saved, asNumber(query.page), asNumber(query.pageSize));
    },
  },
  {
    method: 'POST',
    pattern: /^\/tutors\/([^/]+)\/save$/,
    handler: ({ params }) => {
      const tutor = TUTORS.find((t) => t.id === params[0]);
      if (!tutor) throw new HttpError(404, 'Tutor not found', 'NOT_FOUND');
      addSavedTutor(tutor.id);
      return tutor;
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/tutors\/([^/]+)\/save$/,
    handler: ({ params }) => {
      const tutor = TUTORS.find((t) => t.id === params[0]);
      if (!tutor) throw new HttpError(404, 'Tutor not found', 'NOT_FOUND');
      removeSavedTutor(tutor.id);
      return tutor;
    },
  },
  {
    method: 'GET',
    pattern: /^\/tutors\/([^/]+)\/reviews$/,
    handler: ({ params, query }) => {
      const tutor = TUTORS.find((t) => t.id === params[0]);
      if (!tutor) throw new HttpError(404, 'Tutor not found', 'NOT_FOUND');
      const reviews = getReviewsForTutor(tutor.id, asNumber(query.count) ?? 6);
      return paginate(reviews, asNumber(query.page), asNumber(query.pageSize));
    },
  },
  {
    method: 'GET',
    pattern: /^\/tutors\/([^/]+)$/,
    handler: ({ params }) => {
      const tutor = TUTORS.find((t) => t.id === params[0]);
      if (!tutor) throw new HttpError(404, 'Tutor not found', 'NOT_FOUND');
      return tutor;
    },
  },
  {
    method: 'GET',
    pattern: /^\/subjects$/,
    handler: ({ query }) => paginate(SUBJECTS, asNumber(query.page), asNumber(query.pageSize)),
  },
  {
    method: 'GET',
    pattern: /^\/testimonials$/,
    handler: ({ query }) =>
      paginate(TESTIMONIALS, asNumber(query.page), asNumber(query.pageSize)),
  },
  {
    method: 'GET',
    pattern: /^\/conversations$/,
    handler: ({ query }) => {
      const folder = (asString(query.folder) as MessageFolder) ?? 'all';
      const filtered = CONVERSATIONS.filter((c) => {
        if (folder === 'unread') return c.unread && !c.archived;
        if (folder === 'archived') return c.archived;
        return !c.archived; // 'all' hides archived threads
      });
      return paginate(filtered, asNumber(query.page), asNumber(query.pageSize));
    },
  },
];

/* ------------------------------------------------------------------ */
/* Adapter                                                            */
/* ------------------------------------------------------------------ */

function buildResponse(
  config: InternalAxiosRequestConfig,
  data: unknown,
): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
  };
}

function buildError(
  config: InternalAxiosRequestConfig,
  status: number,
  message: string,
  code?: string,
): AxiosError {
  const response: AxiosResponse = {
    data: { message, code },
    status,
    statusText: message,
    headers: new AxiosHeaders(),
    config,
  };
  return new AxiosError(message, code ?? 'ERR_MOCK', config, undefined, response);
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await networkDelay();

  const method = (config.method ?? 'get').toUpperCase();
  const path = (config.url ?? '').split('?')[0].replace(/\/+$/, '') || '/';
  const query = (config.params ?? {}) as Query;

  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(path);
    if (!match) continue;

    try {
      const data = route.handler({ params: match.slice(1), query });
      return buildResponse(config, data);
    } catch (error) {
      if (error instanceof HttpError) {
        throw buildError(config, error.status, error.message, error.code);
      }
      throw buildError(config, 500, 'Mock server error', 'INTERNAL');
    }
  }

  throw buildError(config, 404, `No mock handler for ${method} ${path}`, 'NOT_FOUND');
};
