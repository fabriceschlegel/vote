import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StanceChip } from "@/components/stance-chip";
import {
  candidateProfiles,
  getCandidateBySlug,
  getCandidateSources,
  getSourceById,
  getTopicById,
  siteTitle,
} from "@/lib/winchester-data";

export function generateStaticParams() {
  return candidateProfiles.map((candidate) => ({
    slug: candidate.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/candidates/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const candidate = getCandidateBySlug(slug);

  if (!candidate) {
    return {
      title: `Profile not found | ${siteTitle}`,
    };
  }

  return {
    title: `${candidate.name} - ${candidate.officeLabel}`,
    description: candidate.summary,
  };
}

export default async function CandidatePage(
  props: PageProps<"/candidates/[slug]">,
) {
  const { slug } = await props.params;
  const candidate = getCandidateBySlug(slug);

  if (!candidate) {
    notFound();
  }

  const candidateSources = getCandidateSources(candidate);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 pb-20 lg:px-10">
      <div className="border-b border-black/10 pb-6">
        <Link
          href="/#workspace-compare"
          className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/68 transition hover:border-black/20 hover:bg-white"
        >
          Back to comparison
        </Link>
      </div>

      <section className="grid gap-10 py-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[#9d163b]/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9d163b]">
              {candidate.officeLabel}
            </span>
            <span className="rounded-full border border-black/10 bg-white/75 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/55">
              {candidate.status}
            </span>
          </div>

          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9d163b]">
              {candidate.raceLabel}
            </p>
            <h1 className="font-display mt-4 max-w-xl text-5xl font-semibold tracking-[-0.06em] text-[#201712] sm:text-6xl">
              {candidate.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-black/65">
              {candidate.summary}
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-[0_18px_50px_rgba(35,23,16,0.07)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
              Record quality
            </p>
            <p className="font-display mt-3 text-xl font-semibold tracking-[-0.03em] text-[#201712]">
              {candidate.priorRecordLabel}
            </p>
            <p className="mt-3 text-sm leading-7 text-black/62">
              {candidate.priorRecordSummary}
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-[#211711] p-5 text-white shadow-[0_18px_55px_rgba(35,23,16,0.12)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/55">
              Why this page matters
            </p>
            <p className="mt-3 text-base leading-7 text-white/75">
              {candidate.locationNote}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <article className="rounded-[2rem] border border-black/10 bg-white/85 p-6 shadow-[0_20px_55px_rgba(35,23,16,0.08)]">
            <div className="border-b border-black/8 pb-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Background
              </p>
              <p className="mt-3 text-lg leading-8 text-black/72">
                {candidate.background}
              </p>
            </div>
            <div className="mt-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Key themes
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {candidate.keyThemes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-black/10 bg-[#f8f1e8] px-4 py-2 text-sm font-semibold text-black/72"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-black/10 bg-white/85 p-6 shadow-[0_20px_55px_rgba(35,23,16,0.08)]">
            <div className="border-b border-black/8 pb-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                Stance snapshot
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {candidate.stanceCards.map((stance) => {
                const topic = getTopicById(stance.topicId);

                return (
                  <div
                    key={`${candidate.id}-${stance.topicId}`}
                    className="rounded-[1.5rem] border border-black/8 bg-[#fbf7f1] p-4"
                  >
                    <StanceChip label={stance.label} tone={stance.tone} />
                    <p className="font-display mt-4 text-lg font-semibold tracking-[-0.03em] text-[#201712]">
                      {topic?.label ?? stance.topicId}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-black/62">
                      {stance.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-8 border-t border-black/10 pt-10 lg:grid-cols-[1.18fr_0.82fr]">
        <article className="rounded-[2rem] border border-black/10 bg-white/85 p-6 shadow-[0_20px_55px_rgba(35,23,16,0.08)]">
          <div className="border-b border-black/8 pb-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
              Evidence trail
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-black/62">
              Each evidence point below is tied to a named public source. The
              product keeps forum answers, direct votes, and record gaps
              separate on purpose.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {candidate.evidence.map((item) => {
              const source = getSourceById(item.sourceId);

              return (
                <div
                  key={item.id}
                  className="rounded-[1.6rem] border border-black/8 bg-[#fbf7f1] p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#211711] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white">
                      {item.kind}
                    </span>
                    {item.topicIds.map((topicId) => {
                      const topic = getTopicById(topicId);

                      return (
                        <span
                          key={`${item.id}-${topicId}`}
                          className="rounded-full border border-black/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/52"
                        >
                          {topic?.shortLabel ?? topicId}
                        </span>
                      );
                    })}
                  </div>
                  <h2 className="font-display mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#201712]">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-black/62">
                    {item.summary}
                  </p>
                  {source ? (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-4">
                      <p className="text-sm text-black/48">
                        {source.publisher} - {source.title}
                      </p>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/72 transition hover:border-[#9d163b]/35 hover:text-[#9d163b]"
                      >
                        Open source
                      </a>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-[2rem] border border-black/10 bg-white/85 p-6 shadow-[0_20px_55px_rgba(35,23,16,0.08)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45">
              Source set
            </p>
            <div className="mt-5 space-y-4">
              {candidateSources.map((source) => (
                <div
                  key={source.id}
                  className="rounded-[1.4rem] border border-black/8 bg-[#f8f1e8] p-4"
                >
                  <p className="font-display text-sm font-semibold text-[#201712]">
                    {source.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/45">
                    {source.publisher} - {source.publishedAt}
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-[#9d163b]"
                  >
                    Visit source
                  </a>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-black/10 bg-[#211711] p-6 text-white shadow-[0_20px_55px_rgba(35,23,16,0.14)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/55">
              Data guardrail
            </p>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Ballot Light does not flatten every public action into a vote. If
              a candidate only has a questionnaire, the page says so. If a
              candidate has a direct committee vote, the page shows that too.
            </p>
            <Link
              href="/sources"
              className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/35"
            >
              Review all sources
            </Link>
          </article>
        </aside>
      </section>
    </main>
  );
}
