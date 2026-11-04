interface HeadingProps {
  level?: 2 | 3;
  children: React.ReactNode;
}

export default function Heading({ level = 2, children }: HeadingProps) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag
      className={
        level === 2
          ? 'font-mono text-[1.5rem] font-normal text-balance'
          : 'font-mono text-[1.125rem] font-normal text-balance'
      }
    >
      <span className="font-mono font-normal text-dim" aria-hidden={true}>{'#'.repeat(level)} </span>
      {children}
    </Tag>
  );
}
