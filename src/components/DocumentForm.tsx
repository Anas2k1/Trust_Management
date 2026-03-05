"use client";

import { useState, useEffect } from "react";

interface DocumentFormProps {
  collection: string;
  document?: any;
  onClose: () => void;
}

export default function DocumentForm({
  collection,
  document,
  onClose
}: DocumentFormProps) {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [newField, setNewField] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    if (document) {
      const { _id, ...data } = document;
      setFormData(data);
    }
  }, [document]);

  const handleInputChange = (key: string, value: string) => {
    let parsedValue: any = value;
    
    // Try to parse as JSON for complex types
    if (value === "true") parsedValue = true;
    else if (value === "false") parsedValue = false;
    else if (value === "null") parsedValue = null;
    else if (!isNaN(Number(value))) parsedValue = Number(value);
    
    setFormData((prev) => ({ ...prev, [key]: parsedValue }));
  };

  const handleAddField = () => {
    if (!newField) return;
    
    let parsedValue: any = newValue;
    if (newValue === "true") parsedValue = true;
    else if (newValue === "false") parsedValue = false;
    else if (newValue === "null") parsedValue = null;
    else if (!isNaN(Number(newValue))) parsedValue = Number(newValue);
    
    setFormData((prev) => ({ ...prev, [newField]: parsedValue }));
    setNewField("");
    setNewValue("");
  };

  const handleRemoveField = (key: string) => {
    setFormData((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = document ? "PUT" : "POST";
      const url = document
        ? `/api/${collection}/${document._id}`
        : `/api/${collection}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document ? { ...formData, _id: document._id } : formData)
      });

      if (!response.ok) throw new Error("Failed to save document");

      alert(document ? "Document updated successfully" : "Document created successfully");
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {document ? "Edit Document" : "New Document"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Existing fields */}
            <div className="space-y-3">
              {Object.entries(formData).map(([key, value]) => {
                // Check if this is a read-only field
                const isReadOnly = ['createdAt', 'updatedAt', '__v'].includes(key);
                const isTimestamp = key === 'createdAt' || key === 'updatedAt';
                const displayValue = isTimestamp ? new Date(value).toLocaleString() : value;

                return (
                  <div key={key} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-sm text-slate-300 block mb-1">
                        {key} {isReadOnly && <span className="text-xs text-slate-500">(read-only)</span>}
                      </label>
                      <input
                        type="text"
                        value={displayValue}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white focus:border-blue-500 outline-none ${
                          isReadOnly ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(key)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add new field */}
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                Add New Field
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Field name"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white focus:border-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
