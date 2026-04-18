"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BallotMatcher } from "@/components/ballot-matcher";
import { CandidateExplorer } from "@/components/candidate-explorer";
import type {
  CandidateProfile,
  OfficeSummary,
  Topic,
  TownSignal,
  VoteLedgerEntry,
} from "@/lib/winchester-data";
import { getSourceById } from "@/lib/winchester-data";
import type {
  OfficialBodySummary,
  OfficialRecord,
} from "@/lib/winchester-records";

type WorkspaceTabId = "overview" | "ballot" | "compare" | "ledger" | "archive";

type HomeWorkspaceProps = {
  candidates: CandidateProfile[];
  evidenceCount: number;
  offices: OfficeSummary[];
  topics: Topic[];
  townSignals: TownSignal[];
  voteLedger: VoteLedgerEntry[];
  officialBodyCount: number;
  officialBodyCounts: OfficialBodySummary[];
  officialMinutesCount: number;
  officialRecordCount: number;
  recentOfficialRecords: OfficialRecord[];
  yearCoverageLabel: string;
};

const workspaceTabs = [
  {
    id: "overview",
    hash: "#workspace-overview",
    label: "News",
    description:
      "Current town pressure, budget context, and the latest source-backed signals.",
  },
  {
    id: "ballot",
    hash: "#workspace-ballot",
    label: "Quick ballot",
    description: "Match the ballot to your priorities before you read everything else.",
  },
  {
    id: "compare",
    hash: "#workspace-compare",
    label: "Compare candidates",
    description: "Filter the field by office, issue, or keyword and open source-backed profiles.",
  },
  {
    id: "ledger",
    hash: "#workspace-ledger",
    label: "Vote ledger",
    description: "See the public actions and budget splits that shaped this cycle.",
  },
  {
    id: "archive",
    hash: "#workspace-archive",
    label: "Town archive",
    description: "Jump into the larger Winchester meeting record set and current coverage scope.",
  },
] as const satisfies {
  id: WorkspaceTabId;
  hash: string;
  label: string;
  description: string;
}[];

function tabFromHash(hash: string): WorkspaceTabId | null {
  const matchedTab = workspaceTabs.find((tab) => tab.hash === hash);
  return matchedTab?.id ?? null;
}

