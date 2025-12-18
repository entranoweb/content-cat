"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  isActive: boolean;
}

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = [
  { id: "fal", name: "fal.ai", description: "Image & video generation API" },
];

const ChevronDownIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    className="size-5 text-gray-400"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.81344 7.97994C4.0087 7.78468 4.32528 7.78468 4.52055 7.97994L10.0003 13.4597L15.4801 7.97994C15.6754 7.78468 15.9919 7.78468 16.1872 7.97994C16.3825 8.1752 16.3825 8.49179 16.1872 8.68705L10.3539 14.5204L10.0003 14.8739L9.64677 14.5204L3.81344 8.68705C3.61818 8.49179 3.61818 8.1752 3.81344 7.97994Z"
      fill="currentColor"
    />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" className="h-4 w-4">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.81246 3.81246C4.00772 3.6172 4.32431 3.6172 4.51957 3.81246L9.99935 9.29224L15.4791 3.81246C15.6744 3.6172 15.991 3.6172 16.1862 3.81246C16.3815 4.00772 16.3815 4.32431 16.1862 4.51957L10.7065 9.99935L16.1862 15.4791C16.3815 15.6744 16.3815 15.991 16.1862 16.1862C15.991 16.3815 15.6744 16.3815 15.4791 16.1862L9.99935 10.7065L4.51957 16.1862C4.32431 16.3815 4.00772 16.3815 3.81246 16.1862C3.6172 15.991 3.6172 15.6744 3.81246 15.4791L9.29224 9.99935L3.81246 4.51957C3.6172 4.32431 3.6172 4.00772 3.81246 3.81246Z"
      fill="currentColor"
    />
  </svg>
);

const KeyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
  >
    <path
      d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" className="h-4 w-4">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 3.5A1.5 1.5 0 0 1 10 2h.5a1.5 1.5 0 0 1 1.5 1.5V4h3a.5.5 0 0 1 0 1h-.554l-.675 9.443A2 2 0 0 1 11.774 16H8.226a2 2 0 0 1-1.997-1.557L5.554 5H5a.5.5 0 0 1 0-1h3v-.5zm1 .5h1.5v-.5a.5.5 0 0 0-.5-.5h-.5a.5.5 0 0 0-.5.5V4zm-2.946 1l.67 9.386A1 1 0 0 0 8.226 15h3.548a1 1 0 0 0 .998-.614L13.446 5H6.554z"
      fill="currentColor"
    />
  </svg>
);

export default function ApiKeysModal({ isOpen, onClose }: ApiKeysModalProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [selectedService, setSelectedService] = useState("fal");
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await fetch("/api/api-keys");
      if (response.ok) {
        const keys = await response.json();
        setApiKeys(keys);
      } else {
        toast.error("Failed to load API keys");
      }
    } catch {
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchApiKeys();
    } else {
      // Reset dropdown state when modal closes
      setIsServiceDropdownOpen(false);
    }
  }, [isOpen, fetchApiKeys]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle dropdown positioning
  useEffect(() => {
    if (isServiceDropdownOpen && serviceDropdownRef.current) {
      const rect = serviceDropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isServiceDropdownOpen]);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node) &&
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
    };

    if (isServiceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isServiceDropdownOpen]);

  const handleValidate = async () => {
    if (!newKey.trim()) return;

    setIsValidating(true);

    try {
      const response = await fetch("/api/api-keys/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey, service: selectedService }),
      });

      const result = await response.json();
      if (result.isValid) {
        toast.success("API key is valid");
      } else {
        toast.error(result.message || "API key is invalid");
      }
    } catch {
      toast.error("Could not validate key. Check your connection.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!newKey.trim()) return;

    setIsSaving(true);

    try {
      const serviceName = SERVICES.find((s) => s.id === selectedService)?.name;
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: serviceName,
          key: newKey,
          service: selectedService,
        }),
      });

      if (response.ok) {
        setNewKey("");
        fetchApiKeys();
        toast.success("API key saved");
      } else {
        toast.error("Failed to save API key");
      }
    } catch {
      toast.error("Failed to save API key");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (service: string) => {
    try {
      const response = await fetch(`/api/api-keys?service=${service}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchApiKeys();
        toast.success("API key deleted");
      } else {
        toast.error("Failed to delete API key");
      }
    } catch {
      toast.error("Failed to delete API key");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? "visible bg-black/80 opacity-100 backdrop-blur-sm"
          : "invisible opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-zinc-700 bg-zinc-800 p-6 shadow-xl transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-700 text-white">
              <KeyIcon />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">API Keys</h2>
              <p className="text-xs text-gray-400">
                Manage your API credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <XIcon />
          </button>
        </div>

        {/* Existing Keys */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-2 border-zinc-600 border-t-cyan-400" />
          </div>
        ) : apiKeys.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Saved Keys</p>
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-800 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {apiKey.name}
                  </p>
                  <p className="font-mono text-xs text-gray-500">
                    {apiKey.key}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(apiKey.service)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/5 hover:text-red-400"
                  title="Delete"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {/* Add New Key */}
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            {apiKeys.length > 0 ? "Update Key" : "Add Key"}
          </p>

          {/* Service Selector */}
          <div>
            <label className="mb-2 block text-xs text-gray-500">Service</label>
            <button
              ref={serviceDropdownRef}
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              className="flex w-full items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-left text-sm text-white transition outline-none hover:bg-white/5"
            >
              <span>
                {SERVICES.find((s) => s.id === selectedService)?.name} -{" "}
                {SERVICES.find((s) => s.id === selectedService)?.description}
              </span>
              <ChevronDownIcon />
            </button>
            {isServiceDropdownOpen &&
              createPortal(
                <div
                  ref={dropdownMenuRef}
                  style={{
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width,
                  }}
                  className="fixed z-[9999] rounded-2xl border border-zinc-700 bg-zinc-800 p-2 shadow-xl"
                >
                  <div className="flex flex-col gap-1">
                    {SERVICES.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service.id);
                          setIsServiceDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors outline-none hover:bg-white/5 ${
                          selectedService === service.id ? "bg-white/10" : ""
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">
                            {service.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {service.description}
                          </span>
                        </div>
                        {selectedService === service.id && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="text-cyan-400"
                          >
                            <path d="M13.7071 4.29289C14.0976 4.68342 14.0976 5.31658 13.7071 5.70711L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071L2.29289 9.70711C1.90237 9.31658 1.90237 8.68342 2.29289 8.29289C2.68342 7.90237 3.31658 7.90237 3.70711 8.29289L6 10.5858L12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289Z" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>,
                document.body
              )}
          </div>

          {/* API Key Input */}
          <div>
            <label className="mb-2 block text-xs text-gray-500">API Key</label>
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition outline-none hover:bg-white/5 focus:bg-white/5"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleValidate}
              disabled={!newKey.trim() || isValidating}
              className="flex h-10 flex-1 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/50 text-sm font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isValidating ? "Validating..." : "Validate"}
            </button>
            <button
              onClick={handleSave}
              disabled={!newKey.trim() || isSaving}
              className="flex h-10 flex-1 items-center justify-center rounded-xl bg-cyan-400 text-sm font-semibold text-black transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
