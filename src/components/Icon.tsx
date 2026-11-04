import {
  siTypescript, siPhp, siReact, siNextdotjs, siTailwindcss, siNodedotjs,
  siNestjs, siLaravel, siInertia, siPrisma, siPostgresql, siSupabase,
} from 'simple-icons';

export type IconId =
  | 'typescript' | 'php' | 'react' | 'next' | 'tailwind' | 'node'
  | 'nestjs' | 'laravel' | 'inertia' | 'prisma' | 'postgres' | 'supabase';

const icons: Record<IconId, { path: string }> = {
  typescript: siTypescript,
  php: siPhp,
  react: siReact,
  next: siNextdotjs,
  tailwind: siTailwindcss,
  node: siNodedotjs,
  nestjs: siNestjs,
  laravel: siLaravel,
  inertia: siInertia,
  prisma: siPrisma,
  postgres: siPostgresql,
  supabase: siSupabase,
};

export default function Icon({ id }: { id: IconId }) {
  const icon = icons[id];
  if (!icon) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
