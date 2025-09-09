interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="Search folktales..."
      className="border p-2 mb-6 w-full rounded"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
