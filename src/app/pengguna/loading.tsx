import PageHeader from "@/components/PageHeader";
import { ListRowSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <PageHeader title="Cari Pengguna" description="Temukan dan lihat profil pengguna lain lewat username." />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <ListRowSkeleton count={4} />
      </div>
    </div>
  );
}
