import { mkdirSync, writeFileSync } from "node:fs";

const baseUrl = "https://www.winchester.us";
const outputPath = new URL("../data/official-record-archive.json", import.meta.url);
const archiveWindowYears = Number.parseInt(
  process.env.BALLOT_LIGHT_ARCHIVE_WINDOW_YEARS ?? "10",
  10,
);
const currentYear = new Date().getUTCFullYear();
const archiveYears = Array.from(
  { length: archiveWindowYears },
  (_, index) => currentYear - index,
);
const trackedCategoryIds = [
  17, // School Committee - Town Clerk's Office
  16, // Select Board - Town Clerk's Office
  15, // Finance Committee
  45, // Planning Board - Town Clerk's Office
  55, // Town Meeting Town Clerks Office
  31, // Capital Planning Committee
  23, // Audit Advisory Committee
  22, // Educational Facilities Planning and Building Committee
  91, // State of the Town - Town Clerk Office
  88, // Committee on Government Regulations
  81, // Affordable Housing Trust Committee
  41, // Housing Partnership Board
  90, // Winchester Committee on Community Preservation
  28, // Board of Health
  19, // Conservation Commission
  56, // School Councils
];

function stripTags(value) {
  return value
    .replace(/<abbr[^>]*title="([^"]+)"[^>]*>[^<]*<\/abbr>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&thinsp;/g, " ")
    .replace(/&mdash;/g, " - ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collapseWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function toTitleCase(value) {
  return collapseWhitespace(value.toLowerCase())
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .replace(/\bMbta\b/g, "MBTA")
    .replace(/\bWincam\b/g, "WinCAM");
}

