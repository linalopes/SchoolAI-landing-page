import type { APIRoute } from 'astro';
import { requirePage } from '../lib/content';

/**
 * Compatibility JSON endpoint formerly served from public/room-for-interaction.json.
 * Editorial source of truth is src/content/pages/room-for-interaction.md.
 */
export const GET: APIRoute = async () => {
  const entry = await requirePage('room-for-interaction');
  const copy = entry.data.room_for_interaction;
  if (!copy) {
    return new Response(JSON.stringify({ error: 'Missing room_for_interaction content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const payload = {
    program: {
      title: entry.data.title,
      subtitle: copy.workshops_section.title_lines.join(' '),
      tagline: copy.hero.tagline,
      description: [copy.about.lead, copy.about.curiosity].join('\n\n'),
      format: copy.format.paragraphs[0],
      location: [copy.location.venue_name, ...copy.location.address_lines].join(', '),
      status: 'archived',
      archive_note: copy.about.archive_note,
    },
    workshops: copy.workshops.map((workshop) => ({
      id: workshop.id,
      title: workshop.title,
      subtitle: workshop.subtitle,
      description: workshop.summary,
      icon: workshop.icon ?? null,
      color: workshop.color ?? null,
      status: workshop.status,
      status_label: workshop.status_label,
      status_note: workshop.status_note,
      schedule: {
        online: {
          title: workshop.schedule.online_title,
          time: workshop.schedule.online_time ?? null,
          dates: workshop.schedule.online_dates ?? null,
        },
        inPerson: {
          title: workshop.schedule.in_person_title,
          time: workshop.schedule.in_person_time ?? null,
          dates: workshop.schedule.in_person_dates,
        },
      },
      content: {
        description: workshop.description,
        whatYoullLearn: workshop.learning_objectives,
        whoShouldJoin: workshop.audience,
      },
      // Historical registration URLs retained for compatibility only — not active CTAs.
      lumaEventUrl: workshop.historical_luma_url ?? null,
      lumaEmbedUrl: workshop.historical_luma_embed_url ?? null,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
