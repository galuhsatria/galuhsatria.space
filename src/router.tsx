import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './styles/global.css';

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    // Keep URLs identical to the old Astro output: /en/projects/
    trailingSlash: 'always',
    defaultPreload: 'intent',
  });
}
