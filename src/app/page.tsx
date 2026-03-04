"use client";

import { useState } from "react";
import CollectionSelector from "@/components/CollectionSelector";
import DocumentTable from "@/components/DocumentTable";
import DocumentForm from "@/components/DocumentForm";

export default function Home() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const collections = ["donors", "messages", "subscribers", "volunteers"];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (doc: any) => {
    setEditingDoc(doc);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDoc(null);
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 Trust Management
          </h1>
          <p className="text-slate-400">Manage your MongoDB collections</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CollectionSelector
              collections={collections}
              selected={selectedCollection}
              onSelect={setSelectedCollection}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCollection ? (
              <div className="space-y-6">
                {/* Actions Bar */}
                <div className="flex justify-between items-center bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h2 className="text-xl font-semibold text-white capitalize">
                    {selectedCollection}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingDoc(null);
                        setShowForm(true);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
                    >
                      ➕ New
                    </button>
                    <button
                      onClick={handleRefresh}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                {/* Form */}
                {showForm && (
                  <DocumentForm
                    collection={selectedCollection}
                    document={editingDoc}
                    onClose={handleCloseForm}
                  />
                )}

                {/* Table */}
                <DocumentTable
                  key={refreshKey}
                  collection={selectedCollection}
                  onEdit={handleEdit}
                  onDelete={handleRefresh}
                />
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
                <p className="text-slate-400 text-lg">
                  Select a collection from the sidebar to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
