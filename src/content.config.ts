import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const wishlist = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/wishlist' }),
  schema: z.object({
    title: z.string(),
    id: z.string(),
    contribution_type: z.enum([
      'material',
      'equipment',
      'access',
      'time',
      'expertise',
      'financial',
    ]),
    status: z.enum(['open', 'fulfilled', 'paused']),
    published: z.boolean(),
    updated_at: z.coerce.date(),
    target_amount_chf: z.number().optional(),
    quantity: z.string().optional(),
    external_url: z.string().url().optional(),
    image_url: z.string().url().optional(),
    image_alt: z.string().optional(),
  }),
});

export const collections = { pages, wishlist };
