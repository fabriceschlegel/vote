# Ballot Light

Ballot Light is a Winchester-first civic voting product. It turns scattered town records, committee coverage, and election guides into a source-backed comparison experience for local voters.

The initial MVP focuses on:

- 2026 Winchester School Committee and Select Board candidates
- school-budget and override context that matters to parents
- a vote ledger that shows where public actions are direct votes versus adjacent public record
- a reusable source manifest plus a generated official meeting archive so future committees and election cycles can be added without changing the app shape

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Static typed data for the first Winchester release

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Source sync

The current release ships with curated typed data. To keep a local archive of the public source pages and PDFs used by the MVP:

```bash
npm run build:archive
npm run fetch:sources
npm run audit:data
```

Those commands read [data/source-manifest.json](/Users/fschlege@amgen.com/Developer/vote/data/source-manifest.json), write the downloaded files into `data/raw/`, and then build a derived JSON cache plus quality reports under `data/derived/`.

`npm run build:archive` generates [data/official-record-archive.json](/Users/fschlege@amgen.com/Developer/vote/data/official-record-archive.json) from Winchester's Agenda Center across the current high-signal committee set, including School Committee, Select Board, Finance Committee, Planning Board, Town Meeting, and other related public bodies across a rolling 10-year window.

`npm run audit:data` creates:

- [data/derived/source-quality-report.json](/Users/fschlege@amgen.com/Developer/vote/data/derived/source-quality-report.json) to score the raw source files you have already fetched
- [data/derived/official-record-quality-report.json](/Users/fschlege@amgen.com/Developer/vote/data/derived/official-record-quality-report.json) to show which archive entries are still agenda-only versus which have minutes available
- `data/derived/sources/*.json` as the extracted JSON cache for raw PDF and HTML source text

## Product shape

- `/` compares candidates and shows the school-focused vote ledger
- `/candidates/[slug]` gives each candidate a stance summary, evidence trail, and source list
- `/sources` exposes the curated source library plus the larger official-record archive and its ingest workflow

## Current data choices

- Official town records anchor election results and process pages.
- Winchester News coverage fills in candidate questionnaires, forum summaries, and meeting-level vote details that are difficult to recover from the town site alone.
- Candidate pages explicitly label whether a stance is based on a direct vote, adjacent public action, or campaign statements.

## Next extensions

- add more Winchester bodies beyond the current high-signal committee set
- ingest more committee minutes into structured vote entries
- add issue pages for specific warrant articles or override proposals
