"use client";

import Link from "next/link";
import { useState } from "react";

import { StanceChip } from "@/components/stance-chip";
import {
  buildBallotMatcherResults,
  getDefaultPrioritySelection,
  getSparseSelectedPriorities,
  matcherPriorities,
  type PrioritySelection,
} from "@/lib/ballot-matcher";
import type { CandidateProfile } from "@/lib/winchester-data";

type BallotMatcherProps = {
  candidates: CandidateProfile[];
  compareHref?: string;
};

const priorityLevels = [
  { value: 0, label: "Ignore" },
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
  { value: 4, label: "Top" },
] as const;

function priorityLevelLabel(value: number) {
  if (value <= 0) {
    return "Ignore";
  }

  if (value === 1) {
    return "Low";
  }

  if (value === 2) {
    return "Medium";
  }

  if (value === 3) {
    return "High";
  }

  return "Top priority";
}

export function BallotMatcher({
  candidates,
  compareHref = "#candidate-explorer",
}: BallotMatcherProps) {
  const [selection, setSelection] = useState<PrioritySelection>(() =>
    getDefaultPrioritySelection(),
  );
  const officeResults = buildBallotMatcherResults(candidates, selection);
  const sparsePriorities = getSparseSelectedPriorities(selection);

  function updatePriority(priorityId: keyof PrioritySelection, nextValue: number) {
    setSelection((current) => ({
      ...current,
      [priorityId]: nextValue,
    }));
  }

  return (
    <section
      id="ballot-matcher"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-20"
    >
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <p className="hidden text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9d163b] sm:block">
              Ballot matcher
            </p>
            <h2 className="font-display max-w-xl text-[2rem] font-semibold tracking-[-0.05em] text-[#1f1510] sm:text-4xl">
              Set your priorities first. Then let the ballot sort itself.
            </h2>
            <p className="hidden max-w-lg text-sm leading-6 text-black/65 sm:block sm:text-base sm:leading-7">
              This branch turns the existing Winchester evidence into a
              fast-decision ballot assistant. Prior public votes and governing
              record count more than campaign copy. When the record is thin, the
              interface says that instead of pretending to know.
            </p>
          </div>

          <div className="space-y-3 rounded-[1.35rem] border border-black/10 bg-white p-4 sm:space-y-4 sm:rounded-[1.5rem] sm:p-5">
            {matcherPriorities.map((priority) => (
              <article
                key={priority.id}
                className="rounded-[1.1rem] border border-black/8 bg-[#faf7f2] p-3 sm:p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-[1.05rem] font-semibold tracking-[-0.03em] text-[#1f1510] sm:text-xl">
                      {priority.label}
                    </p>
                    <p className="mt-2 hidden max-w-md text-sm leading-6 text-black/60 sm:block">
                      {priority.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f3d58a] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#5a0014] sm:px-3 sm:text-[0.68rem] sm:tracking-[0.2em]">
                    {priorityLevelLabel(selection[priority.id])}
                  </span>
                </div>

                <div
                  className="mt-3 grid grid-cols-5 gap-1.5 sm:mt-4 sm:flex sm:flex-wrap sm:gap-2"
                  aria-label={`${priority.label} priority`}
                  role="group"
                >
                  {priorityLevels.map((level) => {
                    const isActive = selection[priority.id] === level.value;

                    return (
                      <button
                        key={`${priority.id}-${level.value}`}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => updatePriority(priority.id, level.value)}
                        className={
                          isActive
                            ? "inline-flex w-full justify-center rounded-full bg-[#8f102a] px-1 py-2 text-[0.7rem] font-semibold text-white sm:min-w-[4.5rem] sm:w-auto sm:px-3 sm:text-sm"
                            : "inline-flex w-full justify-center rounded-full border border-black/10 bg-white px-1 py-2 text-[0.7rem] font-semibold text-black/62 transition hover:border-[#9d163b]/35 hover:text-[#9d163b] sm:min-w-[4.5rem] sm:w-auto sm:px-3 sm:text-sm"
                        }
                      >
                        {level.label}
                      </button>
                    );
                  })}
                </div>

                {priority.sparseNote && selection[priority.id] > 0 ? (
                  <p className="mt-3 rounded-2xl border border-[#d9c28a] bg-[#fff8ea] px-3 py-2 text-xs leading-5 text-black/62 sm:text-sm sm:leading-6">
                    {priority.sparseNote}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <details className="rounded-[1.2rem] border border-black/10 bg-white p-4 md:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-[#1f1510]">
              How this quick ballot works
            </summary>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1rem] border border-black/8 bg-[#faf7f2] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                  Scoring method
                </p>
                <p className="mt-2 text-sm leading-6 text-black/62">
                  Prior votes score highest, adjacent public action scores next,
                  then forum answers and campaign statements.
                </p>
              </div>
              <div className="rounded-[1rem] border border-[#e3ddd3] bg-white p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#7a0019]">
                  Quick reset
                </p>
                <button
                  type="button"
                  onClick={() => setSelection(getDefaultPrioritySelection())}
                  className="mt-3 inline-flex rounded-full bg-[#7a0019] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#580013]"
                >
                  Reset priorities
                </button>
              </div>
            </div>
          </details>

          <div className="hidden gap-4 md:grid md:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[1.35rem] border border-black/10 bg-[#faf7f2] p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Scoring method
              </p>
              <p className="mt-3 text-sm leading-7 text-black/62">
                Prior votes score highest, adjacent public action scores next,
                then forum answers and campaign statements. A weak record lowers
                confidence even when the issue fit looks strong.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-[#e3ddd3] bg-white p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#7a0019]">
                Quick reset
              </p>
              <p className="mt-3 text-sm leading-7 text-black/62">
                Start from a school-focused default, then adjust only the
                issues you care about for this ballot.
              </p>
              <button
                type="button"
                onClick={() => setSelection(getDefaultPrioritySelection())}
                className="mt-4 inline-flex rounded-full bg-[#7a0019] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#580013]"
              >
                Reset priorities
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="rounded-[1.35rem] border border-black/10 bg-white p-4 sm:rounded-[1.5rem] sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
              <div>
                <p className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45 sm:block">
                  Your quick ballot
                </p>
                <p className="font-display text-[1.55rem] font-semibold tracking-[-0.05em] text-[#1f1510] sm:mt-2 sm:text-3xl">
                  Office-by-office recommendations
                </p>
              </div>
              <a
                href={compareHref}
                className="inline-flex rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/70 transition hover:border-[#9d163b]/35 hover:text-[#9d163b] sm:px-4 sm:py-2 sm:text-sm"
              >
                Compare profiles
              </a>
            </div>

            {sparsePriorities.length > 0 ? (
              <div className="mt-5 rounded-[1.4rem] border border-[#d9c28a] bg-[#fff8ea] px-4 py-3 text-sm leading-6 text-black/62">
                {sparsePriorities.map((priority) => priority.label).join(", ")}{" "}
                are not well covered in the current candidate dataset, so those
                choices do not drive a confident recommendation yet.
              </div>
            ) : null}

            <div className="mt-6 space-y-5">
              {officeResults.map((office) => (
                <article
                  key={office.officeId}
                  className="rounded-[1.1rem] border border-black/8 bg-[#faf7f2] p-4 sm:rounded-[1.25rem] sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/8 pb-4">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d163b]">
                        {office.officeLabel}
                      </p>
                      <p className="font-display mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-[#1f1510] sm:text-2xl">
                        {office.recommendation
                          ? `Fill in ${office.recommendation.candidate.name}`
                          : "No clear recommendation yet"}
                      </p>
                    </div>
                    {office.recommendation ? (
                      <span className="rounded-full bg-[#211711] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white">
                        {office.recommendation.confidenceLabel}
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-900/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone-700">
                        Thin signal
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-black/62 sm:leading-7">
                    {office.recommendationReason}
                  </p>

                  {office.recommendation?.reasonLabels.length ? (
                    <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
                      {office.recommendation.reasonLabels.map((reason) => (
                        <StanceChip key={`${office.officeId}-${reason}`} label={reason} tone="support" />
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 space-y-3">
                    {office.rankings.map((result) => (
                      <div
                        key={result.candidate.id}
                        className="rounded-[1rem] border border-black/8 bg-white p-3 sm:rounded-[1.1rem] sm:p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-display text-lg font-semibold tracking-[-0.03em] text-[#1f1510] sm:text-xl">
                              {result.candidate.name}
                            </p>
                            <p className="mt-1 hidden text-sm text-black/52 sm:block">
                              {result.evidenceLabel}
                            </p>
                          </div>
                          <Link
                            href={`/candidates/${result.candidate.slug}`}
                            className="inline-flex rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/72 transition hover:border-[#9d163b]/35 hover:text-[#9d163b] sm:px-4 sm:py-2 sm:text-sm"
                          >
                            Open profile
                          </Link>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eadfce]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,_#7a0019_0%,_#d7b35c_100%)]"
                            style={{ width: `${result.normalizedScore}%` }}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-black/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-black/55">
                            Match {result.normalizedScore}
                          </span>
                          <span className="rounded-full border border-black/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-black/55">
                            {result.confidenceLabel}
                          </span>
                          {!result.hasEnoughInformation ? (
                            <span className="rounded-full bg-stone-900/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone-700">
                              Not enough information
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
