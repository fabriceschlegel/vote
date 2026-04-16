"use client";

import { useState } from "react";

import type {
  OfficialBodySummary,
  OfficialRecord,
} from "@/lib/winchester-records";

type OfficialRecordExplorerProps = {
  bodies: OfficialBodySummary[];
  records: OfficialRecord[];
  years: number[];
};

export function OfficialRecordExplorer({
  bodies,
  records,
  years,
}: OfficialRecordExplorerProps) {
  const [query, setQuery] = useState("");
  const [bodyFilter, setBodyFilter] = useState<OfficialRecord["bodyId"] | "all">("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const filteredRecords = records.filter((record) => {
    const matchesBody = bodyFilter === "all" || record.bodyId === bodyFilter;
    const matchesYear = yearFilter === "all" || record.year === yearFilter;
    const haystack = [
      record.bodyLabel,
      record.title,
      record.meetingLabel,
      record.recordType,
      record.topics.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery =
      query.trim().length === 0 ||
      haystack.includes(query.trim().toLowerCase());

    return matchesBody && matchesYear && matchesQuery;
  });
  const visibleRecords = filteredRecords.slice(0, 60);

  return (
    <section id="official-record-archive" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
        <div className="space-y-4">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9d163b]">
              Official record archive
            </p>
            <h2 className="font-display mt-3 max-w-lg text-[2rem] font-semibold tracking-[-0.05em] text-[#201712] sm:text-4xl">
              Search the deeper Winchester meeting archive.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-black/62 sm:text-base sm:leading-7">
              This is generated from the town Agenda Center, not hand-entered.
              It gives testers much broader coverage across the Winchester
              bodies that matter most for budget, planning, schools, and town
              process.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/10 bg-white/85 p-4 shadow-[0_18px_50px_rgba(35,23,16,0.07)] sm:rounded-[1.8rem] sm:p-5">
            <label className="block">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Search by meeting title or topic
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="budget, policy, regular meeting..."
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fcf7f1] px-4 py-3 text-sm text-black outline-none transition focus:border-[#9d163b]/35 focus:bg-white"
              />
            </label>

            <div className="mt-5">
              <label
                htmlFor="official-body-filter"
                className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45"
              >
                Body
              </label>
              <select
                id="official-body-filter"
                value={bodyFilter}
                onChange={(event) => setBodyFilter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fcf7f1] px-4 py-3 text-sm text-black outline-none transition focus:border-[#9d163b]/35 focus:bg-white"
              >
                <option value="all">All bodies ({bodies.length})</option>
                {bodies.map((body) => (
                  <option key={body.bodyId} value={body.bodyId}>
                    {body.bodyLabel} ({body.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Year
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
                  All years
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setYearFilter(year)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      yearFilter === year
                        ? "bg-[#7a0019] text-white"
                        : "border border-black/10 bg-[#f4ece1] text-black/70 hover:border-black/20 hover:bg-white"
                    }`}
                  >
                    {year}
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
                Matching official records
              </p>
              <p className="font-display mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1f1510]">
                {filteredRecords.length} record
                {filteredRecords.length === 1 ? "" : "s"}
              </p>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-6 text-black/55 md:block">
              Agenda links go straight to Winchester’s official site. The list
              caps at 60 rows at a time, so narrower filters produce better
              browsing.
            </p>
          </div>

          {filteredRecords.length > visibleRecords.length ? (
            <p className="rounded-[1.2rem] border border-[#d9c28a] bg-[#fff8ea] px-4 py-3 text-sm leading-6 text-black/62">
              Showing the first {visibleRecords.length} matching records. Add a
              body, year, or search term to narrow the archive further.
            </p>
          ) : null}

          {visibleRecords.length > 0 ? (
            <div className="space-y-3">
              {visibleRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-[1.5rem] border border-black/10 bg-white/88 p-5 shadow-[0_14px_40px_rgba(35,23,16,0.06)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#7a0019]/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7a0019]">
                          {record.bodyLabel}
                        </span>
                        <span className="rounded-full border border-black/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-black/55">
                          {record.recordType === "agenda+minutes"
                            ? "Agenda + minutes"
                            : "Agenda"}
                        </span>
                      </div>
                      <h3 className="font-display mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#201712]">
                        {record.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-black/60">
                        Meeting date: {record.meetingLabel}
                        {record.postedAt ? ` · Posted ${record.postedAt}` : ""}
                      </p>
                      {record.topics.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {record.topics.map((topic) => (
                            <span
                              key={`${record.id}-${topic}`}
                              className="rounded-full bg-[#f4ece1] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/58"
                            >
                              {topic.replaceAll("-", " ")}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <a
                        href={record.agendaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full bg-[#211711] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
                      >
                        Open agenda
                      </a>
                      {record.minutesUrl ? (
                        <a
                          href={record.minutesUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-full border border-black/12 px-4 py-2 text-sm font-semibold text-black/78 transition hover:border-[#7a0019]/35 hover:text-[#7a0019]"
                        >
                          Open minutes
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-white/72 px-5 py-8 text-sm leading-7 text-black/60">
              No archive rows match this filter set yet. Clear the search or
              switch to another body to keep browsing.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
