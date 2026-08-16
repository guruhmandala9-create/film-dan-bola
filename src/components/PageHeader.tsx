import BackButton from "./BackButton";

export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6">
      <BackButton />
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{description}</p>
    </div>
  );
}
