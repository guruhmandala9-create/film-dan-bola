export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} Jadwal<span className="text-primary">Nonton</span> — Jangan sampai ketinggalan nonton, film atau bola.
        </p>
        <p className="text-xs">MVP — dalam pengembangan</p>
      </div>
    </footer>
  );
}