export function HomeWorkspace({
  candidates,
  evidenceCount,
  offices,
  topics,
  townSignals,
  voteLedger,
  officialBodyCount,
  officialBodyCounts,
  officialMinutesCount,
  officialRecordCount,
  recentOfficialRecords,
  yearCoverageLabel,
}: HomeWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("overview");
  const activeTabDefinition =
    workspaceTabs.find((tab) => tab.id === activeTab) ?? workspaceTabs[0];

  useEffect(() => {
    function syncTabFromHash() {
      const nextTab = tabFromHash(window.location.hash);

      if (nextTab) {
        setActiveTab(nextTab);
      }
    }

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);

    return () => {
      window.removeEventListener("hashchange", syncTabFromHash);
    };
  }, []);

  function activateTab(tabId: WorkspaceTabId) {
    const nextTab = workspaceTabs.find((tab) => tab.id === tabId);

    if (!nextTab) {
      return;
    }

    setActiveTab(tabId);
    window.history.replaceState(null, "", nextTab.hash);
  }

  return (
    <section
      id="home-workspace"
      className="relative z-20 mx-auto max-w-7xl px-4 pt-2 pb-6 sm:px-6 sm:pt-4 sm:pb-8 lg:px-10 lg:pt-6 lg:pb-12"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
        {workspaceTabs.map((tab) => (
          <span
            key={tab.id}
            id={tab.hash.slice(1)}
            className="relative -top-28 block h-0"
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-black/10 bg-white sm:rounded-[1.6rem]">
        <div className="border-b border-black/10 bg-white px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="max-w-4xl space-y-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#8f102a]">
              Winchester voter guide
            </p>
            <h1 className="font-display text-[2.2rem] font-semibold leading-[0.92] tracking-[-0.06em] text-[#201712] sm:text-[3rem] lg:text-[3.7rem]">
              See what candidates actually stand for before you vote.
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-black/58 sm:text-base sm:leading-7 lg:text-lg">
              Public records, prior votes, and town documents in one place.
            </p>
          </div>
        </div>

        <div
          aria-label="Homepage views"
          className="flex snap-x gap-px overflow-x-auto bg-[#6f0f27] xl:grid xl:grid-cols-5 xl:overflow-visible"
          role="tablist"
        >
          {workspaceTabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => activateTab(tab.id)}
                className={
                  isActive
                    ? "min-w-[9.75rem] shrink-0 snap-start border-t-4 border-[#e2b653] bg-white px-4 py-3 text-left text-[#201712] sm:min-w-[11rem] sm:px-5 sm:py-4 xl:min-w-0"
                    : "min-w-[9.75rem] shrink-0 snap-start border-t-4 border-transparent bg-[#8f102a] px-4 py-3 text-left text-white transition hover:bg-[#7d142c] sm:min-w-[11rem] sm:px-5 sm:py-4 xl:min-w-0"
                }
              >
                <p className="font-display text-[1.05rem] font-semibold tracking-[-0.04em] sm:text-[1.22rem]">
                  {tab.label}
                </p>
                <p
                  className={
                    isActive
                      ? "mt-2 hidden max-w-xs text-sm leading-6 text-black/60 lg:block"
                      : "mt-2 hidden max-w-xs text-sm leading-6 text-white/72 lg:block"
                  }
                >
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>

        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="bg-[linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(250,246,240,0.72)_100%)]"
        >
          {activeTab !== "overview" ? (
            <div className="hidden flex-col gap-3 border-b border-black/10 px-4 py-4 sm:flex sm:px-6 sm:py-5 lg:flex-row lg:items-end lg:justify-between lg:px-8">
              <div>
                <h3 className="font-display text-[1.6rem] font-semibold tracking-[-0.05em] text-[#1f1510] sm:text-[2rem]">
                  {activeTabDefinition.label}
                </h3>
              </div>
            </div>
          ) : null}

          {activeTab === "overview" ? (
            <div className="grid gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
              <div className="space-y-4">
                <h3 className="font-display text-[2rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#1f1510] sm:text-[2.5rem] lg:text-[3rem]">
                  Current town pressure
                </h3>
                <p className="max-w-xl text-sm leading-6 text-black/62 sm:text-base sm:leading-7">
                  School funding, turnout, and the post-override budget picture are the backdrop for this ballot.
                </p>

                <div className="mt-5 divide-y divide-black/8 border-y border-black/8">
                  {townSignals.map((signal) => (
                    <article
                      key={signal.label}
                      className="grid gap-2 py-4 sm:grid-cols-[0.8fr_0.2fr] sm:items-start"
                    >
                      <div>
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8f102a]/76">
                          {signal.label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-black/60">
                          {signal.note}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="font-display text-[1.8rem] font-semibold tracking-[-0.04em] text-[#1f1510]">
                          {signal.value}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-px border border-[#e3ddd3] bg-[#e3ddd3]">
                  <article className="bg-[#faf7f2] p-4 sm:p-5">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-black/46">
                      Data loaded
                    </p>
                    <p className="font-display mt-2 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#8f102a] sm:text-3xl">
                      {evidenceCount + officialRecordCount}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      Combined candidate evidence and indexed town records.
                    </p>
                  </article>
                  <article className="bg-[#faf7f2] p-4 sm:p-5">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-black/46">
                      Archive window
                    </p>
                    <p className="font-display mt-2 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#1f1510] sm:text-3xl">
                      {yearCoverageLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      {officialRecordCount} indexed Winchester records across the active archive.
                    </p>
                  </article>
                </div>

                <div className="border border-[#e3ddd3] bg-white">
                  <div className="flex flex-col items-start gap-3 border-b border-[#e3ddd3] px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#8f102a]">
                        Latest town records
                      </p>
                      <p className="font-display mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-[#1f1510] sm:text-[1.7rem]">
                        Recent official archive
                      </p>
                    </div>
                    <Link
                      href="/sources#official-record-archive"
                      className="inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/72 transition hover:border-[#8f102a]/35 hover:text-[#8f102a]"
                    >
                      Open full archive
                    </Link>
                  </div>

                  <div className="divide-y divide-[#e3ddd3]">
                    {recentOfficialRecords.slice(0, 4).map((record, index) => (
                      <article
                        key={record.id}
                        className={`grid gap-3 px-4 py-4 md:grid-cols-[0.64fr_0.36fr] md:items-start md:px-5 ${
                          index > 1 ? "hidden md:grid" : ""
                        }`}
                      >
                        <div>
                          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                            {record.bodyLabel}
                          </p>
                          <p className="font-display mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-[#1f1510]">
                            {record.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-black/58">
                            {record.meetingLabel}
                            {record.postedAt ? ` · Posted ${record.postedAt}` : ""}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:justify-end">
                          <a
                            href={record.agendaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-full bg-[#8f102a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6f0f27]"
                          >
                            Agenda
                          </a>
                          {record.minutesUrl ? (
                            <a
                              href={record.minutesUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/74 transition hover:border-[#8f102a]/35 hover:text-[#8f102a]"
                            >
                              Minutes
                            </a>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

	          {activeTab === "ballot" ? (
            <div className="space-y-0">
              <div className="border-b border-black/8 bg-[#faf7f2] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
                {offices.map((office) => (
                  <article
                    key={office.id}
                    className="min-w-[16rem] shrink-0 rounded-[1.25rem] border border-black/8 bg-white p-4 md:min-w-0"
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-black/45">
                      {office.label}
                    </p>
                    <p className="font-display mt-2 text-lg font-semibold tracking-[-0.04em] text-[#1f1510] sm:mt-3 sm:text-xl">
                      {office.description}
                    </p>
                    <p className="mt-2 hidden text-sm leading-6 text-black/60 sm:block">
                      {office.currentPressure}
                    </p>
                  </article>
                ))}
                </div>
              </div>
              <BallotMatcher
                candidates={candidates}
                compareHref="#workspace-compare"
              />
            </div>
          ) : null}

          {activeTab === "compare" ? (
            <CandidateExplorer candidates={candidates} topics={topics} />
          ) : null}

          {activeTab === "ledger" ? (
            <div className="grid gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
              <div className="space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9d163b]">
                  Public record
                </p>
                <h4 className="font-display max-w-lg text-[2rem] font-semibold tracking-[-0.05em] text-[#1f1510] sm:text-4xl">
                  This is the part parents usually cannot find in one place.
                </h4>
                <p className="max-w-md text-base leading-7 text-black/65">
                  A candidate page matters more when it also exposes the actual
                  votes, amendments, and governing splits around the race.
                </p>
              </div>

              <div className="space-y-5">
                {voteLedger.map((entry) => {
                  const source = getSourceById(entry.sourceId);

                  return (
                    <article key={entry.id} className="rounded-[1.35rem] border border-black/10 bg-white p-4 sm:rounded-[1.5rem] sm:p-6">
                      <div className="flex flex-col gap-4 border-b border-black/8 pb-5 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                            {entry.when}
                          </p>
                          <h5 className="font-display mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1f1510]">
                            {entry.title}
                          </h5>
                        </div>
                        <div className="rounded-full bg-[#f4ece1] px-4 py-2 text-sm font-semibold text-[#9d163b]">
                          {entry.result}
                        </div>
                      </div>

                      <p className="mt-5 max-w-3xl text-sm leading-7 text-black/65">
                        {entry.whyItMatters}
                      </p>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {entry.participants.map((participant) => (
                          <div
                            key={`${entry.id}-${participant.name}`}
                            className="rounded-[1.1rem] border border-black/8 bg-[#faf7f2] p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-[#1f1510]">
                                  {participant.name}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-black/45">
                                  {participant.role}
                                </p>
                              </div>
                              <span className="rounded-full bg-[#211711] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-white">
                                {participant.vote}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-black/60">
                              {participant.note}
                            </p>
                          </div>
                        ))}
                      </div>

                      {source ? (
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-5">
                          <p className="text-sm text-black/50">
                            Source: {source.publisher}
                          </p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/75 transition hover:border-[#9d163b]/35 hover:text-[#9d163b]"
                          >
                            Read source
                          </a>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}

              {activeTab === "archive" ? (
            <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[1.35rem] border border-black/10 bg-white p-4 sm:p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Official records
                  </p>
                  <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#1f1510]">
                    {officialRecordCount}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/60">
                    Searchable official meeting archive inside the current
                    tester scope.
                  </p>
                </article>
                <article className="rounded-[1.35rem] border border-black/10 bg-white p-4 sm:p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Bodies covered
                  </p>
                  <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#1f1510]">
                    {officialBodyCount}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/60">
                    Committees, boards, and civic archives now tracked in one
                    place.
                  </p>
                </article>
                <article className="rounded-[1.35rem] border border-black/10 bg-white p-4 sm:p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Minutes links
                  </p>
                  <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#1f1510]">
                    {officialMinutesCount}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/60">
                    Records surface minutes whenever Winchester publishes them.
                  </p>
                </article>
                <article className="rounded-[1.35rem] border border-black/10 bg-white p-4 sm:p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Year coverage
                  </p>
                  <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#1f1510]">
                    {yearCoverageLabel}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/60">
                    Current official archive window for the homepage dataset.
                  </p>
                </article>
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                <div className="rounded-[1.5rem] border border-black/10 bg-[#faf7f2] p-6">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                    Coverage by body
                  </p>
                  <div className="mt-5 space-y-4">
                    {officialBodyCounts.map((body) => (
                      <div
                        key={body.bodyId}
                        className="rounded-[1.1rem] border border-black/8 bg-white p-4"
                      >
                        <p className="font-display text-xl font-semibold tracking-[-0.03em] text-[#1f1510]">
                          {body.bodyLabel}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-black/60">
                          {body.count} archived entries are ready for testers to browse.
                        </p>
                      </div>
                    ))}
                    <p className="text-sm leading-6 text-black/56">
                      Full archive coverage currently spans {officialBodyCount} official
                      Winchester bodies.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-4 border-b border-black/10 pb-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                        Recent official records
                      </p>
                      <p className="font-display mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1f1510]">
                        Latest meeting archive
                      </p>
                    </div>
                    <Link
                      href="/sources#official-record-archive"
                      className="inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/72 transition hover:border-[#9d163b]/35 hover:text-[#9d163b]"
                    >
                      Open full archive
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {recentOfficialRecords.map((record) => (
                      <article key={record.id} className="rounded-[1.35rem] border border-black/10 bg-white p-5">
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9d163b]">
                          {record.bodyLabel}
                        </p>
                        <h4 className="font-display mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#1f1510]">
                          {record.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-black/60">
                          {record.meetingLabel}
                          {record.postedAt ? ` · Posted ${record.postedAt}` : ""}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a
                            href={record.agendaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-full bg-[#211711] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
                          >
                            Agenda
                          </a>
                          {record.minutesUrl ? (
                            <a
                              href={record.minutesUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/74 transition hover:border-[#9d163b]/35 hover:text-[#9d163b]"
                            >
                              Minutes
                            </a>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
