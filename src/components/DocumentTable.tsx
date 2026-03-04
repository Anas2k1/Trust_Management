"use client";

import { useEffect, useState } from "react";

interface DocumentTableProps {
  collection: string;
  onEdit: (doc: any) => void;
  onDelete: () => void;
}

export default function DocumentTable({
  collection,
  onEdit,
  onDelete
}: DocumentTableProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/${collection}`);
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [collection]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/${collection}/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete document");
      onDelete();
    } catch (err) {
      alert("Error deleting document");
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <p className="text-slate-400">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-red-700 text-center">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <p className="text-slate-400">No documents found</p>
      </div>
    );
  }

  const columns = documents.length > 0 ? Object.keys(documents[0]) : [];

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {documents.map((doc, idx) => (
              <tr
                key={doc._id || idx}
                className="hover:bg-slate-700/50 transition"
              >
                {columns.map((col) => (
                  <td
                    key={`${idx}-${col}`}
                    className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate"
                  >
                    {col === "_id" ? (
                      <code className="text-xs bg-slate-900 px-2 py-1 rounded">
                        {String(doc[col]).slice(0, 12)}...
                      </code>
                    ) : (
                      String(doc[col])
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(doc)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(String(doc._id))}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
