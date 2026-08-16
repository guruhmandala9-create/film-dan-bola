import PageHeader from "@/components/PageHeader";
import ComingSoon from "@/components/ComingSoon";

export default function JadwalFilmPage() {
  return (
    <div>
      <PageHeader
        title="Jadwal Film"
        description="Film yang tayang minggu ini dan yang akan datang, dengan filter kota/bioskop."
      />
      <ComingSoon note="Daftar film, filter kota/bioskop, dan detail film akan dibangun di Fase 2." />
    </div>
  );
}
