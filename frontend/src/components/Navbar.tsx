const LINKS = ["Home", "Job Posting", "Event Scheduling", "Profile"];

export function Navbar({
  username,
  onLogout,
}: {
  username?: string;
  onLogout?: () => void;
}) {
  const badge = username ? username.slice(0, 2).toUpperCase() : "ML";
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-forest">
            <span className="h-1.5 w-1.5 rounded-full bg-forest" />
          </span>
          <span className="font-serif text-lg font-semibold text-ink">Waypoint</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {LINKS.map((link) => (
            <a key={link} href="#" className="transition hover:text-ink">
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="text-sm text-muted transition hover:text-ink"
            >
              Log out
            </button>
          )}
          <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-xs font-medium text-white">
            {badge}
          </span>
        </div>
      </div>
    </header>
  );
}
