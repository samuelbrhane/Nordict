"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  ApiHeader,
  UsageStats,
  ApiKeysList,
  ApiDocs,
  CreateKeyModal,
} from "@/components/app/sections/settings/api";
import { ApiKey, INITIAL_KEYS } from "@/config/apiData";

const SettingsApiPage = () => {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateKey = (name: string, permissions: string[]): string => {
    const newKey: ApiKey = {
      id: String(keys.length + 1),
      name,
      keyPrefix: `nrd_live_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: "Just now",
      lastUsed: null,
      permissions,
      status: "active",
    };
    setKeys([newKey, ...keys]);
    return `nrd_live_${Math.random().toString(36).substring(2, 34)}`;
  };

  const handleRevoke = (id: string) => {
    setKeys(
      keys.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k))
    );
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <ApiHeader onCreateClick={() => setIsCreateModalOpen(true)} />
        <UsageStats
          activeKeys={keys.filter((k) => k.status === "active").length}
        />
        <ApiKeysList
          keys={keys}
          onRevoke={handleRevoke}
          onDelete={handleDelete}
        />
        <ApiDocs />
      </div>

      <CreateKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateKey}
      />
    </AppLayout>
  );
};

export default SettingsApiPage;
