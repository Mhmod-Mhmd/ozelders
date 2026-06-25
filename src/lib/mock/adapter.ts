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
  getAccount,
  updateAccount,
  setAccountAvatar,
  connectSocial,
  disconnectSocial,
  updateEmail,
  verifyPassword,
  setPassword,
  updateNotificationPrefs,
  updateAutoconfirm,
  setCalendarConnected,
  getCards,
  addCard,
  removeCard,
  getPaymentHistory,
  type SocialProvider,
  type AutoconfirmMode,
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
  /** Field-level validation errors for 422 responses. */
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    code?: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

/** A 422 validation failure with one or more field errors. */
function validationError(fieldErrors: Record<string, string[]>): HttpError {
  return new HttpError(
    422,
    'The submitted data is invalid.',
    'VALIDATION',
    fieldErrors,
  );
}

/* ------------------------------------------------------------------ */
/* Route handlers                                                      */
/* ------------------------------------------------------------------ */

interface RouteContext {
  /** Capture groups from the route pattern, in order. */
  params: string[];
  query: Query;
  /** Parsed JSON request body (empty object for GET/DELETE). */
  body: Record<string, unknown>;
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
        superTutor: asBool(query.superTutor),
        professional: asBool(query.professional),
        specialties: asArray<string>(query.specialties),
        languages: asArray<string>(query.languages),
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
    // Filter-bar facets derived from the catalog (must precede /tutors/:id).
    method: 'GET',
    pattern: /^\/tutors\/facets$/,
    handler: () => {
      const tagCounts = new Map<string, number>();
      const langCounts = new Map<string, number>();
      for (const t of TUTORS) {
        for (const tag of t.tags)
          tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
        for (const s of t.speaks)
          langCounts.set(s.language, (langCounts.get(s.language) ?? 0) + 1);
      }
      const byFreq = (m: Map<string, number>) =>
        [...m.entries()].sort((a, b) => b[1] - a[1]).map(([key]) => key);
      return { specialties: byFreq(tagCounts), languages: byFreq(langCounts) };
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
    handler: ({ query }) =>
      paginate(SUBJECTS, asNumber(query.page), asNumber(query.pageSize)),
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

  /* ---------------------------------------------------------------- */
  /* Account / settings                                               */
  /* ---------------------------------------------------------------- */
  {
    method: 'GET',
    pattern: /^\/account$/,
    handler: () => getAccount(),
  },
  {
    method: 'PATCH',
    pattern: /^\/account$/,
    handler: ({ body }) => {
      const firstName = asString(body.firstName)?.trim() ?? '';
      if (!firstName) {
        throw validationError({ firstName: ['First name is required.'] });
      }
      const phoneNumber = asString(body.phoneNumber)?.trim() ?? '';
      if (phoneNumber && !/^[0-9\s-]{4,20}$/.test(phoneNumber)) {
        throw validationError({
          phoneNumber: ['Enter a valid phone number.'],
        });
      }
      return updateAccount({
        firstName,
        lastName: asString(body.lastName)?.trim() ?? '',
        phoneCountry: asString(body.phoneCountry) ?? 'US',
        phoneNumber,
        timezone: asString(body.timezone) ?? 'Europe/Istanbul',
      });
    },
  },
  {
    method: 'POST',
    pattern: /^\/account\/avatar$/,
    handler: ({ body }) => {
      const dataUrl = asString(body.dataUrl);
      if (!dataUrl) {
        throw validationError({ avatar: ['No image was provided.'] });
      }
      return setAccountAvatar(dataUrl);
    },
  },
  {
    method: 'POST',
    pattern: /^\/account\/social\/([^/]+)$/,
    handler: ({ params, body }) => {
      const provider = params[0] as SocialProvider;
      if (provider !== 'facebook' && provider !== 'google') {
        throw new HttpError(404, 'Unknown provider', 'NOT_FOUND');
      }
      const displayName = asString(body.displayName) ?? 'Mhmoud M.';
      return connectSocial(provider, displayName);
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/account\/social\/([^/]+)$/,
    handler: ({ params }) => {
      const provider = params[0] as SocialProvider;
      if (provider !== 'facebook' && provider !== 'google') {
        throw new HttpError(404, 'Unknown provider', 'NOT_FOUND');
      }
      return disconnectSocial(provider);
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/account\/email$/,
    handler: ({ body }) => {
      const email = asString(body.email)?.trim() ?? '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw validationError({ email: ['Enter a valid email address.'] });
      }
      return updateEmail(email);
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/account\/password$/,
    handler: ({ body }) => {
      const current = asString(body.currentPassword) ?? '';
      const next = asString(body.newPassword) ?? '';
      if (!verifyPassword(current)) {
        throw validationError({
          currentPassword: ['Your current password is incorrect.'],
        });
      }
      if (next.length < 8) {
        throw validationError({
          newPassword: ['Password must be at least 8 characters.'],
        });
      }
      setPassword(next);
      return { success: true };
    },
  },
  {
    method: 'GET',
    pattern: /^\/account\/notifications$/,
    handler: () => {
      const { pushEnabled, notificationPrefs } = getAccount();
      return { pushEnabled, prefs: notificationPrefs };
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/account\/notifications$/,
    handler: ({ body }) => {
      const prefs = (body.prefs ?? {}) as Record<string, unknown>;
      const updated = updateNotificationPrefs({
        tips: asBool(prefs.tips) ?? false,
        surveys: asBool(prefs.surveys) ?? false,
      });
      return {
        pushEnabled: updated.pushEnabled,
        prefs: updated.notificationPrefs,
      };
    },
  },
  {
    method: 'GET',
    pattern: /^\/account\/autoconfirmation$/,
    handler: () => ({ mode: getAccount().autoconfirm }),
  },
  {
    method: 'PATCH',
    pattern: /^\/account\/autoconfirmation$/,
    handler: ({ body }) => {
      const mode = asString(body.mode);
      if (mode !== 'scheduled' && mode !== 'all') {
        throw validationError({
          mode: ['Choose an auto-confirmation option.'],
        });
      }
      return { mode: updateAutoconfirm(mode as AutoconfirmMode).autoconfirm };
    },
  },
  {
    method: 'GET',
    pattern: /^\/account\/calendar$/,
    handler: () => ({ connected: getAccount().calendarConnected }),
  },
  {
    method: 'POST',
    pattern: /^\/account\/calendar$/,
    handler: () => ({
      connected: setCalendarConnected(true).calendarConnected,
    }),
  },
  {
    method: 'DELETE',
    pattern: /^\/account\/calendar$/,
    handler: () => ({
      connected: setCalendarConnected(false).calendarConnected,
    }),
  },
  {
    method: 'DELETE',
    pattern: /^\/account$/,
    handler: ({ body }) => {
      const email = asString(body.email)?.trim() ?? '';
      if (email.toLowerCase() !== getAccount().email.toLowerCase()) {
        throw validationError({
          email: ['Enter your account email to confirm.'],
        });
      }
      return { success: true };
    },
  },

  /* ---------------------------------------------------------------- */
  /* Payments                                                         */
  /* ---------------------------------------------------------------- */
  {
    method: 'GET',
    pattern: /^\/payment-methods$/,
    handler: ({ query }) =>
      paginate(getCards(), asNumber(query.page), asNumber(query.pageSize)),
  },
  {
    method: 'POST',
    pattern: /^\/payment-methods$/,
    handler: ({ body }) => {
      const number = (asString(body.number) ?? '').replace(/\s/g, '');
      const holder = asString(body.holder)?.trim() ?? '';
      const expMonth = asNumber(body.expMonth);
      const expYear = asNumber(body.expYear);
      const errors: Record<string, string[]> = {};
      if (!/^[0-9]{13,19}$/.test(number))
        errors.number = ['Enter a valid card number.'];
      if (!holder) errors.holder = ['Cardholder name is required.'];
      if (!expMonth || expMonth < 1 || expMonth > 12)
        errors.expMonth = ['Invalid month.'];
      if (!expYear || expYear < 2024 || expYear > 2100)
        errors.expYear = ['Invalid year.'];
      if (Object.keys(errors).length) throw validationError(errors);
      return addCard({
        number,
        holder,
        expMonth: expMonth as number,
        expYear: expYear as number,
      });
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/payment-methods\/([^/]+)$/,
    handler: ({ params }) => {
      if (!removeCard(params[0])) {
        throw new HttpError(404, 'Card not found', 'NOT_FOUND');
      }
      return { success: true };
    },
  },
  {
    method: 'GET',
    pattern: /^\/payment-history$/,
    handler: ({ query }) =>
      paginate(
        getPaymentHistory(),
        asNumber(query.page),
        asNumber(query.pageSize),
      ),
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
  fieldErrors?: Record<string, string[]>,
): AxiosError {
  const response: AxiosResponse = {
    data: { message, code, errors: fieldErrors },
    status,
    statusText: message,
    headers: new AxiosHeaders(),
    config,
  };
  return new AxiosError(
    message,
    code ?? 'ERR_MOCK',
    config,
    undefined,
    response,
  );
}

/** Safely parse the JSON request body axios serialized onto `config.data`. */
function parseBody(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (typeof data === 'object') return data as Record<string, unknown>;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await networkDelay();

  const method = (config.method ?? 'get').toUpperCase();
  const path = (config.url ?? '').split('?')[0].replace(/\/+$/, '') || '/';
  const query = (config.params ?? {}) as Query;
  const body = parseBody(config.data);

  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(path);
    if (!match) continue;

    try {
      const data = route.handler({ params: match.slice(1), query, body });
      return buildResponse(config, data);
    } catch (error) {
      if (error instanceof HttpError) {
        throw buildError(
          config,
          error.status,
          error.message,
          error.code,
          error.fieldErrors,
        );
      }
      throw buildError(config, 500, 'Mock server error', 'INTERNAL');
    }
  }

  throw buildError(
    config,
    404,
    `No mock handler for ${method} ${path}`,
    'NOT_FOUND',
  );
};
