"use client";

interface CollectionSelectorProps {
  collections: string[];
  selected: string | null;
  onSelect: (collection: string) => void;
}

export default function CollectionSelector({
  collections,
  selected,
  onSelect
}: CollectionSelectorProps) {
  const icons: { [key: string]: string } = {
    donors: "💰",
    messages: "💬",
    subscribers: "👥",
    volunteers: "🙋"
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
        Collections
      </h3>
      <div className="space-y-2">
        {collections.map((collection) => (
          <button
            key={collection}
            onClick={() => onSelect(collection)}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium capitalize flex items-center gap-3 ${
              selected === collection
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-700 text-slate-300"
            }`}
          >
            <span>{icons[collection]}</span>
            {collection}
          </button>
        ))}
      </div>
    </div>
  );
}
