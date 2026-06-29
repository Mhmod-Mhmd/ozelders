import { z } from 'zod';

/**
 * Tutor-onboarding domain types + the Zod schema for every wizard step.
 *
 * Each step has its own schema so the form and the matching `PATCH
 * /tutor-application/:step` body share one source of truth (`z.infer`) and can
 * never drift. Validation messages are i18n keys (resolved with `t()` at render),
 * exactly like the rest of the app's forms.
 */

/** The eight wizard steps, in order. */
export const STEP_IDS = [
  'about',
  'photo',
  'certification',
  'education',
  'description',
  'video',
  'availability',
  'pricing',
] as const;

export type StepId = (typeof STEP_IDS)[number];

/* ------------------------------------------------------------------ */
/* Step 1 — About                                                      */
/* ------------------------------------------------------------------ */

export const languageSkillSchema = z.object({
  language: z.string().min(1, 'onboarding.errors.languageRequired'),
  level: z.string().min(1, 'onboarding.errors.levelRequired'),
});

export type LanguageSkillInput = z.infer<typeof languageSkillSchema>;

export const aboutSchema = z.object({
  firstName: z.string().trim().min(1, 'onboarding.errors.firstNameRequired'),
  lastName: z.string().trim().min(1, 'onboarding.errors.lastNameRequired'),
  email: z.string().trim().email('onboarding.errors.emailInvalid'),
  country: z.string().min(1, 'onboarding.errors.countryRequired'),
  subject: z.string().min(1, 'onboarding.errors.subjectRequired'),
  languages: z
    .array(languageSkillSchema)
    .min(1, 'onboarding.errors.languageRequired'),
  phoneCountry: z.string().min(2),
  phoneNumber: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9\s-]*$/, 'onboarding.errors.phoneInvalid'),
  over18: z
    .boolean()
    .refine((v) => v === true, { message: 'onboarding.errors.over18Required' }),
});

export type AboutInput = z.infer<typeof aboutSchema>;

/* ------------------------------------------------------------------ */
/* Step 2 — Photo                                                      */
/* ------------------------------------------------------------------ */

export const photoSchema = z.object({
  /** Data URL of the uploaded image; empty until the tutor picks one. */
  photoUrl: z.string(),
});

export type PhotoInput = z.infer<typeof photoSchema>;

/* ------------------------------------------------------------------ */
/* Step 3 — Certification                                              */
/* ------------------------------------------------------------------ */

export const certificateItemSchema = z.object({
  subject: z.string().min(1, 'onboarding.errors.subjectRequired'),
  certificate: z.string().min(1, 'onboarding.errors.certificateTypeRequired'),
  description: z.string().max(500),
  issuedBy: z.string().max(120),
  yearFrom: z.string(),
  yearTo: z.string(),
});

export type CertificateInput = z.infer<typeof certificateItemSchema>;

export const certificationSchema = z
  .object({
    hasNone: z.boolean(),
    certificates: z.array(certificateItemSchema),
  })
  .refine((v) => v.hasNone || v.certificates.length > 0, {
    path: ['certificates'],
    message: 'onboarding.errors.certificateRequired',
  });

export type CertificationInput = z.infer<typeof certificationSchema>;

/* ------------------------------------------------------------------ */
/* Step 4 — Education                                                  */
/* ------------------------------------------------------------------ */

export const educationItemSchema = z.object({
  university: z.string().min(1, 'onboarding.errors.universityRequired'),
  degree: z.string().min(1, 'onboarding.errors.degreeRequired'),
  degreeType: z.string().min(1, 'onboarding.errors.degreeTypeRequired'),
  specialization: z.string().max(120),
  yearFrom: z.string(),
  yearTo: z.string(),
});

export type EducationItemInput = z.infer<typeof educationItemSchema>;

export const educationSchema = z
  .object({
    hasNone: z.boolean(),
    educations: z.array(educationItemSchema),
  })
  .refine((v) => v.hasNone || v.educations.length > 0, {
    path: ['educations'],
    message: 'onboarding.errors.educationRequired',
  });

export type EducationInput = z.infer<typeof educationSchema>;

/* ------------------------------------------------------------------ */
/* Step 5 — Description                                                */
/* ------------------------------------------------------------------ */

/**
 * The profile description is captured as four guided sections (an accordion
 * checklist), each saved into one field. The order here drives the UI order
 * and the per-section min/max character limits below.
 */
