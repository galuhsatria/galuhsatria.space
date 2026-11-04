import { Outlet, createFileRoute, notFound, rootRouteId } from '@tanstack/react-router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NotFound from '../../components/NotFound';
import { graphSchema, jsonLdScript, personSchema, websiteSchema } from '../../lib/seo';
import type { Lang } from '../../i18n';

const languages: Lang[] = ['en', 'id'];

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    /* Unknown language prefixes are real 404s handled by the root shell. */
    if (!languages.includes(params.lang as Lang)) {
      throw notFound({ routeId: rootRouteId });
    }
  },
  head: () => ({
    scripts: [jsonLdScript(graphSchema(personSchema(), websiteSchema()))],
  }),
  notFoundComponent: NotFound,
  component: LangLayout,
});

function LangLayout() {
  const { lang } = Route.useParams();
  return (
    <>
      <Header lang={lang as Lang} />
      <main id="main" className="shell pb-24">
        <Outlet />
      </main>
      <Footer lang={lang as Lang} />
    </>
  );
}
