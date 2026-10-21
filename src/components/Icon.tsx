const PATHS = {
  home: '<path d="M2.5 7.8L8 3.2l5.5 4.6V13a.8.8 0 0 1-.8.8H3.3a.8.8 0 0 1-.8-.8V7.8z"/>',
  book: '<path d="M3 3.5h4.2a1.6 1.6 0 0 1 1.6 1.6V13a1.4 1.4 0 0 0-1.4-1.4H3V3.5zM13 3.5H8.8A1.6 1.6 0 0 0 7.2 5.1V13a1.4 1.4 0 0 1 1.4-1.4H13V3.5z"/>',
  target: '<circle cx="8" cy="8" r="5.4"/><circle cx="8" cy="8" r="2.2"/>',
  flag: '<path d="M4 2.5v11M4 3.2h7.4l-1.6 2.4 1.6 2.4H4"/>',
  chart: '<path d="M3 13V9M6.4 13V5.5M9.8 13V7.5M13.2 13V3.5"/>',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = 'nav-ico' }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}