function normalizeBodyLabel(label) {
  return toTitleCase(
    label
      .replace(/-?\s*Town Clerk'?s?\s+Office$/i, "")
      .replace(/-?\s*Town Clerks\s+Office$/i, "")
      .replace(/-?\s*Town Clerk\s+Office$/i, "")
      .replace(/-?\s*Staff$/i, ""),
  );
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toIsoDate(label) {
  const date = new Date(`${label} UTC`);
  if (Number.isNaN(date.getTime())) {
    return label;
  }

  return date.toISOString().slice(0, 10);
}

function inferTopics(bodyId, title) {
  const bodyKey = bodyId.toLowerCase();
  const normalized = title.toLowerCase();
  const topics = new Set();

  if (
    bodyKey.includes("school-committee") ||
    bodyKey.includes("educational-facilities-planning-and-building-committee") ||
    bodyKey.includes("school-councils")
  ) {
    topics.add("school-budget");
  }

  if (bodyKey.includes("finance") || bodyKey.includes("capital-planning")) {
    topics.add("town-revenue");
    topics.add("fiscal-governance");
  }

  if (bodyKey.includes("planning-board") || bodyKey.includes("town-meeting")) {
    topics.add("planning");
  }

  if (
    bodyKey.includes("housing") ||
    bodyKey.includes("affordable-housing")
  ) {
    topics.add("housing");
  }

  if (bodyKey.includes("board-of-health")) {
    topics.add("public-health");
  }

  if (bodyKey.includes("conservation")) {
    topics.add("conservation");
  }

  if (bodyKey.includes("community-preservation")) {
    topics.add("community-preservation");
  }

  if (normalized.includes("budget")) {
    topics.add(bodyKey.includes("school") ? "school-budget" : "town-revenue");
  }

  if (normalized.includes("policy")) {
    topics.add("fiscal-governance");
  }

  if (
    normalized.includes("literacy") ||
    normalized.includes("reading") ||
    normalized.includes("ela")
  ) {
    topics.add("literacy");
  }

  if (
    normalized.includes("building") ||
    normalized.includes("capital") ||
    normalized.includes("muraco") ||
    normalized.includes("facility")
  ) {
    topics.add("school-facilities");
  }

  if (
    normalized.includes("override") ||
    normalized.includes("tax")
  ) {
    topics.add("override");
  }

  if (
    normalized.includes("housing") ||
    normalized.includes("affordable")
  ) {
    topics.add("housing");
  }

  if (
    normalized.includes("planning") ||
    normalized.includes("zoning") ||
    normalized.includes("warrant")
  ) {
    topics.add("planning");
  }

  if (
    normalized.includes("health") ||
    normalized.includes("sanitarian")
  ) {
    topics.add("public-health");
  }

  if (
    normalized.includes("conservation") ||
    normalized.includes("wetlands")
  ) {
    topics.add("conservation");
  }

  if (
    normalized.includes("community preservation") ||
    normalized.includes("cpc")
  ) {
    topics.add("community-preservation");
  }

  if (
    normalized.includes("fee") ||
    normalized.includes("revenue") ||
    normalized.includes("finance")
  ) {
    topics.add("town-revenue");
  }

  return Array.from(topics);
}

function parseRow(body, year, row) {
  const rowId = row.match(/<tr id="row([^"]+)"/i)?.[1];
  const meetingLabel = row.match(/<strong aria-label="Agenda for ([^"]+)"/i)?.[1];
  const agendaMatch = row.match(
    /<p>\s*<a[^>]+href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/i,
  );
  const postedMatch = row.match(/Posted([\s\S]*?)<\/h3>/i);
  const minutesMatch = row.match(/<td class="minutes"><a href="([^"]+)"/i);
  const formatMatches = Array.from(
    row.matchAll(
      /role="menuitem"[^>]+href="([^"]+)"[^>]*>(Agenda|HTML|PDF|Packet)<\/a>/gi,
    ),
  );

  if (!rowId || !meetingLabel || !agendaMatch) {
    return null;
  }

  const agendaPath = agendaMatch[1];
  const title = stripTags(agendaMatch[2]);
  const postedAt = postedMatch ? stripTags(postedMatch[1]).replace(/^-\s*/, "") : null;
  const availableFormats = formatMatches.length
    ? Array.from(new Set(formatMatches.map((match) => match[2].toLowerCase())))
    : ["agenda"];
  const meetingDate = toIsoDate(meetingLabel);
  const meetingYear = Number.parseInt(meetingDate.slice(0, 4), 10) || year;

  return {
    id: `${body.id}-${meetingDate}-${rowId}`,
    bodyId: body.id,
    bodyLabel: body.label,
    year: meetingYear,
    meetingDate,
    meetingLabel,
    postedAt,
    title,
    agendaUrl: `${baseUrl}${agendaPath}`,
    minutesUrl: minutesMatch ? `${baseUrl}${minutesMatch[1]}` : null,
    recordType: minutesMatch ? "agenda+minutes" : "agenda",
    availableFormats,
    topics: inferTopics(body.id, title),
    sourcePageUrl: `${baseUrl}/AgendaCenter`,
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "BallotLightArchiveBuilder/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchCategoryYear(body, year) {
  const response = await fetch(`${baseUrl}/AgendaCenter/UpdateCategoryList`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "user-agent": "BallotLightArchiveBuilder/1.0",
    },
    body: new URLSearchParams({
      year: String(year),
      catID: String(body.categoryId),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch category ${body.categoryId} for ${year}: ${response.status}`,
    );
  }

  return response.text();
}

async function fetchTrackedBodies() {
  const html = await fetchText(`${baseUrl}/AgendaCenter`);
  const categoryMatches = Array.from(
    html.matchAll(
      /<input[^>]+name="chkCategoryID"[^>]+value="(\d+)"[^>]*>\s*([^<]+?)\s*<\/label>/gi,
    ),
  );
  const labelsByCategoryId = new Map(
    categoryMatches.map((match) => [
      Number.parseInt(match[1], 10),
      collapseWhitespace(match[2]),
    ]),
  );

  return trackedCategoryIds.map((categoryId) => {
    const rawLabel = labelsByCategoryId.get(categoryId);

    if (!rawLabel) {
      throw new Error(`Could not locate category ${categoryId} on Agenda Center`);
    }

    const label = normalizeBodyLabel(rawLabel);

    return {
      id: slugify(label),
      label,
      categoryId,
      years: archiveYears,
    };
  });
}

async function buildArchive() {
  const trackedBodies = await fetchTrackedBodies();
  const records = [];

  for (const body of trackedBodies) {
    for (const year of body.years) {
      const html = await fetchCategoryYear(body, year);
      const rowMatches = Array.from(
        html.matchAll(/<tr id="row[^"]+" class="catAgendaRow">[\s\S]*?<\/tr>/gi),
      );

      for (const match of rowMatches) {
        const parsed = parseRow(body, year, match[0]);
        if (parsed) {
          records.push(parsed);
        }
      }
    }
  }

  const deduped = Array.from(
    new Map(
      records.map((record) => [
        `${record.bodyId}:${record.agendaUrl}:${record.minutesUrl ?? ""}`,
        record,
      ]),
    ).values(),
  ).sort((left, right) => {
    if (left.meetingDate === right.meetingDate) {
      return left.title.localeCompare(right.title);
    }

    return right.meetingDate.localeCompare(left.meetingDate);
  });

  mkdirSync(new URL("../data/", import.meta.url), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(deduped, null, 2)}\n`);

  console.log(
    `generated ${deduped.length} official records across ${trackedBodies.length} bodies for ${Math.min(...archiveYears)}-${Math.max(...archiveYears)}`,
  );
}

await buildArchive();
