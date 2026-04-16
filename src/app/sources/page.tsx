import Link from "next/link";

import { OfficialRecordExplorer } from "@/components/official-record-explorer";
import { sources } from "@/lib/winchester-data";
import {
  getOfficialBodyCounts,
  getOfficialBodyCount,
  getOfficialMinutesCount,
  getOfficialRecordCount,
  getOfficialRecordYears,
  officialRecords,
} from "@/lib/winchester-records";

const groups = [
  {
    label: "Official town records",
    kind: "official" as const,
    description:
      "Election results, State of the Town pages, and committee minutes hosted by Winchester itself.",
  },
  {
    label: "Local reporting and voter guides",
    kind: "local-news" as const,
    description:
      "Winchester News pages used to capture candidate questionnaires, forum coverage, and meeting-level vote detail.",
  },
];

export default function SourcesPage() {
  const officialRecordCount = getOfficialRecordCount();
  const officialMinutesCount = getOfficialMinutesCount();
  const officialBodyCounts = getOfficialBodyCounts();
  const featuredBodyCounts = officialBodyCounts.slice(0, 8);
  const officialBodyCount = getOfficialBodyCount();
  const officialYears = getOfficialRecordYears();
  const yearCoverageLabel =
    officialYears.length > 0
      ? `${Math.min(...officialYears)}-${Math.max(...officialYears)}`
      : "n/a";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 pb-20 lg:px-10">
      <div className="border-b border-black/10 pb-6">
        <Link
          href="/"
          className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/68 transition hover:border-black/20 hover:bg-white"
        >
          Back home
        </Link>
      </div>

      <section className="grid gap-8 py-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9d163b]">
            Source library
          </p>
          <h1 className="font-display max-w-lg text-5xl font-semibold tracking-[-0.06em] text-[#201712]">
            Everything this MVP currently trusts.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-black/65">
            The product is intentionally narrow in its first version. It only
            makes claims that can be attached to a public Winchester or
            Winchester News source, but the underlying source archive is now
            much broader and much more useful for real tester sessions.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/85 p-6 shadow-[0_20px_55px_rgba(35,23,16,0.08)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
            Sync workflow
          </p>
          <p className="mt-3 text-sm leading-7 text-black/62">
            New sources should be added to the manifest, pulled down with the
            sync script, then translated into typed evidence records. That keeps
            the product reproducible as more committees and election cycles get
            added.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-[1.4rem] bg-[#211711] px-4 py-4 text-sm text-white">
            <code>npm run build:archive{"\n"}npm run fetch:sources</code>
          </pre>
        </div>
      </section>

      <section className="grid gap-4 pb-10 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.8rem] border border-black/10 bg-white/85 p-5 shadow-[0_18px_50px_rgba(35,23,16,0.07)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
            Official record archive
          </p>
          <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#201712]">
            {officialRecordCount}
          </p>
          <p className="mt-3 text-sm leading-6 text-black/60">
            School Committee and Select Board entries generated from Winchester’s
            Agenda Center plus additional Winchester committees and boards.
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-black/10 bg-white/85 p-5 shadow-[0_18px_50px_rgba(35,23,16,0.07)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
            Bodies covered
          </p>
          <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#201712]">
            {officialBodyCount}
          </p>
          <p className="mt-3 text-sm leading-6 text-black/60">
            Official Winchester bodies currently included in the generated
            archive.
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-black/10 bg-white/85 p-5 shadow-[0_18px_50px_rgba(35,23,16,0.07)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
            Minutes coverage
          </p>
          <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#201712]">
            {officialMinutesCount}
          </p>
          <p className="mt-3 text-sm leading-6 text-black/60">
            Archive entries that currently expose a direct minutes link.
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-black/10 bg-white/85 p-5 shadow-[0_18px_50px_rgba(35,23,16,0.07)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
            Indexed years
          </p>
          <p className="font-display mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#201712]">
            {yearCoverageLabel}
          </p>
          <p className="mt-3 text-sm leading-6 text-black/60">
            {officialYears.join(", ")}
          </p>
        </article>
      </section>

      <section className="space-y-8">
        {groups.map((group) => (
          <div key={group.kind} className="space-y-4">
            <div className="border-b border-black/10 pb-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9d163b]">
                {group.label}
              </p>
              <p className="mt-2 text-sm leading-7 text-black/62">
                {group.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {sources
                .filter((source) => source.kind === group.kind)
                .map((source) => (
                  <article
                    key={source.id}
                    className="rounded-[1.8rem] border border-black/10 bg-white/85 p-5 shadow-[0_18px_50px_rgba(35,23,16,0.07)]"
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                      {source.publisher}
                    </p>
                    <h2 className="font-display mt-3 text-xl font-semibold tracking-[-0.03em] text-[#201712]">
                      {source.title}
                    </h2>
                    <p className="mt-3 text-sm text-black/55">{source.publishedAt}</p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/72 transition hover:border-[#9d163b]/35 hover:text-[#9d163b]"
                    >
                      Open source
                    </a>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-14 space-y-6">
        <div className="grid gap-4 rounded-[2rem] border border-black/10 bg-[#211711] px-6 py-6 text-white shadow-[0_18px_55px_rgba(35,23,16,0.12)] md:grid-cols-2">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/55">
              Archive coverage
            </p>
            <p className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Automated from the official meeting archive
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredBodyCounts.map((body) => (
              <div
                key={body.bodyId}
                className="rounded-[1.3rem] border border-white/10 bg-white/6 p-4"
              >
                <p className="font-display text-xl font-semibold tracking-[-0.03em]">
                  {body.bodyLabel}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {body.count} records indexed for tester browsing.
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm leading-6 text-black/58">
          The full archive spans {officialBodyCount} official bodies. Use the
          explorer below to filter by body, year, and meeting terms.
        </p>

        <OfficialRecordExplorer
          bodies={officialBodyCounts}
          records={officialRecords}
          years={officialYears}
        />
      </section>
    </main>
  );
}
