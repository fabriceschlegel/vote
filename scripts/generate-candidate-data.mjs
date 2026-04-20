import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const manifestPath = new URL("../data/source-manifest.json", import.meta.url);
const generatedDirectory = new URL("../data/generated/", import.meta.url);
const generatedProfilesPath = new URL("../data/generated/candidate-profiles.json", import.meta.url);
const generatedMetadataPath = new URL(
  "../data/generated/candidate-sync-metadata.json",
  import.meta.url,
);

const promptVersion = "candidate-sync-v1";
const defaultModel = process.env.OPENAI_MODEL ?? "gpt-5.4";
const candidateHistoryCycles = Number.parseInt(
  process.env.BALLOT_LIGHT_CANDIDATE_HISTORY_CYCLES ?? "2",
  10,
);
const dryRun = process.argv.includes("--dry-run");
const forceRegeneration = process.argv.includes("--force");

const topicIds = [
  "school-budget",
  "literacy",
  "mental-health",
  "technology",
  "metco",
  "school-facilities",
  "town-revenue",
  "override",
  "affordability",
  "fiscal-governance",
];

const officeMap = new Map([
  [
    "school committee",
    {
      id: "school-committee",
      label: "School Committee",
    },
  ],
  [
    "school committe",
    {
      id: "school-committee",
      label: "School Committee",
    },
  ],
  [
    "select board",
    {
      id: "select-board",
      label: "Select Board",
    },
  ],
  [
    "planning board",
    {
      id: "planning-board",
      label: "Planning Board",
    },
  ],
]);

const statusEnum = ["running", "elected", "lost", "reelected"];
const priorRecordStrengthEnum = ["direct", "adjacent", "limited"];
const evidenceKindEnum = ["vote", "statement", "forum", "context", "record-gap"];
const stanceToneEnum = ["support", "caution", "monitor", "gap"];

function readJson(url, fallback = null) {
  if (!existsSync(url)) {
    return fallback;
  }

  return JSON.parse(readFileSync(url, "utf8"));
}

