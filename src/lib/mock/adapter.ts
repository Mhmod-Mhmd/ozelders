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
  authenticate,
  findUserById,
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
  getTutorApplication,
  saveAbout,
  savePhoto,
  saveCertification,
  saveEducation,
  saveDescription,
  saveVideo,
  saveAvailability,
  savePricing,
  submitTutorApplication,
  type SocialProvider,
  type AutoconfirmMode,
} from '@/data';
import { type Availability } from '@/features/tutors/types/tutor.types';
import {
  type CertificateInput,
  type EducationItemInput,
  type LanguageSkillInput,
} from '@/features/tutor-onboarding/types/onboarding.types';
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
  /** Bearer access token from the `Authorization` header, if present. */
  token?: string;
}

/* ------------------------------------------------------------------ */
/* Auth helpers (mock JWT-ish tokens encode the user id as a suffix).  */
/* ------------------------------------------------------------------ */

const makeAccessToken = (userId: string) => `mock-access.${userId}`;
const makeRefreshToken = (userId: string) => `mock-refresh.${userId}`;

/** Pull the user id out of a `mock-access.<id>` / `mock-refresh.<id>` token. */
function userIdFromToken(token?: string): string | undefined {
  if (!token) return undefined;
  const id = token.split('.').slice(1).join('.');
  return id || undefined;
}

/** Resolve the signed-in user from a request's bearer token, or 401. */
function requireUser(token?: string) {
  const user = findUserById(userIdFromToken(token) ?? '');
  if (!user) throw new HttpError(401, 'Not authenticated', 'UNAUTHENTICATED');
  return user;
}

type Handler = (ctx: RouteContext) => unknown;

interface Route {
  method: string;
  pattern: RegExp;
  handler: Handler;
}

