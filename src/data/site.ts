/**
 * Site configuration and public integration endpoints.
 * Institutional narrative, rental rates, payment copy and page CTAs live in Markdown.
 */
export const site = {
  title: "School of Tomorrow's AI",
  lang: 'en',
  url: 'https://schoolai.linalopes.info',
  cname: 'schoolai.linalopes.info',
  locationLine: 'Wetzikon-Zürich, Switzerland',
  founded: 'September 2025',
  contactEmail: 'lilothink.science@gmail.com',
  founderUrl: 'https://www.linalopes.info/',
  researchNotebookUrl: 'https://emotion.linalopes.info/',
  researchArchiveUrl: 'https://blog.linalopes.info/',
} as const;

/** Authorised functional media exceptions (not editorial photography). */
export const authorisedFunctionalMedia = [
  'public/imgs/contact-twint.png',
  'public/imgs/stripe.png',
] as const;