function writeJson(url, payload) {
  mkdirSync(new URL(".", url), { recursive: true });
  writeFileSync(url, `${JSON.stringify(payload, null, 2)}\n`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanCandidateName(value) {
  return value
    .replace(/^dr\.\s+/i, "")
    .replace(/\(([^)]+)\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildNamePattern(name) {
  const normalized = cleanCandidateName(name);
  const parts = normalized.split(/\s+/);
  if (parts.length < 2) {
    return new RegExp(`\\b${escapeRegExp(normalized)}\\b`, "i");
  }

  const first = escapeRegExp(parts[0]);
  const last = escapeRegExp(parts.at(-1));

  return new RegExp(`\\b${first}\\b[\\s\\w.]{0,40}\\b${last}\\b`, "i");
}

function dropRelatedNews(text) {
  return text
    .split(/\bRelated(?:\s+\d{4}\s+Elections|\s+News)?\b/i)[0]
    .trim();
}

function trimForModel(text, limit) {
  return text.length <= limit ? text : `${text.slice(0, limit)}...`;
}

function extractCandidateContext(sourceDocument, candidate) {
  const rawText = dropRelatedNews(sourceDocument.text ?? "");
  if (rawText.length === 0) {
    return "";
  }

  const mentionPattern = buildNamePattern(candidate.name);
  const match = rawText.match(mentionPattern);
  const index = match?.index ?? -1;

  if (sourceDocument.documentType === "candidate-profile") {
    return trimForModel(rawText, 7000);
  }

  if (index >= 0) {
    const start = Math.max(0, index - 700);
    const end = Math.min(rawText.length, index + 4200);
    return trimForModel(rawText.slice(start, end), 5000);
  }

  return trimForModel(rawText, 3200);
}

function extractElectionYear(source) {
  return Number.parseInt(String(source.publishedAt).slice(0, 4), 10);
}

function buildCandidateSeed(source) {
  const match = source.title.match(/^For (.+?):\s*(.+)$/i);
  if (!match) {
    return null;
  }

  const office = officeMap.get(match[1].trim().toLowerCase());
  if (!office) {
    return null;
  }

  const name = cleanCandidateName(match[2]);
  const electionYear = extractElectionYear(source);
  const slug = slugify(name);

  return {
    id: slug,
    slug,
    name,
    electionYear,
    officeId: office.id,
    officeLabel: office.label,
    raceLabel: `${electionYear} ${office.label} race`,
    profileSourceId: source.id,
    profileSourceTitle: source.title,
  };
}

function compareCandidates(left, right) {
  if (left.isActiveBallot !== right.isActiveBallot) {
    return left.isActiveBallot ? -1 : 1;
  }

  if (left.electionYear !== right.electionYear) {
    return right.electionYear - left.electionYear;
  }

  return left.name.localeCompare(right.name);
}

function sortDocumentsForCandidate(candidate, sourceIds, sourceById, derivedById) {
  const ordered = [...sourceIds].map((sourceId) => ({
    source: sourceById.get(sourceId),
    derived: derivedById.get(sourceId),
  }));

  ordered.sort((left, right) => {
    const leftIsProfile = left.source.id === candidate.profileSourceId;
    const rightIsProfile = right.source.id === candidate.profileSourceId;
    if (leftIsProfile !== rightIsProfile) {
      return leftIsProfile ? -1 : 1;
    }

    const leftIsOfficialResults = left.source.kind === "official" && left.derived?.documentType === "election-results";
    const rightIsOfficialResults = right.source.kind === "official" && right.derived?.documentType === "election-results";
    if (leftIsOfficialResults !== rightIsOfficialResults) {
      return leftIsOfficialResults ? -1 : 1;
    }

    const leftScore = left.derived?.qualityScore ?? 0;
    const rightScore = right.derived?.qualityScore ?? 0;
    if (leftScore !== rightScore) {
      return rightScore - leftScore;
    }

    return String(right.source.publishedAt).localeCompare(String(left.source.publishedAt));
  });

  return ordered;
}

function candidateAppearsInSource(candidate, source, sourceDocument) {
  const haystack = `${source.title}\n${dropRelatedNews(sourceDocument.text ?? "")}`;
  return buildNamePattern(candidate.name).test(haystack);
}

function buildCandidateSourceIds(candidate, allSources, derivedById) {
  const sourceIds = new Set([candidate.profileSourceId]);

  for (const source of allSources) {
    const derived = derivedById.get(source.id);
    if (!derived) {
      continue;
    }

    if (source.id === candidate.profileSourceId) {
      continue;
    }

    const year = extractElectionYear(source);
    const yearDistance = Math.abs(year - candidate.electionYear);
    if (yearDistance > 2) {
      continue;
    }

    if (source.kind === "official" && derived.documentType === "election-results") {
      if (year === candidate.electionYear) {
        sourceIds.add(source.id);
      }
      continue;
    }

    if (candidateAppearsInSource(candidate, source, derived)) {
      sourceIds.add(source.id);
    }
  }

  return Array.from(sourceIds);
}

function buildFingerprint(candidate, orderedDocuments, model) {
  const digest = createHash("sha256");
  digest.update(promptVersion);
  digest.update(model);
  digest.update(JSON.stringify(candidate));
  for (const entry of orderedDocuments) {
    digest.update(entry.source.id);
    digest.update(String(entry.source.publishedAt));
    digest.update(entry.derived?.sha256 ?? "");
    digest.update(entry.derived?.qualityScore?.toString() ?? "");
  }
  return digest.digest("hex");
}

function sanitizeEvidence(candidateId, evidence, allowedSourceIds) {
  const seen = new Set();
  const allowedTopics = new Set(topicIds);

  return evidence
    .filter((item) => allowedSourceIds.has(item.sourceId))
    .map((item, index) => {
      const id = slugify(item.id || `${candidateId}-${item.sourceId}-${index + 1}`);
      const uniqueId = seen.has(id) ? `${id}-${index + 1}` : id;
      seen.add(uniqueId);

      return {
        id: uniqueId,
        kind: evidenceKindEnum.includes(item.kind) ? item.kind : "context",
        title: String(item.title).trim(),
        summary: String(item.summary).trim(),
        topicIds: Array.from(
          new Set((item.topicIds ?? []).filter((topicId) => allowedTopics.has(topicId))),
        ).slice(0, 3),
        sourceId: item.sourceId,
      };
    })
    .filter((item) => item.title && item.summary && item.topicIds.length > 0)
    .slice(0, 6);
}

function sanitizeStanceCards(stanceCards) {
  const allowedTopics = new Set(topicIds);
  return (stanceCards ?? [])
    .filter((item) => allowedTopics.has(item.topicId))
    .map((item) => ({
      topicId: item.topicId,
      tone: stanceToneEnum.includes(item.tone) ? item.tone : "monitor",
      label: String(item.label).trim(),
      detail: String(item.detail).trim(),
    }))
    .filter((item) => item.label && item.detail)
    .slice(0, 5);
}

function sanitizeProfile(candidate, rawProfile, latestElectionYear, allowedSourceIds) {
  return {
    id: candidate.id,
    slug: candidate.slug,
    name: candidate.name,
    electionYear: candidate.electionYear,
    isActiveBallot: candidate.electionYear === latestElectionYear,
    officeId: candidate.officeId,
    officeLabel: candidate.officeLabel,
    raceLabel: candidate.raceLabel,
    status: statusEnum.includes(rawProfile.status) ? rawProfile.status : "running",
    background: String(rawProfile.background).trim(),
    summary: String(rawProfile.summary).trim(),
    locationNote: String(rawProfile.locationNote).trim(),
    priorRecordStrength: priorRecordStrengthEnum.includes(rawProfile.priorRecordStrength)
      ? rawProfile.priorRecordStrength
      : "limited",
    priorRecordLabel: String(rawProfile.priorRecordLabel).trim(),
    priorRecordSummary: String(rawProfile.priorRecordSummary).trim(),
    keyThemes: Array.from(new Set((rawProfile.keyThemes ?? []).map((item) => String(item).trim())))
      .filter(Boolean)
      .slice(0, 5),
    stanceCards: sanitizeStanceCards(rawProfile.stanceCards),
    evidence: sanitizeEvidence(candidate.id, rawProfile.evidence, allowedSourceIds),
  };
}

function buildSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "status",
      "background",
      "summary",
      "locationNote",
      "priorRecordStrength",
      "priorRecordLabel",
      "priorRecordSummary",
      "keyThemes",
      "stanceCards",
      "evidence",
    ],
    properties: {
      status: {
        type: "string",
        enum: statusEnum,
      },
      background: {
        type: "string",
      },
      summary: {
        type: "string",
      },
      locationNote: {
        type: "string",
      },
      priorRecordStrength: {
        type: "string",
        enum: priorRecordStrengthEnum,
      },
      priorRecordLabel: {
        type: "string",
      },
      priorRecordSummary: {
        type: "string",
      },
      keyThemes: {
        type: "array",
        items: {
          type: "string",
        },
        minItems: 3,
        maxItems: 5,
      },
      stanceCards: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["topicId", "tone", "label", "detail"],
          properties: {
            topicId: {
              type: "string",
              enum: topicIds,
            },
            tone: {
              type: "string",
              enum: stanceToneEnum,
            },
            label: {
              type: "string",
            },
            detail: {
              type: "string",
            },
          },
        },
        minItems: 3,
        maxItems: 5,
      },
      evidence: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "kind", "title", "summary", "topicIds", "sourceId"],
          properties: {
            id: {
              type: "string",
            },
            kind: {
              type: "string",
              enum: evidenceKindEnum,
            },
            title: {
              type: "string",
            },
            summary: {
              type: "string",
            },
            topicIds: {
              type: "array",
              items: {
                type: "string",
                enum: topicIds,
              },
              minItems: 1,
              maxItems: 3,
            },
            sourceId: {
              type: "string",
            },
          },
        },
        minItems: 3,
        maxItems: 6,
      },
    },
  };
}

