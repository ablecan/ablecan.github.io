/**
 * Build-time renderer: turns src/content.ts into static HTML.
 * Runs inside Vite (see vite.config.ts) — never shipped to the browser.
 * Layout lives here; content lives in content.ts.
 */
import type { Content, Link } from './content.ts';

/* ---------- helpers ---------- */

const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const icon = {
  external:
    '<svg class="icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>',
  download:
    '<svg class="icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>',
  up:
    '<svg class="icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M8 13.5v-10M4.5 7 8 3.5 11.5 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>',
};

const newTab = '<span class="visually-hidden"> (opens in a new tab)</span>';

const extAttrs = 'target="_blank" rel="noopener noreferrer"';

/**
 * URL-like labels may break after "/" on narrow screens; the last segment
 * stays glued to the arrow icon so it never wraps onto a line by itself.
 */
const externalLink = (link: Link, cls = 'link'): string => {
  const parts = link.label.split('/');
  const last = parts.pop() ?? '';
  const lead = parts.map((p) => `${esc(p)}/<wbr>`).join('');
  return `<a class="${cls}" href="${esc(link.href)}" ${extAttrs}>${lead}<span class="nowrap">${esc(last)}${icon.external}</span>${newTab}</a>`;
};

const range = (start: string, end: string, startISO: string, endISO: string): string =>
  `<p class="dates"><time datetime="${startISO}">${esc(start)}</time><span aria-hidden="true"> – </span><span class="visually-hidden"> to </span><time datetime="${endISO}">${esc(end)}</time></p>`;

/* ---------- sections ---------- */

interface Section {
  id: string;
  label: string;
  nav?: string;
  body: string;
}

function sections(c: Content): Section[] {
  const list: Section[] = [];

  list.push({
    id: 'about',
    label: 'About',
    nav: 'About',
    body: `<div class="prose">${c.about
      .map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${esc(p)}</p>`)
      .join('')}</div>`,
  });

  list.push({
    id: 'skills',
    label: 'Skills',
    nav: 'Skills',
    body: `<dl class="skills">${c.skills
      .map(
        (g) =>
          `<div class="skills__row"><dt>${esc(g.name)}</dt><dd><ul class="inline-list">${g.items
            .map((s) => `<li>${esc(s)}</li>`)
            .join('')}</ul></dd></div>`,
      )
      .join('')}</dl>`,
  });

  list.push({
    id: 'experience',
    label: 'Experience',
    nav: 'Experience',
    body: c.experience
      .map(
        (r) => `<article class="entry">
  <header class="entry__head">
    <h3 class="entry__title">${esc(r.title)}</h3>
    <p class="entry__org">${esc(r.organization)}</p>
    ${range(r.start, r.end, r.startISO, r.endISO)}
  </header>
  <ul class="points">${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
</article>`,
      )
      .join(''),
  });

  list.push({
    id: 'education',
    label: 'Education',
    body: c.education
      .map(
        (e) => `<article class="entry">
  <header class="entry__head">
    <h3 class="entry__title">${esc(e.credential)}</h3>
    <p class="entry__org">${esc(e.institution)}</p>
    ${range(e.start, e.end, e.startISO, e.endISO)}
  </header>
  ${e.details.map((d) => `<p class="entry__detail">${esc(d)}</p>`).join('')}
</article>`,
      )
      .join(''),
  });

  list.push({
    id: 'credentials',
    label: 'Certifications & Languages',
    body: `<div class="split">
  <div>
    <h3 class="minor-heading">Certifications</h3>
    <ul class="plain-list">${c.certifications.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  </div>
  <div>
    <h3 class="minor-heading">Languages</h3>
    <dl class="pairs">${c.languages
      .map((l) => `<div><dt>${esc(l.name)}</dt><dd>${esc(l.level)}</dd></div>`)
      .join('')}</dl>
  </div>
</div>`,
  });

  if (c.projects.length > 0) {
    list.push({
      id: 'projects',
      label: 'Projects',
      nav: 'Projects',
      body: c.projects
        .map((p) => {
          const links = [
            p.repo ? externalLink({ label: 'Source', href: p.repo }) : '',
            p.live ? externalLink({ label: 'Live', href: p.live }) : '',
          ].filter(Boolean);
          return `<article class="entry project">
  <h3 class="entry__title">${esc(p.title)}</h3>
  <p class="project__desc">${esc(p.description)}</p>
  ${p.tech.length ? `<ul class="inline-list inline-list--mono">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  ${links.length ? `<p class="project__links">${links.join('')}</p>` : ''}
</article>`;
        })
        .join(''),
    });
  }

  list.push({
    id: 'contact',
    label: 'Contact',
    nav: 'Contact',
    body: `<p class="contact__lead">The best way to reach me is by email.</p>
<p class="contact__email"><a class="link link--large" href="mailto:${esc(c.person.email)}">${esc(c.person.email)}</a></p>
<dl class="pairs pairs--contact">
  <div><dt>GitHub</dt><dd>${externalLink(c.person.github)}</dd></div>
  <div><dt>LinkedIn</dt><dd>${externalLink(c.person.linkedin)}</dd></div>
  <div><dt>Location</dt><dd>${esc(c.person.location)}</dd></div>
</dl>`,
  });

  return list;
}

