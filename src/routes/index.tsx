import { createFileRoute, redirect } from '@tanstack/react-router';

/* "/" sends visitors to the default language. */
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    /* Permanent redirect: the root is not a page, only a language entry point. */
    throw redirect({ href: '/en/', statusCode: 301 } as never);
  },
});