const routes: Route[] = [
  /* ---------------------------------------------------------------- */
  /* Auth                                                             */
  /* ---------------------------------------------------------------- */
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: ({ body }) => {
      const email = asString(body.email)?.trim() ?? '';
      const password = asString(body.password) ?? '';
      const errors: Record<string, string[]> = {};
      if (!email) errors.email = ['Email is required.'];
      if (!password) errors.password = ['Password is required.'];
      if (Object.keys(errors).length) throw validationError(errors);

      const user = authenticate(email, password);
      if (!user) {
        throw new HttpError(
          401,
          'The email or password is incorrect.',
          'INVALID_CREDENTIALS',
        );
      }
      return {
        user,
        accessToken: makeAccessToken(user.id),
        refreshToken: makeRefreshToken(user.id),
      };
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/refresh$/,
    handler: ({ body }) => {
      const userId = userIdFromToken(asString(body.refreshToken));
      const user = findUserById(userId ?? '');
      if (!user) {
        throw new HttpError(401, 'Invalid refresh token', 'INVALID_REFRESH');
      }
      return { user, accessToken: makeAccessToken(user.id) };
    },
  },
  {
    method: 'GET',
    pattern: /^\/auth\/session$/,
    handler: ({ token }) => ({ user: requireUser(token) }),
  },
  {
    method: 'POST',
    pattern: /^\/auth\/logout$/,
    handler: () => ({ success: true }),
  },

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

  /* ---------------------------------------------------------------- */
  /* Tutor onboarding application                                     */
  /* (Field errors are i18n keys, translated by the form's errorText.) */
  /* ---------------------------------------------------------------- */
  {
    method: 'GET',
    pattern: /^\/tutor-application$/,
    handler: ({ token }) => {
      requireUser(token);
      return getTutorApplication();
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/about$/,
    handler: ({ token, body }) => {
      requireUser(token);
      const errors: Record<string, string[]> = {};
      const firstName = asString(body.firstName)?.trim() ?? '';
      const lastName = asString(body.lastName)?.trim() ?? '';
      const email = asString(body.email)?.trim() ?? '';
      const country = asString(body.country) ?? '';
      const subject = asString(body.subject) ?? '';
      const phoneNumber = asString(body.phoneNumber)?.trim() ?? '';
      const languages = (asArray(body.languages) ??
        []) as LanguageSkillInput[];

      if (!firstName) errors.firstName = ['onboarding.errors.firstNameRequired'];
      if (!lastName) errors.lastName = ['onboarding.errors.lastNameRequired'];
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = ['onboarding.errors.emailInvalid'];
      if (!country) errors.country = ['onboarding.errors.countryRequired'];
      if (!subject) errors.subject = ['onboarding.errors.subjectRequired'];
      if (!languages.length || languages.some((l) => !l?.language || !l?.level))
        errors.languages = ['onboarding.errors.languageRequired'];
      if (phoneNumber && !/^[0-9\s-]{4,20}$/.test(phoneNumber))
        errors.phoneNumber = ['onboarding.errors.phoneInvalid'];
      if (body.over18 !== true)
        errors.over18 = ['onboarding.errors.over18Required'];
      if (Object.keys(errors).length) throw validationError(errors);

      return saveAbout({
        firstName,
        lastName,
        email,
        country,
        subject,
        languages: languages.map((l) => ({
          language: String(l.language),
          level: String(l.level),
        })),
        phoneCountry: asString(body.phoneCountry) ?? 'US',
        phoneNumber,
        over18: true,
      });
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/photo$/,
    handler: ({ token, body }) => {
      requireUser(token);
      return savePhoto({ photoUrl: asString(body.photoUrl) ?? '' });
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/certification$/,
    handler: ({ token, body }) => {
      requireUser(token);
      const hasNone = body.hasNone === true;
      const certificates = (asArray(body.certificates) ??
        []) as CertificateInput[];
      if (
        !hasNone &&
        (!certificates.length ||
          certificates.some((c) => !c?.subject || !c?.certificate))
      ) {
        throw validationError({
          certificates: ['onboarding.errors.certificateRequired'],
        });
      }
      return saveCertification({
        hasNone,
        certificates: hasNone ? [] : certificates,
      });
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/education$/,
    handler: ({ token, body }) => {
      requireUser(token);
      const hasNone = body.hasNone === true;
      const educations = (asArray(body.educations) ??
        []) as EducationItemInput[];
      if (
        !hasNone &&
        (!educations.length ||
          educations.some(
            (e) => !e?.university || !e?.degree || !e?.degreeType,
          ))
      ) {
        throw validationError({
          educations: ['onboarding.errors.educationRequired'],
        });
      }
      return saveEducation({
        hasNone,
        educations: hasNone ? [] : educations,
      });
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/description$/,
    handler: ({ token, body }) => {
      requireUser(token);
      const headline = asString(body.headline)?.trim() ?? '';
      const introduction = asString(body.introduction)?.trim() ?? '';
      const teachingStyle = asString(body.teachingStyle)?.trim() ?? '';
      const errors: Record<string, string[]> = {};
      if (headline.length < 10)
        errors.headline = ['onboarding.errors.headlineTooShort'];
      if (introduction.length < 50)
        errors.introduction = ['onboarding.errors.introductionTooShort'];
      if (teachingStyle.length < 50)
        errors.teachingStyle = ['onboarding.errors.teachingStyleTooShort'];
      if (Object.keys(errors).length) throw validationError(errors);
      return saveDescription({ headline, introduction, teachingStyle });
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/video$/,
    handler: ({ token, body }) => {
      requireUser(token);
      const url = asString(body.url)?.trim() ?? '';
      if (url && !/^https?:\/\/.+/.test(url)) {
        throw validationError({ url: ['onboarding.errors.videoUrlInvalid'] });
      }
      return saveVideo({ url });
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/availability$/,
    handler: ({ token, body }) => {
      requireUser(token);
      const availability = (body.availability ?? {}) as Availability;
      const hasAny = Object.values(availability).some(
        (periods) => Array.isArray(periods) && periods.length > 0,
      );
      if (!hasAny) {
        throw validationError({
          availability: ['onboarding.errors.availabilityRequired'],
        });
      }
      return saveAvailability(availability);
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/tutor-application\/pricing$/,
    handler: ({ token, body }) => {
      requireUser(token);
      const rate = asNumber(body.hourlyRate);
      if (rate === undefined || !Number.isInteger(rate)) {
        throw validationError({ hourlyRate: ['onboarding.errors.rateInvalid'] });
      }
      if (rate < 3)
        throw validationError({ hourlyRate: ['onboarding.errors.rateTooLow'] });
      if (rate > 200)
        throw validationError({ hourlyRate: ['onboarding.errors.rateTooHigh'] });
      return savePricing(rate, asString(body.currency) ?? 'USD');
    },
  },
  {
    method: 'POST',
    pattern: /^\/tutor-application\/submit$/,
    handler: ({ token }) => {
      requireUser(token);
      return submitTutorApplication();
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

  const authHeader = String(
    AxiosHeaders.from(config.headers).get('Authorization') ?? '',
  );
  const token = authHeader.replace(/^Bearer\s+/i, '') || undefined;

  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(path);
    if (!match) continue;

    try {
      const data = route.handler({ params: match.slice(1), query, body, token });
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
