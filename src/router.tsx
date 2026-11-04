import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './styles/global.css';

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    // Keep URLs identical to the old Astro output: /en/projects/
    trailingSlash: 'always',
    defaultPreload: 'intent',
    // Jump to the top instantly on navigation instead of animating the
    // reset (scroll-behavior: smooth on <html> otherwise animates it).
    scrollRestorationBehavior: 'instant',
    // Same for hash navigation (e.g. /en/#say-hi): land instantly on the
    // target section instead of scrolling through the page visibly.
    defaultHashScrollIntoView: { behavior: 'instant', block: 'start' },
  });
}
