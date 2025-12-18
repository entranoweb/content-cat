import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Photography",
  description:
    "Generate professional product shots with AI. Transform simple photos into studio-quality imagery with custom backgrounds and lighting.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