/* ---------- shared chrome ---------- */

function resumeButtons(c: Content): string {
  return `<a class="btn btn--primary" href="${esc(c.resume.href)}" ${extAttrs}>View Resume${icon.external}${newTab}</a>
<a class="btn" href="${esc(c.resume.href)}" download="${esc(c.resume.downloadName)}">Download Resume${icon.download}<span class="visually-hidden"> (PDF)</span></a>`;
}

function siteHeader(c: Content, navItems: { id: string; nav: string }[], prefix: string): string {
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <nav class="nav container" aria-label="Primary">
    <a class="nav__home" href="${prefix || '#top'}">
      <span class="nav__mark" aria-hidden="true">TA</span><span class="nav__name">${esc(c.person.shortName)}</span>
    </a>
    <ul class="nav__links">
      ${navItems.map((s) => `<li class="nav__item"><a href="${prefix}#${s.id}">${esc(s.nav)}</a></li>`).join('')}
      <li><a class="nav__resume" href="${esc(c.resume.href)}" ${extAttrs}>Resume${icon.external}${newTab}</a></li>
    </ul>
  </nav>
</header>`;
}

function siteFooter(c: Content, withTop: boolean): string {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <p>© ${year} ${esc(c.person.name)}</p>
    ${withTop ? `<p><a class="link link--quiet" href="#top">Back to top${icon.up}</a></p>` : `<p><a class="link link--quiet" href="/">Home</a></p>`}
  </div>
</footer>`;
}

/* ---------- head ---------- */

function commonHead(c: Content): string {
  return `<meta name="author" content="${esc(c.person.name)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0d0e10">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;
}

export function renderHomeHead(c: Content): string {
  const s = c.site;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.person.name,
    url: s.url,
    email: `mailto:${c.person.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Makkah', addressCountry: 'SA' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Umm Al-Qura University' },
    sameAs: [c.person.github.href, c.person.linkedin.href],
  };
  return `<title>${esc(s.title)}</title>
<meta name="description" content="${esc(s.description)}">
<link rel="canonical" href="${esc(s.url)}">
${commonHead(c)}
<meta property="og:type" content="profile">
<meta property="og:site_name" content="${esc(c.person.shortName)}">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.description)}">
<meta property="og:url" content="${esc(s.url)}">
<meta property="og:image" content="${esc(s.ogImage)}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(s.ogImageAlt)}">
<meta property="og:locale" content="en_US">
<meta property="profile:first_name" content="Turki">
<meta property="profile:last_name" content="Aljohani">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(s.title)}">
<meta name="twitter:description" content="${esc(s.description)}">
<meta name="twitter:image" content="${esc(s.ogImage)}">
<meta name="twitter:image:alt" content="${esc(s.ogImageAlt)}">
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`;
}

export function render404Head(c: Content): string {
  return `<title>Page not found — ${esc(c.person.shortName)}</title>
<meta name="description" content="This page doesn’t exist.">
<meta name="robots" content="noindex">
${commonHead(c)}`;
}

/* ---------- bodies ---------- */

export function renderHomeBody(c: Content): string {
  const list = sections(c);
  const navItems = list.filter((s): s is Section & { nav: string } => Boolean(s.nav));

  const hero = `<section class="hero container" aria-labelledby="hero-title">
  <p class="eyebrow">${esc(c.person.role)}</p>
  <h1 id="hero-title" class="hero__name">${esc(c.person.name)}</h1>
  <p class="hero__intro">${esc(c.person.intro)}</p>
  <p class="hero__location"><span class="visually-hidden">Location: </span>${esc(c.person.location)}</p>
  <div class="actions">
    ${resumeButtons(c)}
    <a class="btn btn--ghost" href="${esc(c.person.github.href)}" ${extAttrs}>GitHub${icon.external}${newTab}</a>
  </div>
</section>`;

  const body = list
    .map(
      (s, i) => `<section id="${s.id}" class="section container" aria-labelledby="${s.id}-title" data-reveal>
  <div class="section__label">
    <span class="section__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
    <h2 id="${s.id}-title" class="section__title">${esc(s.label)}</h2>
  </div>
  <div class="section__body">${s.body}</div>
</section>`,
    )
    .join('\n');

  return `<div id="top"></div>
${siteHeader(c, navItems, '')}
<main id="main" tabindex="-1">
${hero}
${body}
</main>
${siteFooter(c, true)}`;
}

export function render404Body(c: Content): string {
  const navItems = sections(c).filter((s): s is Section & { nav: string } => Boolean(s.nav));
  return `${siteHeader(c, navItems, '/')}
<main id="main" tabindex="-1" class="not-found container">
  <p class="eyebrow">Error 404</p>
  <h1 class="not-found__title">This page doesn’t exist.</h1>
  <p class="not-found__text">The link may be broken, or the page may have moved.</p>
  <div class="actions">
    <a class="btn btn--primary" href="/">Back to home</a>
    <a class="btn" href="${esc(c.resume.href)}" ${extAttrs}>View Resume${icon.external}${newTab}</a>
  </div>
</main>
${siteFooter(c, false)}`;
}
