import PageHeader from "@/components/PageHeader";
import ComingSoon from "@/components/ComingSoon";

export default function ProfilPage() {
  return (
    <div>
      <PageHeader
        title="Profil"
        description="Kelola akun, preferensi tim/genre favorit, dan tontonan yang sudah ditandai."
      />
      <ComingSoon note="Autentikasi, onboarding preferensi, dan watchlist akan dibangun di Fase 2 & 3." />
    </div>
  );
}
