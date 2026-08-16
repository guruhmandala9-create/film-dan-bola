import PageHeader from "@/components/PageHeader";
import ComingSoon from "@/components/ComingSoon";

export default function JadwalBolaPage() {
  return (
    <div>
      <PageHeader
        title="Jadwal Bola"
        description="Jadwal pertandingan dari liga-liga populer, dengan filter tim favorit."
      />
      <ComingSoon note="Daftar pertandingan, filter tim favorit, dan detail pertandingan akan dibangun di Fase 2." />
    </div>
  );
}
