"use client";

import Link from "next/link";
import { useState } from "react";

import { StanceChip } from "@/components/stance-chip";
import type {
  CandidateProfile,
  Topic,
  TopicId,
} from "@/lib/winchester-data";

type CandidateExplorerProps = {
  candidates: CandidateProfile[];
  topics: Topic[];
};

export function CandidateExplorer({
  candidates,
  topics,
}: CandidateExplorerProps) {
  const [search, setSearch] = useState("");
  const [officeFilter, setOfficeFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const officeOptions = [
    {
      id: "all",
      label: "All offices",
    },
    ...Array.from(
      new Map(
        candidates.map((candidate) => [
          candidate.officeId,
          {
            id: candidate.officeId,
            label: candidate.officeLabel,
          },
        ]),
      ).values(),
    ),
  ];

  const yearOptions = Array.from(
    new Set(candidates.map((candidate) => candidate.electionYear)),
  ).sort((left, right) => right - left);

  const normalizedTopic =
    topicFilter === "all" ? null : (topicFilter as TopicId);

  const filteredCandidates = [...candidates]
    .filter((candidate) => {
      const matchesOffice =
        officeFilter === "all" || candidate.officeId === officeFilter;

      const matchesYear =
        yearFilter === "all" || candidate.electionYear === yearFilter;

      const matchesTopic =
        normalizedTopic === null ||
        candidate.stanceCards.some((stance) => stance.topicId === normalizedTopic) ||
        candidate.evidence.some((evidence) =>
          evidence.topicIds.includes(normalizedTopic),
        );

      const haystack = [
        candidate.name,
        candidate.officeLabel,
        candidate.raceLabel,
        String(candidate.electionYear),
        candidate.summary,
        candidate.background,
        ...candidate.keyThemes,
        ...candidate.stanceCards.map((stance) => `${stance.label} ${stance.detail}`),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search.trim().length === 0 ||
        haystack.includes(search.trim().toLowerCase());

      return matchesOffice && matchesYear && matchesTopic && matchesSearch;
    })
    .sort((left, right) => {
      if (left.isActiveBallot !== right.isActiveBallot) {
        return left.isActiveBallot ? -1 : 1;
      }

      if (left.electionYear !== right.electionYear) {
        return right.electionYear - left.electionYear;
      }

      return left.name.localeCompare(right.name);
    });

  return (
    <section id="candidate-explorer" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-20">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9d163b]">
              Candidate explorer
            </p>
            <h2 className="font-display max-w-lg text-[2rem] font-semibold tracking-[-0.05em] text-[#1e1510] sm:text-4xl">
              Compare the field by issue, not by mailer.
            </h2>
            <p className="max-w-md text-sm leading-6 text-black/65 sm:text-base sm:leading-7">
              Filter by office, budget issue, or keyword. Every card below
              points to a source-backed profile page with a record-quality note.
            </p>
          </div>

          <div className="space-y-4 rounded-[1.35rem] border border-black/10 bg-white p-4 sm:p-5">
            <label className="block">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Search names or issues
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="literacy, affordability, tutoring..."
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fcf7f1] px-4 py-3 text-sm text-black outline-none transition focus:border-[#9d163b]/35 focus:bg-white"
              />
            </label>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Cycle
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setYearFilter("all")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    yearFilter === "all"
                      ? "bg-[#211711] text-white"
                      : "border border-black/10 bg-[#f4ece1] text-black/70 hover:border-black/20 hover:bg-white"
                  }`}
                >
                  All loaded
                </button>
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setYearFilter(year)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      yearFilter === year
                        ? "bg-[#9d163b] text-white"
                        : "border border-black/10 bg-[#f4ece1] text-black/70 hover:border-black/20 hover:bg-white"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Office
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {officeOptions.map((office) => (
                  <button
                    key={office.id}
                    type="button"
                    onClick={() => setOfficeFilter(office.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      officeFilter === office.id
                        ? "bg-[#9d163b] text-white"
                        : "border border-black/10 bg-[#f4ece1] text-black/70 hover:border-black/20 hover:bg-white"
                    }`}
                  >
                    {office.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Topic
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTopicFilter("all")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    topicFilter === "all"
                      ? "bg-[#211711] text-white"
                      : "border border-black/10 bg-[#f4ece1] text-black/70 hover:border-black/20 hover:bg-white"
                  }`}
                >
                  All topics
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setTopicFilter(topic.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      topicFilter === topic.id
                        ? "bg-[#9d163b] text-white"
                        : "border border-black/10 bg-[#f4ece1] text-black/70 hover:border-black/20 hover:bg-white"
                    }`}
                  >
                    {topic.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Matching profiles
              </p>
              <p className="font-display mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1e1510]">
                {filteredCandidates.length} result
                {filteredCandidates.length === 1 ? "" : "s"}
              </p>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-6 text-black/55 md:block">
              Current-ballot and recent-cycle profiles are loaded together so
              you can compare today&apos;s field against the people who shaped the
              last round.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredCandidates.map((candidate) => (
              <article
                key={candidate.id}
                className="flex h-full flex-col justify-between rounded-[1.35rem] border border-black/10 bg-white p-5 transition hover:border-[#9d163b]/25"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                        {candidate.officeLabel}
                      </p>
                      <p className="mt-2 text-sm text-black/48">
                        {candidate.raceLabel}
                      </p>
                      <h3 className="font-display mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1f1510]">
                        {candidate.name}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] ${
                        candidate.status === "lost"
                          ? "bg-stone-900/8 text-stone-700"
                          : "bg-[#9d163b]/10 text-[#9d163b]"
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-black/58">
                    {candidate.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {candidate.stanceCards.slice(0, 3).map((stance) => (
                      <StanceChip
                        key={`${candidate.id}-${stance.topicId}`}
                        label={stance.label}
                        tone={stance.tone}
                      />
                    ))}
                  </div>

                  <div className="rounded-[1.1rem] border border-black/8 bg-[#faf7f2] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                      Record quality
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#211711]">
                      {candidate.priorRecordLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/58">
                      {candidate.priorRecordSummary}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-black/8 pt-4">
                  <div className="text-sm text-black/50">
                    {candidate.evidence.length} evidence points
                  </div>
                  <Link
                    href={`/candidates/${candidate.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-[#211711] px-4 py-2 text-sm font-semibold text-white transition hover:border-[#211711] hover:bg-black"
                  >
                    Open profile
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="rounded-[1.9rem] border border-dashed border-black/15 bg-white/65 px-6 py-12 text-center text-sm leading-7 text-black/55">
              No profiles match that combination yet. Try broadening the office
              or topic filter.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
