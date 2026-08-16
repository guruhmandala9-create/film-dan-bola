import PageHeader from "@/components/PageHeader";
import { CardGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <PageHeader
        title="Jadwal Film"
        description="Film yang tayang minggu ini dan yang akan datang, dengan filter kota/bioskop."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <CardGridSkeleton count={6} />
      </div>
    </div>
  );
}
