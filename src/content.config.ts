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
    intro: z.string().optional(),
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
        /** Prefer shared src/content/site/location.md; kept optional for legacy. */
        address_lines: z.array(z.string()).optional(),
        maps_url: z.string().optional(),
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

    contributors: z
      .object({
        title: z.string(),
        intro: z.string(),
        closing: z.string(),
        note: z.string().optional(),
        categories: z.object({
          supporter: z.string(),
          'institutional-support': z.string(),
          'research-collaborator': z.string(),
          'technology-partner': z.string(),
        }),
        category_order: z
          .array(
            z.enum([
              'supporter',
              'institutional-support',
              'research-collaborator',
              'technology-partner',
            ]),
          )
          .optional(),
      })
      .optional(),

    wishlist_teaser: z
      .object({
        title: z.string(),
        intro: z.string(),
        cta: ctaSchema,
      })
      .optional(),

    wishlist: z
      .object({
        current_title: z.string(),
        current_empty: z.string(),
        fulfilled_title: z.string(),
        fulfilled_intro: z.string(),
        fulfilled_empty: z.string(),
        closing_title: z.string().optional(),
        closing: z.string(),
        reference_label: z.string(),
        fulfilled_credit_prefix: z.string(),
        contact_cta: ctaSchema,
        back_cta: ctaSchema,
        categories: z.object({
          equipment: z.string(),
          material: z.string(),
          access: z.string(),
          expertise: z.string(),
          time: z.string(),
          financial: z.string(),
        }),
        statuses: z.object({
          open: z.string(),
          'in-progress': z.string(),
          fulfilled: z.string(),
          paused: z.string(),
        }),
        cta_labels: z.object({
          equipment: z.string(),
          material: z.string(),
          access: z.string(),
          expertise: z.string(),
          time: z.string(),
          financial: z.string(),
        }),
        category_order: z
          .array(
            z.enum(['equipment', 'material', 'access', 'expertise', 'time', 'financial']),
          )
          .optional(),
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

    arduino_day: z
      .object({
        hero: z.object({
          kicker: z.string(),
          title_line: z.string(),
          title_emphasis: z.string(),
          sub: z.string(),
          primary_cta: ctaSchema,
          secondary_cta: ctaSchema,
          panel_title: z.string(),
          panel_body: z.string(),
          meta: z.array(
            z.object({
              label: z.string(),
              value: z.string(),
            }),
          ),
        }),
        marquee: z.array(z.string()),
        about: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          quote: z.string(),
          quote_emphasis: z.string().optional(),
          cite: z.string(),
          paragraphs: z.array(z.string()),
          tags: z.array(z.string()),
        }),
        challenge: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          intro: z.string(),
          prototype_title: z.string(),
          prototype_body: z.string(),
          variations_title: z.string(),
          variations_intro: z.string(),
          variations: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
            }),
          ),
        }),
        timeline: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          intro: z.string(),
          blocks: z.array(
            z.object({
              time: z.string(),
              title: z.string(),
              description: z.string(),
            }),
          ),
        }),
        access: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          audiences: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
            }),
          ),
        }),
        details: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          event_title: z.string(),
          event_rows: z.array(
            z.object({
              label: z.string(),
              value: z.string(),
            }),
          ),
          materials_title: z.string(),
          materials: z.array(z.string()),
        }),
        host: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          image: z.string(),
          image_alt: z.string(),
          caption: z.string(),
          name_line: z.string(),
          name_emphasis: z.string(),
          paragraphs: z.array(z.string()),
          links: z.array(ctaSchema),
        }),
        faq: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          items: z.array(
            z.object({
              question: z.string(),
              answer: z.string(),
            }),
          ),
        }),
        closing: z.object({
          kicker: z.string(),
          title_before: z.string(),
          title_emphasis: z.string(),
          body: z.string(),
          primary_cta: ctaSchema,
          secondary_cta: ctaSchema,
        }),
        page_nav: z
          .array(
            z.object({
              label: z.string(),
              href: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),

    room_for_interaction: z
      .object({
        hero: z.object({
          eyebrow: z.string(),
          title_line: z.string(),
          title_emphasis: z.string(),
          tagline: z.string(),
          meta: z.string(),
          primary_cta: ctaSchema,
          secondary_cta: ctaSchema,
        }),
        marquee: z.array(z.string()),
        about: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          lead: z.string(),
          curiosity: z.string(),
          archive_note: z.string(),
        }),
        format: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          paragraphs: z.array(z.string()),
        }),
        workshops_section: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          intro: z.string(),
          season_label: z.string(),
          season_value: z.string(),
          format_label: z.string(),
          format_value: z.string(),
          outcome_label: z.string(),
          outcome_value: z.string(),
        }),
        quote: z.object({
          text: z.string(),
          emphasis: z.string().optional(),
          cite: z.string(),
        }),
        location: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          venue_name: z.string(),
          address_lines: z.array(z.string()),
          maps_url: z.string(),
          maps_label: z.string(),
          paragraphs: z.array(z.string()),
        }),
        faq: z.object({
          number: z.string(),
          title_lines: titleLinesSchema,
          items: z.array(
            z.object({
              question: z.string(),
              answer: z.string(),
            }),
          ),
        }),
        closing: z.object({
          kicker: z.string(),
          title_before: z.string(),
          title_emphasis: z.string(),
          body: z.string(),
          newsletter_subject: z.string(),
        }),
        page_nav: z
          .array(
            z.object({
              label: z.string(),
              href: z.string(),
            }),
          )
          .optional(),
        workshops: z
          .array(
            z.object({
              id: z.string(),
              title: z.string(),
              subtitle: z.string(),
              summary: z.string(),
              color: z.string().optional(),
              status: z.enum(['completed', 'cancelled', 'proposed']),
              status_label: z.string(),
              status_note: z.string(),
              schedule: z.object({
                online_title: z.string(),
                online_dates: z.string().optional(),
                online_time: z.string().optional(),
                in_person_title: z.string(),
                in_person_dates: z.string(),
                in_person_time: z.string().optional(),
              }),
              description: z.string(),
              learning_objectives: z.array(z.string()),
              audience: z.string(),
              historical_luma_url: z.string().optional(),
            }),
          )
          .min(1),
      })
      .optional(),
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

const siteContent = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site' }),
  schema: z.discriminatedUnion('doc', [
    z.object({
      doc: z.literal('footer'),
      title: z.string(),
      tagline: z.string(),
      explore_label: z.string(),
      elsewhere_label: z.string(),
      copyright_name: z.string(),
      maps_label: z.string(),
      external_links: z.array(
        z.object({
          label: z.string(),
          href: z.string().startsWith('https://'),
          external: z.boolean().optional(),
        }),
      ),
      social_links: z.array(
        z.object({
          label: z.string(),
          href: z.string().startsWith('https://'),
        }),
      ),
    }),
    z.object({
      doc: z.literal('location'),
      venue: z.string(),
      street: z.string(),
      locality: z.string(),
      region_label: z.string(),
      maps_url: z.string().startsWith('https://'),
    }),
  ]),
});

export const collections = { pages, gallery, support, site: siteContent };