export const DESCRIPTION_SECTIONS = [
  'introduction',
  'experience',
  'motivation',
  'headline',
] as const;

export type DescriptionSection = (typeof DESCRIPTION_SECTIONS)[number];

/** Min/max character bounds per section — `min` gates the checkmark, `max`
 *  caps the textarea and feeds the live `count / max` counter. */
export const DESCRIPTION_LIMITS: Record<
  DescriptionSection,
  { min: number; max: number }
> = {
  introduction: { min: 50, max: 700 },
  experience: { min: 50, max: 700 },
  motivation: { min: 50, max: 700 },
  headline: { min: 10, max: 400 },
};

export const descriptionSchema = z.object({
  introduction: z
    .string()
    .trim()
    .min(50, 'onboarding.errors.introductionTooShort')
    .max(700, 'onboarding.errors.descriptionTooLong'),
  experience: z
    .string()
    .trim()
    .min(50, 'onboarding.errors.experienceTooShort')
    .max(700, 'onboarding.errors.descriptionTooLong'),
  motivation: z
    .string()
    .trim()
    .min(50, 'onboarding.errors.motivationTooShort')
    .max(700, 'onboarding.errors.descriptionTooLong'),
  headline: z
    .string()
    .trim()
    .min(10, 'onboarding.errors.headlineTooShort')
    .max(400, 'onboarding.errors.descriptionTooLong'),
});

export type DescriptionInput = z.infer<typeof descriptionSchema>;

/* ------------------------------------------------------------------ */
/* Step 6 — Video                                                      */
/* ------------------------------------------------------------------ */

export const videoSchema = z.object({
  url: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https?:\/\/.+/.test(v), {
      message: 'onboarding.errors.videoUrlInvalid',
    }),
});

export type VideoInput = z.infer<typeof videoSchema>;

/* ------------------------------------------------------------------ */
/* Step 7 — Availability (timezone + weekly working hours)             */
/* ------------------------------------------------------------------ */

/** A single working block on a day, as 24h "HH:MM" strings. */
export const timeRangeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
});

export type TimeRange = z.infer<typeof timeRangeSchema>;

/** One weekday: whether the tutor works, and the blocks they're available. */
export const dayAvailabilitySchema = z.object({
  enabled: z.boolean(),
  slots: z.array(timeRangeSchema),
});

export type DayAvailability = z.infer<typeof dayAvailabilitySchema>;

/** The whole week, keyed by weekday id ("Mon" … "Sun"). */
export type WeeklySchedule = Record<string, DayAvailability>;

export const availabilitySchema = z
  .object({
    timezone: z.string().min(1, 'onboarding.errors.timezoneRequired'),
    schedule: z.record(z.string(), dayAvailabilitySchema),
  })
  .refine(
    (v) =>
      Object.values(v.schedule).some((d) => d.enabled && d.slots.length > 0),
    {
      path: ['schedule'],
      message: 'onboarding.errors.availabilityRequired',
    },
  );

export type AvailabilityValue = z.infer<typeof availabilitySchema>;

/* ------------------------------------------------------------------ */
/* Step 8 — Pricing                                                    */
/* ------------------------------------------------------------------ */

export const pricingSchema = z.object({
  hourlyRate: z
    .number({ message: 'onboarding.errors.rateInvalid' })
    .int('onboarding.errors.rateInvalid')
    .min(3, 'onboarding.errors.rateTooLow')
    .max(200, 'onboarding.errors.rateTooHigh'),
});

export type PricingInput = z.infer<typeof pricingSchema>;

/* ------------------------------------------------------------------ */
/* Aggregate application record (what `GET /tutor-application` returns) */
/* ------------------------------------------------------------------ */

export interface TutorApplication {
  about: AboutInput;
  photo: PhotoInput;
  certification: CertificationInput;
  education: EducationInput;
  description: DescriptionInput;
  video: VideoInput;
  availability: AvailabilityValue;
  pricing: { hourlyRate: number; currency: string };
  /** Steps the tutor has saved at least once — drives the stepper checkmarks. */
  completedSteps: StepId[];
  submitted: boolean;
}

/** The per-step payload shapes, keyed by step id (used by the save mutation). */
export interface StepPayloads {
  about: AboutInput;
  photo: PhotoInput;
  certification: CertificationInput;
  education: EducationInput;
  description: DescriptionInput;
  video: VideoInput;
  availability: AvailabilityValue;
  pricing: PricingInput;
}
