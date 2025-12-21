"use client";

import { usePathname } from "next/navigation";
import ShaderBackground from "./ShaderBackground";

// Pages that should NOT have the shader background
const EXCLUDED_PATHS = ["/workflow"];

export default function ShaderBackgroundWrapper() {
  const pathname = usePathname();

  // Don't render on excluded paths
  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return <ShaderBackground />;
}
