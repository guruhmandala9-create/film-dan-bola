import PageHeader from "@/components/PageHeader";
import { ListRowSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <PageHeader
        title="Kalender"
        description="Satu tampilan kalender yang menggabungkan jadwal film dan jadwal bola yang sudah kamu tandai."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <ListRowSkeleton count={4} />
      </div>
    </div>
  );
}
