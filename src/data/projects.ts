import data from './projects.json';

export type Project = {
  id: string;
  featured: boolean;
  image: string | null;
  imageAlt: { en: string; id: string } | null;
  url: string | null;
  source: string | null;
  name: { en: string; id: string };
  description: { en: string; id: string };
};

export const projects = data as Project[];
