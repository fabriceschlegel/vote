import type { StanceTone } from "@/lib/winchester-data";

const toneClassMap: Record<StanceTone, string> = {
  support:
    "border-[#8a6a25]/30 bg-[#fff3cf] text-[#5a0014] ring-1 ring-inset ring-[#d7b35c]/28",
  caution:
    "border-[#7a0019]/20 bg-[#7a0019]/8 text-[#7a0019] ring-1 ring-inset ring-[#7a0019]/18",
  monitor:
    "border-[#b89c62]/30 bg-[#fff8e8] text-[#6f5317] ring-1 ring-inset ring-[#d7b35c]/22",
  gap: "border-stone-500/25 bg-stone-400/10 text-stone-700 ring-1 ring-inset ring-stone-500/15",
};

type StanceChipProps = {
  label: string;
  tone: StanceTone;
};

export function StanceChip({ label, tone }: StanceChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.69rem] font-semibold uppercase tracking-[0.22em] ${toneClassMap[tone]}`}
    >
      {label}
    </span>
  );
}
