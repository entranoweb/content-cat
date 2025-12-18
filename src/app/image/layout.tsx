import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Image Studio",
  description:
    "Create breathtaking AI-generated images from text prompts. Multiple styles, aspect ratios, and professional editing tools at your fingertips.",
};

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
