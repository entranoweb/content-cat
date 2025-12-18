import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Library",
  description:
    "Explore curated AI prompts for portraits, products, and creative styles. One-click generation to transform your ideas into stunning visuals.",
};

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
