import * as z from 'zod';

export const projectFormSchema = z.object({
  name: z.string(),
  userId: z.string().cuid(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
