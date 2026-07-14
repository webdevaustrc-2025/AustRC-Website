import { z } from 'zod';

const questionIdSchema = z.guid({
  error: 'Invalid question ID.',
});

const teamIdSchema = z.guid({
  error: 'Invalid team ID.',
});

const facebookUrlSchema = z
  .url({
    error: 'Enter a valid Facebook profile URL.',
  })
  .refine(
    (value) =>
      /^https?:\/\/([a-z0-9-]+\.)?(facebook\.com|fb\.com)\//i.test(
        value,
      ),
    {
      error: 'The URL must be a Facebook profile URL.',
    },
  );

const answerSchema = z
  .object({
    questionId: questionIdSchema,

    answerText: z
      .string()
      .trim()
      .max(5000)
      .nullable()
      .optional(),

    answerJson: z
      .array(
        z.string().trim().min(1).max(250),
      )
      .max(30)
      .nullable()
      .optional(),

    otherText: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional(),
  })
  .refine(
    (answer) =>
      Boolean(
        answer.answerText?.trim() ||
          answer.answerJson?.length ||
          answer.otherText?.trim(),
      ),
    {
      error:
        'Each submitted answer must contain a value.',
    },
  );

const teamPreferenceSchema = z.object({
  teamId: teamIdSchema,

  preferenceOrder: z.union([
    z.literal(1),
    z.literal(2),
  ]),

  answers: z
    .array(answerSchema)
    .max(100)
    .default([]),
});
const strictEmailPattern =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const austEmailPattern =
  /^[A-Z0-9._%+-]+@aust\.edu$/i;

const personalEmailSchema = z
  .string()
  .trim()
  .max(
    255,
    'Personal email cannot exceed 255 characters.',
  )
  .regex(
    strictEmailPattern,
    'Enter a valid personal email address.',
  )
  .transform((value) =>
    value.toLowerCase(),
  );

const eduEmailSchema = z
  .string()
  .trim()
  .max(
    255,
    'Educational email cannot exceed 255 characters.',
  )
  .regex(
    austEmailPattern,
    'Educational email must end with @aust.edu.',
  )
  .transform((value) =>
    value.toLowerCase(),
  );

  const austrcIdSchema = z
  .string()
  .trim()
  .min(
    1,
    'Enter your AUSTRC ID. If you do not have one, write N/A.',
  )
  .max(
    50,
    'AUSTRC ID cannot exceed 50 characters.',
  )
  .transform((value) => {
    const compactValue =
      value.replace(/\s+/g, '');

    return /^(n\/a|na)$/i.test(
      compactValue,
    )
      ? 'N/A'
      : value;
  });

export const createApplicationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2)
      .max(150),

    departmentId: z.coerce
      .number()
      .int()
      .positive(),

studentId: z
  .string()
  .trim()
  .min(
    3,
    'Student ID is required.',
  )
  .max(50),

austrcId:
  austrcIdSchema,

    semesterId: z.coerce
      .number()
      .int()
      .positive(),

personalEmail: personalEmailSchema,
eduEmail: eduEmailSchema,

    phoneNumber: z
      .string()
      .trim()
      .min(7)
      .max(25)
      .regex(
        /^[+0-9()\-\s]+$/,
        'Enter a valid phone number.',
      ),

    presentAddress: z
      .string()
      .trim()
      .min(5)
      .max(2000),

    facebookUrl: facebookUrlSchema,

    workedWithAustrcBefore: z.boolean(),

    previousWorkDescription: z
      .string()
      .trim()
      .max(3000)
      .nullable()
      .optional(),

    teamPreferences: z
      .array(teamPreferenceSchema)
      .min(1)
      .max(2),
  })
  .superRefine((input, context) => {
    const firstPreferences =
      input.teamPreferences.filter(
        (preference) =>
          preference.preferenceOrder === 1,
      );

    if (firstPreferences.length !== 1) {
      context.addIssue({
        code: 'custom',
        path: ['teamPreferences'],
        message:
          'Exactly one first team preference is required.',
      });
    }

    const secondPreferences =
      input.teamPreferences.filter(
        (preference) =>
          preference.preferenceOrder === 2,
      );

    if (secondPreferences.length > 1) {
      context.addIssue({
        code: 'custom',
        path: ['teamPreferences'],
        message:
          'Only one second team preference is allowed.',
      });
    }

    const uniqueTeamIds = new Set(
      input.teamPreferences.map(
        (preference) => preference.teamId,
      ),
    );

    if (
      uniqueTeamIds.size !==
      input.teamPreferences.length
    ) {
      context.addIssue({
        code: 'custom',
        path: ['teamPreferences'],
        message:
          'First and second team preferences must be different.',
      });
    }

    if (
      input.workedWithAustrcBefore &&
      !input.previousWorkDescription?.trim()
    ) {
      context.addIssue({
        code: 'custom',
        path: ['previousWorkDescription'],
        message:
          'Describe your previous AUSTRC, ARC or RoboMania work.',
      });
    }
  });

export const teamIdParamsSchema = z.object({
  teamId: teamIdSchema,
});

export const applicationStatusParamsSchema =
  z.object({
    applicationNumber: z
      .string()
      .trim()
      .min(5)
      .max(40),
  });

export const applicationStatusQuerySchema =
  z.object({
    studentId: z
      .string()
      .trim()
      .min(3)
      .max(50),
  });

export type ValidatedCreateApplicationInput =
  z.infer<typeof createApplicationSchema>;