function extractOutputText(responseJson) {
  if (typeof responseJson.output_text === "string" && responseJson.output_text.length > 0) {
    return responseJson.output_text;
  }

  for (const item of responseJson.output ?? []) {
    if (item.type !== "message") {
      continue;
    }

    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  throw new Error("OpenAI response did not include output text.");
}

async function generateCandidateProfile(candidate, sourcePacket, model) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required to generate candidate data.");
  }

  const instructions = [
    "You generate structured civic candidate profiles for a static voting guide.",
    "Use only the provided source material. Do not invent facts, vote histories, or policy positions.",
    "If the sources do not prove something, either omit it or express uncertainty conservatively.",
    "Use only the provided source IDs in evidence.sourceId.",
    "Keep prose concise, factual, and source-grounded.",
    "For status: use 'running' when the race appears current but no official result is provided; use 'elected' or 'reelected' for winners; use 'lost' for candidates who clearly lost.",
    `Valid topic IDs: ${topicIds.join(", ")}.`,
  ].join(" ");

  const input = [
    `Candidate seed: ${JSON.stringify(candidate, null, 2)}`,
    `Allowed source IDs: ${sourcePacket.map((source) => source.sourceId).join(", ")}`,
    "Source packet:",
    JSON.stringify(sourcePacket, null, 2),
  ].join("\n\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      store: false,
      instructions,
      input,
      text: {
        format: {
          type: "json_schema",
          name: "ballot_light_candidate_profile",
          strict: true,
          schema: buildSchema(),
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI candidate sync failed (${response.status}): ${errorText}`);
  }

  const responseJson = await response.json();
  return JSON.parse(extractOutputText(responseJson));
}

function buildSourcePacket(candidate, orderedDocuments) {
  return orderedDocuments.slice(0, 8).map(({ source, derived }) => ({
    sourceId: source.id,
    title: source.title,
    publisher: source.publisher,
    kind: source.kind,
    publishedAt: source.publishedAt,
    url: source.url,
    documentType: derived?.documentType ?? null,
    qualityLabel: derived?.qualityLabel ?? null,
    text: derived ? extractCandidateContext(derived, candidate) : "",
  }));
}

function loadDerivedSources(manifest) {
  const derivedById = new Map();

  for (const source of manifest) {
    const derivedPath = new URL(`../data/derived/sources/${source.id}.json`, import.meta.url);
    const derived = readJson(derivedPath);
    if (derived) {
      derivedById.set(source.id, derived);
    }
  }

  return derivedById;
}

function chooseRetainedYears(candidates) {
  const years = Array.from(new Set(candidates.map((candidate) => candidate.electionYear))).sort(
    (left, right) => right - left,
  );
  return new Set(years.slice(0, Math.max(candidateHistoryCycles, 1)));
}

function summarizeCandidatePlan(candidates, sourceById, derivedById) {
  return candidates.map((candidate) => {
    const sourceIds = buildCandidateSourceIds(candidate, Array.from(sourceById.values()), derivedById);
    return {
      id: candidate.id,
      name: candidate.name,
      office: candidate.officeLabel,
      electionYear: candidate.electionYear,
      sourceCount: sourceIds.length,
      sourceIds,
    };
  });
}

async function main() {
  const manifest = readJson(manifestPath, []);
  const sourceById = new Map(manifest.map((source) => [source.id, source]));
  const derivedById = loadDerivedSources(manifest);

  const candidateSeeds = manifest
    .map((source) => buildCandidateSeed(source))
    .filter(Boolean);

  const retainedYears = chooseRetainedYears(candidateSeeds);
  const candidates = candidateSeeds.filter((candidate) => retainedYears.has(candidate.electionYear));
  const latestElectionYear = candidates.reduce(
    (current, candidate) => Math.max(current, candidate.electionYear),
    0,
  );

  if (dryRun) {
    console.log(JSON.stringify(summarizeCandidatePlan(candidates, sourceById, derivedById), null, 2));
    return;
  }

  const existingProfiles = readJson(generatedProfilesPath, []);
  const existingMetadata = readJson(generatedMetadataPath, {
    generatedAt: null,
    model: null,
    promptVersion,
    candidates: [],
  });
  const existingProfileById = new Map(existingProfiles.map((profile) => [profile.id, profile]));
  const existingMetadataById = new Map(
    (existingMetadata.candidates ?? []).map((candidate) => [candidate.id, candidate]),
  );

  const nextProfiles = [];
  const nextMetadataCandidates = [];

  for (const candidate of candidates) {
    const sourceIds = buildCandidateSourceIds(candidate, manifest, derivedById);
    const orderedDocuments = sortDocumentsForCandidate(candidate, sourceIds, sourceById, derivedById);
    const fingerprint = buildFingerprint(candidate, orderedDocuments, defaultModel);
    const previousProfile = existingProfileById.get(candidate.id);
    const previousMetadata = existingMetadataById.get(candidate.id);
    const allowedSourceIds = new Set(sourceIds);

    if (
      !forceRegeneration &&
      previousProfile &&
      previousMetadata?.fingerprint === fingerprint &&
      previousMetadata?.model === defaultModel &&
      previousMetadata?.promptVersion === promptVersion
    ) {
      const reusedProfile = {
        ...previousProfile,
        isActiveBallot: candidate.electionYear === latestElectionYear,
        raceLabel: candidate.raceLabel,
      };

      nextProfiles.push(reusedProfile);
      nextMetadataCandidates.push({
        id: candidate.id,
        electionYear: candidate.electionYear,
        sourceIds,
        fingerprint,
        model: defaultModel,
        promptVersion,
        reused: true,
      });
      console.log(`reused ${candidate.name}`);
      continue;
    }

    const sourcePacket = buildSourcePacket(candidate, orderedDocuments);
    let rawProfile;

    try {
      rawProfile = await generateCandidateProfile(candidate, sourcePacket, defaultModel);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate ${candidate.name}: ${message}`);
    }

    const sanitizedProfile = sanitizeProfile(
      candidate,
      rawProfile,
      latestElectionYear,
      allowedSourceIds,
    );

    nextProfiles.push(sanitizedProfile);
    nextMetadataCandidates.push({
      id: candidate.id,
      electionYear: candidate.electionYear,
      sourceIds,
      fingerprint,
      model: defaultModel,
      promptVersion,
      reused: false,
    });
    console.log(`generated ${candidate.name}`);
  }

  nextProfiles.sort(compareCandidates);

  mkdirSync(generatedDirectory, { recursive: true });
  writeJson(generatedProfilesPath, nextProfiles);
  writeJson(generatedMetadataPath, {
    generatedAt: new Date().toISOString(),
    model: defaultModel,
    promptVersion,
    candidates: nextMetadataCandidates,
  });

  console.log(
    `generated ${nextProfiles.length} candidate profiles across ${retainedYears.size} election cycle(s)`,
  );
}

await main();
