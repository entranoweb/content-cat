import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Creator",
  description:
    "Bring your images to life with AI-powered video generation. Choose from 250+ presets for camera movements, transitions, and cinematic effects.",
};

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
