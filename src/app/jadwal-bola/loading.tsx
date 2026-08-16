import PageHeader from "@/components/PageHeader";
import { ListRowSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <PageHeader
        title="Jadwal Bola"
        description="Jadwal pertandingan dari liga-liga populer, dengan filter tim favorit."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <ListRowSkeleton count={7} />
      </div>
    </div>
  );
}
