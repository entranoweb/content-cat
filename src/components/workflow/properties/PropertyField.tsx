"use client";

import { memo } from "react";
import type { SelectOption } from "../config/properties";

// Shared icons
export const InfoIcon = memo(function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M11.25 11.25C11.4489 11.25 11.6397 11.329 11.7803 11.4697C11.921 11.6103 12 11.8011 12 12V15.75C12 15.9489 12.079 16.1397 12.2197 16.2803C12.3603 16.421 12.5511 16.5 12.75 16.5"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.625 8.8125C12.1428 8.8125 12.5625 8.39277 12.5625 7.875C12.5625 7.35723 12.1428 6.9375 11.625 6.9375C11.1072 6.9375 10.6875 7.35723 10.6875 7.875C10.6875 8.39277 11.1072 8.8125 11.625 8.8125Z"
        fill="currentColor"
      />
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const CreditsIcon = memo(function CreditsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.75V20.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 7.5L19.5 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 16.5L19.5 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const CheckIcon = memo(function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.354 4.85403L6.35403 12.854C6.30759 12.9005 6.25245 12.9374 6.19175 12.9626C6.13105 12.9877 6.06599 13.0007 6.00028 13.0007C5.93457 13.0007 5.86951 12.9877 5.80881 12.9626C5.74811 12.9374 5.69296 12.9005 5.64653 12.854L2.14653 9.35403C2.05271 9.26021 2 9.13296 2 9.00028C2 8.8676 2.05271 8.74035 2.14653 8.64653C2.24035 8.55271 2.3676 8.5 2.50028 8.5C2.63296 8.5 2.76021 8.55271 2.85403 8.64653L6.00028 11.7934L13.6465 4.14653C13.7403 4.05271 13.8676 4 14.0003 4C14.133 4 14.2602 4.05271 14.354 4.14653C14.4478 4.24035 14.5006 4.3676 14.5006 4.50028C14.5006 4.63296 14.4478 4.76021 14.354 4.85403Z"
        fill="currentColor"
      />
    </svg>
  );
});

export const RunIcon = memo(function RunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: "rotate(90deg)" }}
    >
      <path
        d="M12 20.25L12 3.75"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 10.5L12 3.75L18.75 10.5"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// Shared select field component
interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  showInfo?: boolean;
}

export const SelectField = memo(function SelectField({
  label,
  value,
  options,
  onChange,
  showInfo = true,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">{label}</span>
        {showInfo && (
          <span className="text-gray-500">
            <InfoIcon />
          </span>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex items-center justify-between rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-white transition-colors hover:border-zinc-600"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

// Slider field component
interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export const SliderField = memo(function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">{label}</span>
        </div>
        <span className="text-xs text-gray-300">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  );
});

// Checkbox field component
interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  showInfo?: boolean;
}

export const CheckboxField = memo(function CheckboxField({
  label,
  checked,
  onChange,
  showInfo = false,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex cursor-pointer items-center gap-1.5">
        <div
          className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
            checked
              ? "border-cyan-500 bg-cyan-500 text-black"
              : "border-zinc-600 bg-zinc-800"
          }`}
          onClick={() => onChange(!checked)}
        >
          {checked && <CheckIcon />}
        </div>
      </label>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">{label}</span>
        {showInfo && (
          <span className="text-gray-500">
            <InfoIcon />
          </span>
        )}
      </div>
    </div>
  );
});

// Panel header component
interface PanelHeaderProps {
  name: string;
  color: string;
  price?: number;
}

export const PanelHeader = memo(function PanelHeader({
  name,
  color,
  price,
}: PanelHeaderProps) {
  return (
    <div className="border-b border-zinc-800 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-4 w-4 rounded bg-gradient-to-br ${color}`} />
          <span className="text-xs text-white">{name}</span>
        </div>
        {price !== undefined && (
          <div className="flex items-center gap-1 text-gray-400">
            <CreditsIcon />
            <span className="text-xs">${price}</span>
          </div>
        )}
      </div>
    </div>
  );
});

// Loading spinner component
const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
});

// Run button component
interface RunButtonProps {
  label: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export const RunButton = memo(function RunButton({
  label,
  onClick,
  isLoading = false,
  disabled = false,
  disabledReason,
}: RunButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <div className="border-t border-zinc-800 p-3">
      <button
        onClick={onClick}
        disabled={isDisabled}
        title={disabledReason}
        className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          isDisabled
            ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
            : "bg-cyan-500 text-black hover:bg-cyan-400"
        }`}
      >
        {isLoading ? <LoadingSpinner /> : <RunIcon />}
        {isLoading ? "Generating..." : label}
      </button>
      {disabledReason && !isLoading && (
        <p className="mt-1.5 text-center text-[10px] text-gray-500">
          {disabledReason}
        </p>
      )}
    </div>
  );
});

// Panel container component
interface PanelContainerProps {
  children: React.ReactNode;
}

export const PanelContainer = memo(function PanelContainer({
  children,
}: PanelContainerProps) {
  return (
    <aside className="flex h-full w-60 flex-col border-l border-zinc-800 bg-zinc-900">
      {children}
    </aside>
  );
});

// Panel body component for scrollable content
interface PanelBodyProps {
  children: React.ReactNode;
}

export const PanelBody = memo(function PanelBody({ children }: PanelBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-3">
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
});

// Section divider with label
interface SectionDividerProps {
  label: string;
}

export const SectionDivider = memo(function SectionDivider({
  label,
}: SectionDividerProps) {
  return (
    <div className="mt-2 border-t border-zinc-800 pt-3">
      <span className="mb-2 block text-[10px] font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </span>
    </div>
  );
});
