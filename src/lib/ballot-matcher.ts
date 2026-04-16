import type {
  CandidateProfile,
  EvidenceKind,
  OfficeId,
  PriorRecordStrength,
  TopicId,
} from "@/lib/winchester-data";

export type MatcherPriorityId =
  | "protect-schools"
  | "lower-tax-pressure"
  | "affordability"
  | "accountability"
  | "inclusive-community"
  | "sustainability";

export type MatcherPriority = {
  id: MatcherPriorityId;
  label: string;
  description: string;
  defaultWeight: number;
  topicWeights: Partial<Record<TopicId, number>>;
  sparseNote?: string;
};

export type PrioritySelection = Record<MatcherPriorityId, number>;

export type CandidateMatchResult = {
  candidate: CandidateProfile;
  score: number;
  normalizedScore: number;
  confidence: number;
  confidenceLabel: string;
  evidenceLabel: string;
  reasonLabels: string[];
  hasEnoughInformation: boolean;
};

export type OfficeMatchResult = {
  officeId: OfficeId;
  officeLabel: string;
  recommendation: CandidateMatchResult | null;
  recommendationReason: string;
  rankings: CandidateMatchResult[];
};

const toneWeights = {
  support: 1,
  caution: -0.8,
  monitor: 0.25,
  gap: -0.25,
} as const;

const priorRecordWeights: Record<PriorRecordStrength, number> = {
  direct: 1,
  adjacent: 0.8,
  limited: 0.55,
};

const evidenceKindWeights: Record<EvidenceKind, number> = {
  vote: 1,
  context: 0.72,
  forum: 0.62,
  statement: 0.52,
  "record-gap": 0.18,
};

export const matcherPriorities: MatcherPriority[] = [
  {
    id: "protect-schools",
    label: "Protect school quality",
    description:
      "Keep literacy, tutoring, student supports, and school facilities high on the list.",
    defaultWeight: 4,
    topicWeights: {
      "school-budget": 1.45,
      literacy: 1.25,
      "mental-health": 1,
      "school-facilities": 0.85,
      metco: 0.35,
    },
  },
  {
    id: "lower-tax-pressure",
    label: "Lower tax pressure",
    description:
      "Prefer restraint on override asks and more emphasis on non-tax revenue.",
    defaultWeight: 2,
    topicWeights: {
      override: -1.55,
      "town-revenue": 1.2,
      affordability: 0.9,
      "school-budget": -0.45,
      "fiscal-governance": 0.35,
    },
  },
  {
    id: "affordability",
    label: "Affordability and housing",
    description:
      "Reward candidates who talk about fee pressure, tax relief, and a broader housing mix.",
    defaultWeight: 2,
    topicWeights: {
      affordability: 1.45,
      "town-revenue": 0.75,
      override: -0.55,
    },
  },
  {
    id: "accountability",
    label: "Transparent, measurable government",
    description:
      "Favor public process discipline, long-range planning, and clearer accountability.",
    defaultWeight: 3,
    topicWeights: {
      "fiscal-governance": 1.4,
      "town-revenue": 0.45,
      "school-budget": 0.2,
    },
  },
  {
    id: "inclusive-community",
    label: "Inclusion and opportunity",
    description:
      "Prioritize belonging, student support, and broader educational access.",
    defaultWeight: 1,
    topicWeights: {
      metco: 1.35,
      "mental-health": 1.1,
      literacy: 0.25,
    },
  },
  {
    id: "sustainability",
    label: "Sustainability and environmental health",
    description:
      "Useful for future ballots, but the current candidate dataset is still thin here.",
    defaultWeight: 0,
    topicWeights: {},
    sparseNote:
      "Current candidate profiles do not yet have enough sustainability-specific evidence to score this reliably.",
  },
];

function getRelevantTopicIds(selection: PrioritySelection) {
  const topicIds = new Set<TopicId>();

  for (const priority of matcherPriorities) {
    if (selection[priority.id] <= 0) {
      continue;
    }

    for (const topicId of Object.keys(priority.topicWeights) as TopicId[]) {
      topicIds.add(topicId);
    }
  }

  return Array.from(topicIds);
}

function getPriorityReasonContributions(
  candidate: CandidateProfile,
  selection: PrioritySelection,
) {
  return candidate.stanceCards
    .map((stance) => {
      const contribution = matcherPriorities.reduce((total, priority) => {
        const selectedWeight = selection[priority.id];
        const topicWeight = priority.topicWeights[stance.topicId] ?? 0;

        if (selectedWeight <= 0 || topicWeight === 0) {
          return total;
        }

        return total + selectedWeight * topicWeight * toneWeights[stance.tone];
      }, 0);

      return {
        label: stance.label,
        contribution,
      };
    })
    .filter((item) => item.contribution > 0.12)
    .sort((left, right) => right.contribution - left.contribution);
}

function getEvidenceSignal(
  candidate: CandidateProfile,
  relevantTopicIds: TopicId[],
) {
  if (relevantTopicIds.length === 0) {
    return 0;
  }

  const relevantEvidence = candidate.evidence.filter((item) =>
    item.topicIds.some((topicId) => relevantTopicIds.includes(topicId)),
  );

  if (relevantEvidence.length === 0) {
    return 0;
  }

  return (
    relevantEvidence.reduce(
      (total, item) => total + evidenceKindWeights[item.kind],
      0,
    ) / relevantEvidence.length
  );
}

function getConfidenceLabel(confidence: number) {
  if (confidence >= 0.82) {
    return "Direct record-led";
  }

  if (confidence >= 0.68) {
    return "Mixed public record";
  }

  if (confidence >= 0.54) {
    return "Mostly statements";
  }

  return "Too thin to trust";
}

