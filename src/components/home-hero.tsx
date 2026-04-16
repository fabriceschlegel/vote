import Link from "next/link";

import type { TownSignal } from "@/lib/winchester-data";

type HomeHeroProps = {
  evidenceCount: number;
  sourceCount: number;
  archiveCount: number;
  townSignals: TownSignal[];
};

export function HomeHero({
  evidenceCount,
  sourceCount,
  archiveCount,
  townSignals,
}: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#d9c28a] bg-[linear-gradient(180deg,_rgba(122,0,25,0.06)_0%,_rgba(255,255,255,0)_30%),linear-gradient(135deg,_rgba(252,248,240,1)_0%,_rgba(245,238,224,1)_52%,_rgba(236,228,209,1)_100%)]">
      <div className="absolute left-0 right-0 top-0 h-2 bg-[linear-gradient(90deg,_#d7b35c_0%,_#f3d58a_50%,_#d7b35c_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(122,0,25,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(122,0,25,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-6 lg:grid-cols-[1.28fr_0.9fr] lg:px-10 lg:py-7">
        <div className="relative flex flex-col justify-center gap-7 py-2 lg:py-4">
          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#b68d3b]/45 bg-white/82 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#7a0019] backdrop-blur">
              Winchester civic voting tracker
              <span className="h-2 w-2 rounded-full bg-[#d7b35c] shadow-[0_0_18px_rgba(215,179,92,0.5)]" />
            </div>
            <div className="space-y-4">
              <p className="max-w-3xl text-[0.8rem] font-medium uppercase tracking-[0.28em] text-[#7a0019]/75 sm:text-[0.88rem]">
                Source-backed voter research for Winchester school, budget, and
                town election questions.
              </p>
              <h1 className="font-display max-w-4xl text-[3.45rem] font-semibold leading-[0.92] tracking-[-0.06em] text-[#211711] sm:text-[4rem] lg:text-[4.25rem]">
                See what Winchester candidates actually stand for before the
                next vote.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-black/70 sm:text-lg">
                Ballot Light turns election guides, School Committee coverage,
                Select Board decisions, and official town files into one
                scannable record. The first cut focuses on schools and fiscal
                votes because that is where families feel the consequences
                first.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#workspace-compare"
              className="inline-flex items-center justify-center rounded-full bg-[#7a0019] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#580013]"
            >
              Browse candidates
            </a>
            <Link
              href="/sources"
              className="inline-flex items-center justify-center rounded-full border border-[#c8aa61] bg-[#f3d58a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#5a0014] transition hover:bg-[#f8df9a]"
            >
              Open source library
            </Link>
          </div>
        </div>

        <div className="relative flex items-center py-1 lg:py-3">
          <div className="relative w-full overflow-hidden rounded-[1.2rem] border border-[#c8aa61] bg-white/88 p-4 shadow-[0_20px_64px_rgba(69,39,28,0.12)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between border-b border-[#d8c49b] pb-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#7a0019]/72">
                  Current town pressure
                </p>
                <p className="font-display mt-2 text-[1.85rem] font-semibold tracking-[-0.03em] text-[#211711]">
                  Schools, services, and trust
                </p>
              </div>
              <div className="rounded-full border border-[#c8aa61] bg-[#fff8ea] px-4 py-2 text-right">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[#7a0019]/68">
                  Data loaded
                </p>
                <p className="mt-1 text-lg font-semibold text-[#7a0019]">
                  {evidenceCount + archiveCount}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {townSignals.map((signal, index) => (
                <div
                  key={signal.label}
                  className="group relative overflow-hidden rounded-[0.95rem] border border-[#d8c49b] bg-[#fffdf9] px-4 py-4 transition hover:border-[#7a0019]/30 hover:bg-white"
                  style={{
                    animationDelay: `${index * 110}ms`,
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,_#7a0019_0%,_#d7b35c_100%)]" />
                  <div className="pl-4">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#7a0019]/72">
                      {signal.label}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#211711]">
                        {signal.value}
                      </p>
                      <span className="rounded-full bg-[#f3d58a] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#5a0014]">
                        tracked
                      </span>
                    </div>
                    <p className="mt-2 max-w-md text-sm leading-6 text-black/60">
                      {signal.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 border-t border-[#d8c49b] pt-4 sm:grid-cols-2">
              <div className="rounded-[0.95rem] border border-[#d8c49b] bg-[#fff4d7] p-4">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#7a0019]/72">
                  Curated sources
                </p>
                <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#211711]">
                  {sourceCount}
                </p>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  Official town pages plus local election and committee coverage.
                </p>
              </div>
              <div className="rounded-[0.95rem] border border-[#7a0019] bg-[#7a0019] p-4 text-white">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#f3d58a]">
                  Official archive
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                  {archiveCount} Winchester records indexed.
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  School Committee and Select Board agendas and minutes from
                  the rolling archive window are now searchable alongside the
                  curated candidate dataset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
