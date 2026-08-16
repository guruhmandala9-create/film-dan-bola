export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      {/* film reel */}
      <svg
        viewBox="0 0 100 100"
        className="absolute -right-6 top-6 h-40 w-40 text-primary opacity-[0.08] sm:h-56 sm:w-56"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="50" cy="50" r="47" />
        <circle cx="50" cy="50" r="11" />
        <circle cx="50" cy="15" r="9" />
        <circle cx="81" cy="33" r="9" />
        <circle cx="81" cy="67" r="9" />
        <circle cx="50" cy="85" r="9" />
        <circle cx="19" cy="67" r="9" />
        <circle cx="19" cy="33" r="9" />
      </svg>

      {/* football */}
      <svg
        viewBox="0 0 100 100"
        className="absolute -bottom-10 left-0 h-36 w-36 text-secondary opacity-[0.08] sm:h-48 sm:w-48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="50" cy="50" r="47" />
        <polygon points="50,30 65,42 59,60 41,60 35,42" />
        <line x1="50" y1="30" x2="50" y2="4" />
        <line x1="65" y1="42" x2="88" y2="30" />
        <line x1="59" y1="60" x2="71" y2="88" />
        <line x1="41" y1="60" x2="29" y2="88" />
        <line x1="35" y1="42" x2="12" y2="30" />
      </svg>
    </div>
  );
}
