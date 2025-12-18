// Shared entity types for characters and products

export interface Entity {
  id: string;
  name: string;
  referenceImages: string[];
  thumbnailUrl: string | null;
  createdAt: string;
}

export type Character = Entity;

export type Product = Entity;

export interface SavedCharacter {
  id: string;
  name: string;
  referenceImages: string[];
  thumbnailUrl: string | null;
}

export interface SavedProduct {
  id: string;
  name: string;
  referenceImages: string[];
  thumbnailUrl: string | null;
}

export interface ReferenceImage {
  id: string;
  file?: File;
  preview: string;
  base64?: string;
  isLoading: boolean;
  isExisting?: boolean;
}

export interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  aspectRatio?: number;
  isExisting?: boolean;
}
