export default function SearchBox({
  action,
  placeholder,
  defaultValue,
  hiddenParams,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  /** Other active filters (e.g. city/team) to preserve across a search submit. */
  hiddenParams?: Record<string, string | undefined>;
}) {
  return (
    <form action={action} className="mb-4">
      {Object.entries(hiddenParams ?? {}).map(
        ([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />
      )}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full max-w-sm rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </form>
  );
}
