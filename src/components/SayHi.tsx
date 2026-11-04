import Section from './Section';
import CopyHandle from './CopyHandle';
import BracketLinks from './BracketLinks';
import { t, type Lang } from '../i18n';
import { socials } from '../data/site';

export default function SayHi({ lang }: { lang: Lang }) {
  const tr = t(lang);
  const mail = tr.about.mail;

  return (
    <Section id="say-hi" title={mail.title}>
      <p className="mt-2 leading-relaxed text-muted">{mail.subtitle}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CopyHandle lang={lang} />
        <BracketLinks items={socials} />
      </div>
    </Section>
  );
}
