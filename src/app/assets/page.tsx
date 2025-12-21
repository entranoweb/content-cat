"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import { AssetsSidebar, AssetsGrid, type AssetTab } from "@/components/assets";
import { apiFetch } from "@/lib/csrf";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<AssetTab>("generated");
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Fetch initial counts for both tabs
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [generatedRes, uploadedRes] = await Promise.all([
          apiFetch("/api/assets?tab=generated"),
          apiFetch("/api/assets?tab=uploaded"),
        ]);

        if (generatedRes.ok) {
          const data = await generatedRes.json();
          setGeneratedCount(data.count);
        }
        if (uploadedRes.ok) {
          const data = await uploadedRes.json();
          setUploadedCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch asset counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleCountChange = useCallback((tab: AssetTab, count: number) => {
    if (tab === "generated") {
      setGeneratedCount(count);
    } else {
      setUploadedCount(count);
    }
  }, []);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AssetsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          generatedCount={generatedCount}
          uploadedCount={uploadedCount}
        />

        {/* Main Content */}
        <main className="relative flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden pl-2 pr-4 pt-4">
          <AssetsGrid
            activeTab={activeTab}
            searchQuery={searchQuery}
            onCountChange={handleCountChange}
          />
        </main>
      </div>
    </div>
  );
}
