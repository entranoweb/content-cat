"use client";

export default function ImageEmptyState() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="grid h-32 w-52 items-center justify-center rounded-xl bg-zinc-800/50">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="text-zinc-600"
          >
            <path
              d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="font-heading text-center text-2xl font-bold text-white uppercase">
          Nothing Here Yet
        </h2>
        <p className="text-center text-sm text-gray-400">
          Type something below and hit generate
        </p>
      </div>
    </div>
  );
}
