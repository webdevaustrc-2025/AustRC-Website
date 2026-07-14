import { z } from 'zod';

/*
 * The database contains PostgreSQL-compatible UUID-shaped IDs such as:
 *
 * 10000000-0000-0000-0000-000000000001
 *
 * These values have the correct UUID/GUID structure, but they do not satisfy
 * the RFC version and variant rules enforced by z.uuid().
 *
 * z.guid() validates the identifier structure without requiring a specific
 * UUID version or variant.
 */
const questionIdSchema = z.guid({
  error: 'Invalid question ID.',
});

const teamIdSchema = z.guid({
  error: 'Invalid team ID.',
});

/*
 * LinkedIn is optional.
 *
 * An empty string is converted to null before it reaches the service layer.
 */
const optionalLinkedInUrl = z
  .union([
    z.literal(''),

    z
      .url({
        error: 'Enter a valid LinkedIn URL.',
      })
      .refine(
        (value) =>
          /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(value),
        {
          error: 'The URL must be a LinkedIn profile URL.',
        },
      ),
  ])
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  });

/*
 * One answer submitted for one screening question.
 *
 * Text-based questions use answerText.
 * Multiple-choice questions may use answerJson.
 */
const answerSchema = z
  .object({
    questionId: questionIdSchema,

    answerText: z
      .string()
      .trim()
      .max(5000, {
        error: 'An answer cannot contain more than 5,000 characters.',
      })
      .nullable()
      .optional(),

    answerJson: z
      .array(
        z
          .string()
          .trim()
          .min(1, {
            error: 'Selected answer values cannot be empty.',
          })
          .max(250, {
            error: 'A selected answer cannot exceed 250 characters.',
          }),
      )
      .max(30, {
        error: 'A maximum of 30 options can be selected.',
      })
      .nullable()
      .optional(),
  })
  .refine(
    (answer) => {
      const hasText =
        typeof answer.answerText === 'string' &&
        answer.answerText.trim().length > 0;

      const hasJson =
        Array.isArray(answer.answerJson) &&
        answer.answerJson.length > 0;

      return hasText || hasJson;
    },
    {
      error: 'Each submitted answer must contain a value.',
    },
  );

/*
 * Validates the complete registration submission body.
 */
export const createApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, {
      error: 'Full name must contain at least 2 characters.',
    })
    .max(150, {
      error: 'Full name cannot exceed 150 characters.',
    }),

  departmentId: z.coerce
    .number()
    .int({
      error: 'Department ID must be an integer.',
    })
    .positive({
      error: 'Select a valid department.',
    }),

  studentId: z
    .string()
    .trim()
    .min(3, {
      error: 'Student ID must contain at least 3 characters.',
    })
    .max(50, {
      error: 'Student ID cannot exceed 50 characters.',
    }),

  semesterId: z.coerce
    .number()
    .int({
      error: 'Semester ID must be an integer.',
    })
    .positive({
      error: 'Select a valid semester.',
    }),

  teamId: teamIdSchema,

  eduEmail: z
    .email({
      error: 'Enter a valid educational email address.',
    })
    .max(255, {
      error: 'Educational email cannot exceed 255 characters.',
    }),

  personalEmail: z
    .email({
      error: 'Enter a valid personal email address.',
    })
    .max(255, {
      error: 'Personal email cannot exceed 255 characters.',
    }),

  phoneNumber: z
    .string()
    .trim()
    .min(7, {
      error: 'Phone number must contain at least 7 characters.',
    })
    .max(20, {
      error: 'Phone number cannot exceed 20 characters.',
    })
    .regex(/^[+0-9()\-\s]+$/, {
      error: 'Enter a valid phone number.',
    }),

  linkedinUrl: optionalLinkedInUrl,

  answers: z
    .array(answerSchema)
    .max(100, {
      error: 'A maximum of 100 answers can be submitted.',
    })
    .optional()
    .default([]),

  submissionData: z
    .record(z.string(), z.any())
    .optional()
    .nullable(),
});

/*
 * Validates:
 * GET /api/teams/:teamId/questions
 */
export const teamIdParamsSchema = z.object({
  teamId: teamIdSchema,
});

/*
 * Validates:
 * GET /api/applications/:applicationNumber/status
 */
export const applicationStatusParamsSchema = z.object({
  applicationNumber: z
    .string()
    .trim()
    .min(5, {
      error: 'Invalid application number.',
    })
    .max(40, {
      error: 'Invalid application number.',
    }),
});

/*
 * Validates the Student ID query parameter used for status checking.
 */
export const applicationStatusQuerySchema = z.object({
  studentId: z
    .string()
    .trim()
    .min(3, {
      error: 'Student ID must contain at least 3 characters.',
    })
    .max(50, {
      error: 'Student ID cannot exceed 50 characters.',
    }),
});

/*
 * Optional exported TypeScript types.
 */
export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>;

export type TeamIdParams = z.infer<typeof teamIdParamsSchema>;

export type ApplicationStatusParams = z.infer<
  typeof applicationStatusParamsSchema
>;

export type ApplicationStatusQuery = z.infer<
  typeof applicationStatusQuerySchema
>;