import en from './en.json';
import id from './id.json';

export type Lang = 'en' | 'id';
export const languages: Lang[] = ['en', 'id'];

const dict = { en, id };
export const t = (lang: Lang) => dict[lang];

/* Strings that are not in en.json / id.json */
export const extra = {
  en: {
    minRead: 'min read',
    previewNote: 'Preview only: the form is not connected to an inbox yet, so nothing was sent.',
    footer: 'Made with TanStack Start and Tailwind CSS.',
    copy: 'Copy',
    copied: 'Copied',
    locale: 'en-GB',
  },
  id: {
    minRead: 'menit baca',
    previewNote: 'Hanya pratinjau: formulir belum terhubung ke kotak masuk, jadi tidak ada pesan yang terkirim.',
    footer: 'Dibuat dengan TanStack Start dan Tailwind CSS.',
    copy: 'Salin',
    copied: 'Tersalin',
    locale: 'id-ID',
  },
};

export const formatDate = (d: Date, lang: Lang) =>
  new Intl.DateTimeFormat(extra[lang].locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);

export const readMinutes = (body: string | undefined) =>
  Math.max(1, Math.round((body ?? '').split(/\s+/).length / 200));

/* Same page in the other language: /en/blog/ -> /id/blog/ */
export const switchLangPath = (pathname: string, to: Lang) => pathname.replace(/^\/(en|id)(?=\/|$)/, `/${to}`);
