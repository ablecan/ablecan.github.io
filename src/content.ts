/**
 * All site content lives here. Edit this file to update the website —
 * no layout code needs to change. The page is rendered to static HTML
 * at build time from this data (see src/render.ts).
 *
 * Every claim on the site must trace back to the resume PDF.
 */

export interface Link {
  label: string;
  href: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Role {
  title: string;
  organization: string;
  start: string;
  end: string;
  /** Machine-readable dates for <time datetime>, e.g. "2026-01". */
  startISO: string;
  endISO: string;
  points: string[];
}

export interface Education {
  credential: string;
  institution: string;
  start: string;
  end: string;
  startISO: string;
  endISO: string;
  details: string[];
}

export interface Language {
  name: string;
  level: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  /** Optional links — omit either one if it doesn't exist. */
  repo?: string;
  live?: string;
}

/** A short fact shown in the hero's "at a glance" panel. */
export interface Highlight {
  label: string;
  value: string;
  note?: string;
}

export interface Content {
  site: {
    url: string;
    title: string;
    description: string;
    ogImage: string;
    ogImageAlt: string;
    /** BCP 47 language tag and text direction — ready for an Arabic version later. */
    lang: string;
    dir: 'ltr' | 'rtl';
  };
  person: {
    name: string;
    shortName: string;
    role: string;
    intro: string;
    location: string;
    email: string;
    github: Link;
    linkedin: Link;
  };
  resume: {
    /** Path of the PDF inside /public. */
    href: string;
    downloadName: string;
  };
  highlights: Highlight[];
  about: string[];
  skills: SkillGroup[];
  experience: Role[];
  education: Education[];
  certifications: string[];
  languages: Language[];
  projects: Project[];
}

export const content: Content = {
  site: {
    url: 'https://ablecan.github.io/',
    title: 'Turki Aljohani — Programming & Computer Science Graduate',
    description:
      'Turki Abdullah Aljohani — Programming and Computer Science graduate from Umm Al-Qura University (GPA 3.92/4.00), with a foundation in Java, SQL, and Linux. Based in Makkah, Saudi Arabia.',
    ogImage: 'https://ablecan.github.io/og.png',
    ogImageAlt: 'Turki Abdullah Aljohani — Programming & Computer Science Graduate, Makkah, Saudi Arabia',
    lang: 'en',
    dir: 'ltr',
  },

  person: {
    name: 'Turki Abdullah Aljohani',
    shortName: 'Turki Aljohani',
    role: 'Programming & Computer Science Graduate',
    intro:
      'Programming and Computer Science graduate with a strong foundation in Java, SQL, Linux, and software development fundamentals.',
    location: 'Makkah, Saudi Arabia',
    email: 'turki.a.aljohani0@gmail.com',
    github: { label: 'github.com/ablecan', href: 'https://github.com/ablecan' },
    linkedin: {
      label: 'linkedin.com/in/turki-aljohani-6b0188303',
      href: 'https://www.linkedin.com/in/turki-aljohani-6b0188303',
    },
  },

  resume: {
    href: '/Turki_Aljohani_Resume.pdf',
    downloadName: 'Turki_Aljohani_Resume.pdf',
  },

  /** Hero "at a glance" panel — keep each fact traceable to the resume. */
  highlights: [
    { label: 'GPA', value: '3.92 / 4.00', note: 'Umm Al-Qura University' },
    { label: 'Graduated', value: 'June 2026', note: 'Diploma in Programming and Computer Science' },
    { label: 'Co-op', value: 'Saudi Aramco', note: 'January – April 2026' },
  ],

  about: [
    'I’m a Programming and Computer Science graduate from Umm Al-Qura University, where I completed a Diploma in Programming and Computer Science in June 2026 with a 3.92/4.00 GPA.',
    'My foundation is in Java, SQL, Linux, and software development fundamentals. Through a cooperative training program at Saudi Aramco, I gained hands-on experience in reporting, database management, office automation, and information security compliance.',
  ],

  skills: [
    { name: 'Languages', items: ['Java', 'PHP', 'HTML', 'CSS'] },
    { name: 'Databases', items: ['SQL', 'MySQL', 'Microsoft Access'] },
    { name: 'Tools & Build', items: ['Git', 'GitHub', 'Gradle', 'Maven', 'IntelliJ IDEA'] },
    { name: 'Infrastructure & Systems', items: ['Linux', 'Docker', 'RabbitMQ'] },
    { name: 'Productivity & Automation', items: ['Microsoft Excel', 'VBA Macros'] },
  ],

  experience: [
    {
      title: 'Cooperative Trainee',
      organization: 'Saudi Aramco',
      start: 'January 2026',
      end: 'April 2026',
      startISO: '2026-01',
      endISO: '2026-04',
      points: [
        'Prepared and maintained Excel reports and operational documentation.',
        'Managed operational information using Microsoft Access databases.',
        'Automated email distribution processes using VBA macros.',
        'Conducted bi-weekly information security compliance inspections.',
        'Supported daily administrative and operational activities.',
      ],
    },
  ],

  education: [
    {
      credential: 'Diploma in Programming and Computer Science',
      institution: 'Umm Al-Qura University',
      start: 'August 2024',
      end: 'June 2026',
      startISO: '2024-08',
      endISO: '2026-06',
      details: ['GPA: 3.92/4.00'],
    },
  ],

  certifications: ['CompTIA Linux+: Daemons & Processes', 'Cloud Services: Cloud Computing Concepts'],

  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Advanced' },
  ],

  /**
   * Projects — the section stays hidden while this array is empty and
   * appears automatically (in the page and the nav) once you add one.
   *
   * Template — copy, uncomment, and fill in:
   *
   * {
   *   title: 'Project name',
   *   description: 'One or two sentences on what it does and what you built.',
   *   tech: ['Java', 'MySQL', 'Docker'],
   *   repo: 'https://github.com/ablecan/project-name',   // optional
   *   live: 'https://ablecan.github.io/project-name/',   // optional
   * },
   */
  projects: [],
};
