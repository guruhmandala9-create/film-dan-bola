import PageHeader from "@/components/PageHeader";
import { PosterGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <PageHeader
        title="Film Klasik Dunia"
        description="Film-film lawas dari berbagai negara, lengkap dengan rating IMDb — data diambil dari OMDb API."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <PosterGridSkeleton count={8} />
      </div>
    </div>
  );
}
