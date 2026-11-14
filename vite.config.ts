import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { content } from './src/content.ts';
import { render404Body, render404Head, renderHomeBody, renderHomeHead } from './src/render.ts';

/**
 * Renders src/content.ts into index.html and 404.html at build (and dev) time,
 * so the whole page is plain static HTML that works with JavaScript disabled.
 */
function staticContent(): Plugin {
  return {
    name: 'static-content',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const is404 = ctx.path.endsWith('404.html');
        return html
          .replace('%LANG%', content.site.lang)
          .replace('%DIR%', content.site.dir)
          .replace('<!--head-->', is404 ? render404Head(content) : renderHomeHead(content))
          .replace('<!--body-->', is404 ? render404Body(content) : renderHomeBody(content));
      },
    },
  };
}

/** Preloads the two fonts used above the fold, using their hashed build filenames. */
function preloadFonts(): Plugin {
  const wanted = ['ibm-plex-sans-latin-400-normal', 'ibm-plex-sans-latin-600-normal'];
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        return Object.keys(ctx.bundle)
          .filter((file) => file.endsWith('.woff2') && wanted.some((w) => file.includes(w)))
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

export default defineConfig({
  // User site (https://ablecan.github.io/) is served from the domain root.
  base: '/',
  // Static multi-page site: unknown paths 404 instead of falling back to index.html.
  appType: 'mpa',
  plugins: [staticContent(), preloadFonts()],
  build: {
    target: 'es2020',
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
