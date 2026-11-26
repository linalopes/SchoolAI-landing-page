import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
  subject: z.string().optional(),
});

const titleLinesSchema = z.array(z.string()).min(1);

const photoSchema = z.object({
  url: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  order: z.number().int().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    eyebrow: z.string().optional(),
    lede: z.string().optional(),
    meta: z.string().optional(),
    aside_note: z.string().optional(),
    portrait_src: z.string().optional(),
    portrait_alt: z.string().optional(),

    hero: z
      .object({
        title_line: z.string(),
        title_emphasis: z.string(),
        tagline: z.string(),
        primary_cta: ctaSchema,
        secondary_cta: ctaSchema,
      })
      .optional(),

    marquee: z.array(z.string()).optional(),

    school: z
      .object({
        number: z.string(),
        title_lines: titleLinesSchema,
        intro: z.string(),
        callout: z.string(),
        ctas: z.array(ctaSchema),
      })
      .optional(),

    research: z
      .object({
        number: z.string(),
        title_lines: titleLinesSchema,
        intro: z.string(),
        callout: z.string(),
        ctas: z.array(ctaSchema),
      })
      .optional(),

    selected_research: z
      .object({
        number: z.string(),
        title_lines: titleLinesSchema,
        intro: z.string(),
        cta: ctaSchema,
      })
      .optional(),

    atelier: z
      .object({
        number: z.string(),
        title_lines: titleLinesSchema,
        intro: z.string(),
        location_name: z.string(),
        address_lines: z.array(z.string()),
        maps_url: z.string(),
        maps_label: z.string(),
        body: z.array(z.string()),
        cta: ctaSchema,
        tour_title: z.string().optional(),
        tour_hint: z.string().optional(),
        workstations_number: z.string().optional(),
        workstations_title_lines: titleLinesSchema.optional(),
        workstations_intro: z.string().optional(),
      })
      .optional(),

    programme: z
      .object({
        number: z.string(),
        title_lines: titleLinesSchema,
        intro: z.string(),
        cta: ctaSchema.optional(),
        offerings: z.array(
          z.object({
            id: z.string().optional(),
            tag: z.string(),
            title: z.string(),
            description: z.string(),
            href: z.string().optional(),
            cta_label: z.string().optional(),
          }),
        ),
        upcoming_title: z.string().optional(),
        upcoming_intro: z.string().optional(),
        formats_title: z.string().optional(),
        formats_intro: z.string().optional(),
        past_title: z.string().optional(),
        past_intro: z.string().optional(),
        past_more_label: z.string().optional(),
      })
      .optional(),

    gallery: z
      .object({
        number: z.string(),
        title_lines: titleLinesSchema,
        intro: z.string(),
        callout: z.string(),
        ctas: z.array(ctaSchema),
      })
      .optional(),

    collaborate: z
      .object({
        number: z.string(),
        title_lines: titleLinesSchema,
        intro: z.string(),
        note: z.string().optional(),
        cta: ctaSchema,
        teasers: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        ),
      })
      .optional(),

    newsletter: z
      .object({
        eyebrow: z.string(),
        title_line: z.string(),
        title_emphasis: z.string(),
        intro: z.string(),
        button_label: z.string(),
        success: z.string(),
        placeholder: z.string().optional(),
      })
      .optional(),

    flagship: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
        intro: z.string(),
        closing: z.string(),
        threads: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        ),
        notebook_cta: ctaSchema,
      })
      .optional(),

    open_research: z
      .object({
        title: z.string(),
        paragraphs: z.array(z.string()),
        contact_label: z.string().optional(),
      })
      .optional(),

    archive: z
      .object({
        title_lines: titleLinesSchema,
        intro: z.string(),
        cta: ctaSchema,
      })
      .optional(),

    pathways: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          subject: z.string(),
          cta_label: z.string().optional(),
        }),
      )
      .optional(),

    contact_section: z
      .object({
        title: z.string(),
        note: z.string(),
        ctas: z.array(ctaSchema),
      })
      .optional(),

    concept: z
      .object({
        title: z.string(),
        paragraphs: z.array(z.string()),
      })
      .optional(),

    rental_intro: z.string().optional(),
    rental_note: z.string().optional(),
    rental_categories: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          title: z.string(),
          description: z.string(),
          cta_label: z.string(),
          subject: z.string(),
        }),
      )
      .optional(),
    inquire_cta: ctaSchema.optional(),

    curatorial: z
      .object({
        title: z.string(),
        body: z.string(),
        cta: ctaSchema,
      })
      .optional(),

    photos: z.array(photoSchema).optional(),

    ctas: z.array(ctaSchema).optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    dimensions: z.object({
      area_m2: z.number(),
      width_m: z.number(),
      length_m: z.number(),
      label: z.string().optional(),
    }),
    categories: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    ),
    rates: z.array(
      z.object({
        period: z.string(),
        cultural_chf: z.number(),
        regular_chf: z.number(),
      }),
    ),
    table_caption: z.string().optional(),
    cultural_column: z.string(),
    regular_column: z.string(),
    period_column: z.string(),
    currency_note: z.string().optional(),
  }),
});

const support = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/support' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    intro: z.string(),
    disclaimer: z.string(),
    twint: z.object({
      enabled: z.boolean(),
      title: z.string(),
      description: z.string(),
      image: z.string(),
      image_alt: z.string(),
    }),
    stripe: z.object({
      enabled: z.boolean(),
      title: z.string(),
      description: z.string(),
      image: z.string(),
      image_alt: z.string(),
      payment_url: z.string(),
      cta_label: z.string(),
    }),
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
    external_url: z.string().optional(),
    image_url: z.string().optional(),
    image_alt: z.string().optional(),
  }),
});

export const collections = { pages, gallery, support, wishlist };
