import PageHeader from "@/components/PageHeader";
import { CardGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <PageHeader title="Tontonan Saya" description="Film dan pertandingan yang sudah kamu tandai untuk ditonton." />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <CardGridSkeleton count={3} />
        <div className="mt-10">
          <CardGridSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
