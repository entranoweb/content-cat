import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Creator",
  description:
    "Build your own AI character from photos. Generate unlimited selfies and portraits in any style while preserving your unique look.",
};

export default function CreateCharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
