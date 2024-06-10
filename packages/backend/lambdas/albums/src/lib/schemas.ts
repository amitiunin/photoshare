import { z } from 'zod';

export const RequestSchema = z.object({});
export type Event = z.infer<typeof RequestSchema>;

const ResponseSchema = z.array(
    z.object({
        id: z.string().uuid(),
        title: z.string(),
        thumbnails: z.array(
            z.object({
                photo_id: z.string().uuid(),
                url: z.string().url(),
            }),
        ),
        description: z.string().optional(),
    }),
);
export type Response = z.infer<typeof ResponseSchema>;