function getEvidenceLabel(
  candidate: CandidateProfile,
  relevantTopicIds: TopicId[],
) {
  const relevantEvidence = candidate.evidence.filter((item) =>
    item.topicIds.some((topicId) => relevantTopicIds.includes(topicId)),
  );

  if (relevantEvidence.some((item) => item.kind === "vote")) {
    return "Includes prior public votes";
  }

  if (relevantEvidence.some((item) => item.kind === "forum")) {
    return "Leans on forum and public-position evidence";
  }

  if (relevantEvidence.some((item) => item.kind === "statement")) {
    return "Leans on campaign profiles and statements";
  }

  return "Very little relevant evidence on these priorities";
}

function scoreCandidate(
  candidate: CandidateProfile,
  selection: PrioritySelection,
): CandidateMatchResult {
  const relevantTopicIds = getRelevantTopicIds(selection);
  const stanceScore = candidate.stanceCards.reduce((total, stance) => {
    const contribution = matcherPriorities.reduce((priorityTotal, priority) => {
      const selectedWeight = selection[priority.id];
      const topicWeight = priority.topicWeights[stance.topicId] ?? 0;

      if (selectedWeight <= 0 || topicWeight === 0) {
        return priorityTotal;
      }

      return (
        priorityTotal +
        selectedWeight * topicWeight * toneWeights[stance.tone]
      );
    }, 0);

    return total + contribution;
  }, 0);

  const evidenceSignal = getEvidenceSignal(candidate, relevantTopicIds);
  const priorRecordSignal = priorRecordWeights[candidate.priorRecordStrength];
  const confidence =
    priorRecordSignal * 0.58 + evidenceSignal * 0.42;
  const weightedScore = stanceScore * (0.72 + confidence * 0.28);
  const reasonLabels = getPriorityReasonContributions(candidate, selection)
    .slice(0, 3)
    .map((item) => item.label);

  const relevantEvidenceCount = candidate.evidence.filter((item) =>
    item.topicIds.some((topicId) => relevantTopicIds.includes(topicId)),
  ).length;
  const hasEnoughInformation =
    relevantTopicIds.length === 0 ||
    (reasonLabels.length > 0 && (confidence >= 0.54 || relevantEvidenceCount >= 2));

  return {
    candidate,
    score: weightedScore,
    normalizedScore: 0,
    confidence,
    confidenceLabel: getConfidenceLabel(confidence),
    evidenceLabel: getEvidenceLabel(candidate, relevantTopicIds),
    reasonLabels,
    hasEnoughInformation,
  };
}

function normalizeResults(results: CandidateMatchResult[]) {
  if (results.length === 0) {
    return results;
  }

  const scores = results.map((result) => result.score);
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);

  return results.map((result) => ({
    ...result,
    normalizedScore:
      highest === lowest
        ? 50
        : Math.round(((result.score - lowest) / (highest - lowest)) * 100),
  }));
}

function buildOfficeRecommendation(
  officeId: OfficeId,
  officeLabel: string,
  candidates: CandidateProfile[],
  selection: PrioritySelection,
): OfficeMatchResult {
  const rankings = normalizeResults(
    candidates
      .map((candidate) => scoreCandidate(candidate, selection))
      .sort((left, right) => right.score - left.score),
  );

  const [top, runnerUp] = rankings;

  if (!top) {
    return {
      officeId,
      officeLabel,
      recommendation: null,
      recommendationReason: "No candidates are loaded for this office yet.",
      rankings,
    };
  }

  const scoreGap = top.score - (runnerUp?.score ?? 0);

  if (!top.hasEnoughInformation) {
    return {
      officeId,
      officeLabel,
      recommendation: null,
      recommendationReason:
        "The current evidence is too thin on your chosen priorities to recommend a candidate here.",
      rankings,
    };
  }

  if (runnerUp && scoreGap < 0.42 && top.confidence < 0.78) {
    return {
      officeId,
      officeLabel,
      recommendation: null,
      recommendationReason:
        "The current match is too close to call confidently. Review the ranked profiles instead of taking a single recommendation.",
      rankings,
    };
  }

  if (top.confidence < 0.6) {
    return {
      officeId,
      officeLabel,
      recommendation: null,
      recommendationReason: `${top.candidate.name} currently leads on issue fit, but the supporting record is still too thin to make a ballot recommendation here.`,
      rankings,
    };
  }

  return {
    officeId,
    officeLabel,
    recommendation: top,
    recommendationReason:
      top.confidence >= 0.72
        ? "Prior public record carries real weight here, so the match is more dependable."
        : "This match is directionally useful, but it still leans partly on statements and campaign-facing material.",
    rankings,
  };
}

export function getDefaultPrioritySelection(): PrioritySelection {
  return matcherPriorities.reduce(
    (selection, priority) => {
      selection[priority.id] = priority.defaultWeight;
      return selection;
    },
    {} as PrioritySelection,
  );
}

export function getSparseSelectedPriorities(selection: PrioritySelection) {
  return matcherPriorities.filter(
    (priority) => selection[priority.id] > 0 && priority.sparseNote,
  );
}

export function buildBallotMatcherResults(
  candidates: CandidateProfile[],
  selection: PrioritySelection,
) {
  const activeCandidates = candidates.filter((candidate) => candidate.isActiveBallot);
  const offices = Array.from(
    activeCandidates.reduce((accumulator, candidate) => {
      const existing = accumulator.get(candidate.officeId) ?? [];
      existing.push(candidate);
      accumulator.set(candidate.officeId, existing);
      return accumulator;
    }, new Map<OfficeId, CandidateProfile[]>()),
  );

  return offices.map(([officeId, officeCandidates]) =>
    buildOfficeRecommendation(
      officeId,
      officeCandidates[0]?.officeLabel ?? officeId,
      officeCandidates,
      selection,
    ),
  );
}
