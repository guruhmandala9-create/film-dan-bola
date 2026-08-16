import PageHeader from "@/components/PageHeader";
import { CardGridSkeleton, PosterGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <PageHeader title="Sudah Ditonton" description="Riwayat film dan film klasik yang sudah kamu tonton." />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <CardGridSkeleton count={3} />
        <div className="mt-10">
          <PosterGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}
