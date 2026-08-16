import PageHeader from "@/components/PageHeader";
import ComingSoon from "@/components/ComingSoon";

export default function KalenderPage() {
  return (
    <div>
      <PageHeader
        title="Kalender"
        description="Satu tampilan kalender yang menggabungkan jadwal film dan jadwal bola yang sudah kamu tandai."
      />
      <ComingSoon note="Kalender gabungan akan dibangun di Fase 3, setelah fitur watchlist tersedia." />
    </div>
  );
}
