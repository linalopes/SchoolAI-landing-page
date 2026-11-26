export type CsvRow = Record<string, string>;

export type HeroAccent = 'pink' | 'white' | 'turquoise';

export type HeroSlide = {
  type: string;
  title: string;
  tagline: string;
  imageUrl: string | null;
  ctaLabel: string;
  ctaUrl: string | null;
  accent: HeroAccent;
};

export type EventItem = {
  date: string;
  time: string;
  title: string;
  tagline: string;
  location: string;
  type: string;
  status: string;
  url: string | null;
};

export type ArchiveEntry = {
  id: string;
  title: string;
  year: number;
  category: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string | null;
  url: string;
  githubUrl: string | null;
  featured: boolean;
  published: boolean;
  order: number;
};

export type WorkstationEntry = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string | null;
  order: number;
  published: boolean;
};

export type ContributorCategory =
  | 'supporter'
  | 'institutional-support'
  | 'research-collaborator'
  | 'technology-partner';

export type ContributorEntry = {
  id: string;
  name: string;
  category: ContributorCategory;
  url: string | null;
  year: number;
  order: number;
  published: boolean;
};

export type FeedId = 'hero' | 'events' | 'archive' | 'workstations' | 'contributors';

export type FeedSnapshot<T> = {
  feed: FeedId;
  fetchedAt: string;
  sourceUrl: string;
  itemCount: number;
  items: T[];
};

export type FeedResult<T> = {
  items: T[];
  warnings: string[];
};

export class FeedValidationError extends Error {
  readonly details: string[];

  constructor(message: string, details: string[] = []) {
    super(details.length ? `${message}: ${details.join('; ')}` : message);
    this.name = 'FeedValidationError';
    this.details = details;
  }
}
