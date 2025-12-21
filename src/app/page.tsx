import Header from "@/components/Header";
import FeaturedCards from "@/components/FeaturedCards";
import TopChoice from "@/components/TopChoice";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex flex-1 flex-col gap-4 overflow-hidden px-6 pb-4">
        <ErrorBoundary>
          <FeaturedCards />
        </ErrorBoundary>
        <ErrorBoundary>
          <TopChoice />
        </ErrorBoundary>
      </main>
    </div>
  );
}
