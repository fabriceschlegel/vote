import { expandedCandidateProfiles, expandedVoteLedger } from "@/lib/winchester-data-expansion";
import sourceManifest from "../../data/source-manifest.json";

export type SourceKind = "official" | "local-news";
export type OfficeId = "school-committee" | "select-board" | "planning-board";
export type TopicId =
  | "school-budget"
  | "literacy"
  | "mental-health"
  | "technology"
  | "metco"
  | "school-facilities"
  | "town-revenue"
  | "override"
  | "affordability"
  | "fiscal-governance";
export type EvidenceKind = "vote" | "statement" | "forum" | "context" | "record-gap";
export type StanceTone = "support" | "caution" | "monitor" | "gap";
export type PriorRecordStrength = "direct" | "adjacent" | "limited";

export type Source = {
  id: string;
  title: string;
  publisher: string;
  kind: SourceKind;
  publishedAt: string;
  url: string;
};

export type Topic = {
  id: TopicId;
  label: string;
  shortLabel: string;
  lens: string;
};

export type CandidateStance = {
  topicId: TopicId;
  tone: StanceTone;
  label: string;
  detail: string;
};

export type CandidateEvidence = {
  id: string;
  kind: EvidenceKind;
  title: string;
  summary: string;
  topicIds: TopicId[];
  sourceId: string;
};

export type CandidateProfile = {
  id: string;
  slug: string;
  name: string;
  electionYear: number;
  isActiveBallot: boolean;
  officeId: OfficeId;
  officeLabel: string;
  raceLabel: string;
  status: "elected" | "lost" | "reelected";
  background: string;
  summary: string;
  locationNote: string;
  priorRecordStrength: PriorRecordStrength;
  priorRecordLabel: string;
  priorRecordSummary: string;
  keyThemes: string[];
  stanceCards: CandidateStance[];
  evidence: CandidateEvidence[];
};

export type VoteParticipant = {
  name: string;
  role: string;
  vote:
    | "Aye"
    | "No"
    | "Supported amendment"
    | "No second"
    | "Not on body"
    | "Won seat"
    | "Lost seat"
    | "Yes vote"
    | "No vote";
  note: string;
};

export type VoteLedgerEntry = {
  id: string;
  title: string;
  when: string;
  result: string;
  whyItMatters: string;
  sourceId: string;
  participants: VoteParticipant[];
};

export type TownSignal = {
  label: string;
  value: string;
  note: string;
  sourceId: string;
};

export type OfficeSummary = {
  id: OfficeId;
  label: string;
  description: string;
  currentPressure: string;
};

export const siteTitle = "Ballot Light";
export const siteDescription =
  "A Winchester civic voting MVP that turns scattered town records into candidate stance summaries, vote ledgers, and source-backed issue pages.";

export const topics: Topic[] = [
  {
    id: "school-budget",
    label: "School budget",
    shortLabel: "Budget",
    lens: "How they talk about school spending, cuts, and fiscal runway.",
  },
  {
    id: "literacy",
    label: "Literacy reform",
    shortLabel: "Literacy",
    lens: "Support for evidence-based reading instruction, tutoring, and Tier 2 supports.",
  },
  {
    id: "mental-health",
    label: "Student mental health",
    shortLabel: "Mental health",
    lens: "Whether they prioritize school climate, counseling, and student belonging.",
  },
  {
    id: "technology",
    label: "Technology and AI",
    shortLabel: "Technology",
    lens: "How they frame AI policy, classroom tech use, and direct instruction.",
  },
  {
    id: "metco",
    label: "METCO and new commitments",
    shortLabel: "METCO",
    lens: "Whether they want Winchester to expand district commitments now or later.",
  },
  {
    id: "school-facilities",
    label: "School facilities",
    shortLabel: "Facilities",
    lens: "How much urgency they place on Muraco and long-term capital planning.",
  },
  {
    id: "town-revenue",
    label: "Town revenue",
    shortLabel: "Revenue",
    lens: "How they plan to reduce pressure on property taxes through fees, assets, and growth.",
  },
  {
    id: "override",
    label: "Tax override",
    shortLabel: "Override",
    lens: "Whether they backed the March 2026 override and how they responded after it failed.",
  },
  {
    id: "affordability",
    label: "Affordability",
    shortLabel: "Affordability",
    lens: "How they talk about regressive fees, tax relief, and staying in Winchester.",
  },
  {
    id: "fiscal-governance",
    label: "Process and accountability",
    shortLabel: "Governance",
    lens: "How they describe transparency, measurable goals, and public decision-making.",
  },
];

export const offices: OfficeSummary[] = [
  {
    id: "school-committee",
    label: "School Committee",
    description:
      "Approves the school budget, sets education policy, and hires the superintendent.",
    currentPressure:
      "Winchester schools are dealing with literacy reform, override fallout, and pressure to protect classroom supports.",
  },
  {
    id: "select-board",
    label: "Select Board",
    description:
      "Sets townwide policy priorities, works with the town manager, and shapes the override and budget strategy.",
    currentPressure:
      "The board is balancing cuts, fee increases, and a possible future override after the March 2026 ballot question failed.",
  },
  {
    id: "planning-board",
    label: "Planning Board",
    description:
      "Shapes zoning, reviews development proposals, and steers the town's housing and mixed-use growth decisions.",
    currentPressure:
      "The board is balancing housing production, downtown design standards, and revenue growth after major zoning changes and a competitive 2026 race.",
  },
];

export const sources = sourceManifest as Source[];

const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));

export const townSignals: TownSignal[] = [
  {
    label: "March 2026 turnout",
    value: "32.6%",
    note: "Official tally from 4,929 ballots cast across 15,115 registered voters.",
    sourceId: "official-election-results-2026",
  },
  {
    label: "Override result",
    value: "2,283 yes / 2,589 no",
    note: "The $11.5M property tax override failed by 306 votes in the certified town results.",
    sourceId: "official-election-results-2026",
  },
  {
    label: "Current budget hole",
    value: "up to $6.7M",
    note: "Select Board members began weighing cuts, fee changes, and another override after the March vote.",
    sourceId: "news-override-fallout",
  },
];

const baseVoteLedger: VoteLedgerEntry[] = [
  {
    id: "school-budget-march-2025",
    title: "School Committee adds 7.15% to the FY26 school budget",
    when: "March 20, 2025",
    result: "Approved 4-1 for a $70.87M proposal",
    whyItMatters:
      "This is the clearest recent recorded school-budget split. Most members backed math interventionists, McCall staffing, and literacy investments. Michelle Bergstrom voted no because she wanted the committee to ask for the full list of additions.",
    sourceId: "news-school-budget-vote-2025",
    participants: [
      {
        name: "Tim Matthews",
        role: "School Committee member",
        vote: "Aye",
        note: "Pushed to include McCall staffing and math interventionists in the request to Town Meeting.",
      },
      {
        name: "Karen Maruyama Bolognese",
        role: "School Committee chair",
        vote: "Aye",
        note: "Backed adding the highest-priority items while staying inside a five-year funding plan.",
      },
      {
        name: "Tom Hopcroft",
        role: "School Committee member",
        vote: "Aye",
        note: "Supported the compromise position to add direct student supports.",
      },
      {
        name: "Michelle Bergstrom",
        role: "School Committee member",
        vote: "No",
        note: "Voted no because she wanted the full tier-one and tier-two package funded, not a smaller compromise.",
      },
    ],
  },
  {
    id: "school-budget-town-meeting-may-2025",
    title: "Heather von Mering moves Town Meeting toward the full FY26 school budget",
    when: "May 5, 2025",
    result: "Amendment passed 102-60, then the amended school budget passed on voice vote",
    whyItMatters:
      "Von Mering was not on the School Committee, but as a Town Meeting member she publicly moved to fund the school budget as requested and argued against leaning on Circuit Breaker reimbursements to paper over recurring needs.",
    sourceId: "news-town-meeting-school-budget-2025",
    participants: [
      {
        name: "Heather von Mering",
        role: "Town Meeting member",
        vote: "Supported amendment",
        note: "Moved to match the School Committee recommendation and asked the Select Board for a longer-term fiscal plan for schools.",
      },
      {
        name: "Town Meeting body",
        role: "Legislative body",
        vote: "Aye",
        note: "Backed the amendment 102-60 and then approved the education article on a voice vote.",
      },
    ],
  },
  {
    id: "school-initiatives-january-2024",
    title: "Shamus Brady backs added math, literacy, and arts spending in the FY25 cycle",
    when: "January 30, 2024",
    result: "School Committee unanimously supported three added initiatives",
    whyItMatters:
      "This shows Brady on the record for direct student-facing add-ons before the current override cycle. He explicitly supported initiatives that served students directly and argued for flexibility around literacy funding.",
    sourceId: "news-school-committee-budget-2024",
    participants: [
      {
        name: "Shamus Brady",
        role: "School Committee member",
        vote: "Aye",
        note: "Said he liked proposals that served students directly and highlighted the need for literacy-funding flexibility.",
      },
    ],
  },
  {
    id: "select-board-override-feb-2026",
    title: "Select Board approves the $11.5M override package",
    when: "February 12, 2026",
    result: "Unanimous vote after a long public negotiation",
    whyItMatters:
      "Michelle Prior was part of the majority that locked in the final override amount and argued the town should not ask for more money than the town's own modeling could justify.",
    sourceId: "news-select-board-override-vote",
    participants: [
      {
        name: "Michelle Prior",
        role: "Select Board chair",
        vote: "Aye",
        note: "Seconded the $9M operating motion and argued against asking voters for a larger cushion than the model supported.",
      },
    ],
  },
];

const baseCandidateProfiles: CandidateProfile[] = [
  {
    id: "john-bellaire",
    slug: "john-bellaire",
    name: "John Bellaire",
    electionYear: 2026,
    isActiveBallot: true,
    officeId: "school-committee",
    officeLabel: "School Committee",
    raceLabel: "2026 School Committee race",
    status: "elected",
    background:
      "Winchester High and Brown graduate working in education policy and school finance at Bellwether.",
    summary:
      "Bellaire ran as a data-heavy school finance candidate focused on literacy reform, mental health, AI policy, and expanding supports like tutoring and METCO.",
    locationNote:
      "Won the March 21, 2026 School Committee race in the official town results, 2,192 to 1,861.",
    priorRecordStrength: "limited",
    priorRecordLabel: "No direct municipal vote record before this race",
    priorRecordSummary:
      "Before winning the seat, Bellaire did not hold a Winchester elected office with a public committee vote history. The MVP therefore leans on his voter-guide answers and forum positions, not recorded School Committee votes.",
    keyThemes: [
      "Evidence-based literacy rollout",
      "High-impact tutoring and MTSS",
      "Student belonging and mental health",
      "Formal AI policy and cautious tech use",
      "Support for METCO and Muraco planning",
    ],
    stanceCards: [
      {
        topicId: "literacy",
        tone: "support",
        label: "Supports districtwide literacy reform",
        detail:
          "Backed expanding evidence-based literacy curriculum and professional development across elementary classrooms.",
      },
      {
        topicId: "school-budget",
        tone: "support",
        label: "Wants targeted adds rather than flat austerity",
        detail:
          "Said prioritized FY27 needs, tutoring, and tiered interventions should stay on the table when Winchester makes cuts.",
      },
      {
        topicId: "mental-health",
        tone: "support",
        label: "Frames culture as a mental-health issue",
        detail:
          "Talked about belonging, arts, athletics, and school culture rather than lowering academic standards.",
      },
      {
        topicId: "technology",
        tone: "support",
        label: "Calls for an actual AI policy",
        detail:
          "Argues Winchester should prepare students for AI while still protecting critical thinking and limiting overuse.",
      },
      {
        topicId: "metco",
        tone: "support",
        label: "Would pursue METCO now",
        detail:
          "Called joining METCO a top priority and said the program benefits both Boston students and Winchester students.",
      },
    ],
    evidence: [
      {
        id: "john-profile-budget",
        kind: "statement",
        title: "Backed FY27 prioritized needs plus tutoring",
        summary:
          "In his candidate profile, Bellaire said he fully supports the district's FY27 prioritized needs, especially tutoring, transportation, literacy, and multi-tiered supports.",
        topicIds: ["school-budget", "literacy"],
        sourceId: "news-john-bellaire-profile",
      },
      {
        id: "john-forum-metco-ai",
        kind: "forum",
        title: "Split from von Mering on METCO and emphasized AI policy",
        summary:
          "At the March forum, Bellaire argued for joining METCO, said Winchester is behind on literacy, and called out the absence of a formal AI policy.",
        topicIds: ["metco", "technology", "literacy"],
        sourceId: "news-school-committee-forum",
      },
      {
        id: "john-election-night",
        kind: "context",
        title: "Election-night summary reinforced his campaign priorities",
        summary:
          "Winchester News reported that Bellaire campaigned on METCO, a formal AI policy, and restoring teacher performance reviews.",
        topicIds: ["metco", "technology", "fiscal-governance"],
        sourceId: "news-election-night-2026",
      },
      {
        id: "john-record-gap",
        kind: "record-gap",
        title: "Direct vote history is still thin",
        summary:
          "Because Bellaire had not yet served on a town committee with roll-call votes, the product flags that his page is statement-heavy until future School Committee votes accumulate.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2026",
      },
    ],
  },
  {
    id: "heather-von-mering",
    slug: "heather-von-mering",
    name: "Heather von Mering",
    electionYear: 2026,
    isActiveBallot: true,
    officeId: "school-committee",
    officeLabel: "School Committee",
    raceLabel: "2026 School Committee race",
    status: "lost",
    background:
      "Parent of five with long involvement in town government, literacy advocacy, and capital-planning work.",
    summary:
      "Von Mering ran as a classroom-first candidate focused on literacy, dyslexia supports, facilities, and measured commitments until the district's basics are fixed.",
    locationNote:
      "Lost the March 21, 2026 School Committee race, but still offers the strongest adjacent public record on school funding among the two candidates.",
    priorRecordStrength: "adjacent",
    priorRecordLabel: "Adjacent public record through Town Meeting and school advocacy",
    priorRecordSummary:
      "Von Mering was not on the School Committee in 2026, but she publicly moved a Town Meeting amendment for the full FY26 school budget and has a visible record of literacy and special-education advocacy.",
    keyThemes: [
      "Protect core literacy and math first",
      "Build stronger Tier 2 supports",
      "Use disciplined measurable goals",
      "Prioritize classroom staffing and school facilities",
      "Delay METCO until basics are in place",
    ],
    stanceCards: [
      {
        topicId: "literacy",
        tone: "support",
        label: "Longtime literacy advocate",
        detail:
          "Frames early literacy and dyslexia identification as the district's most urgent operational fix.",
      },
      {
        topicId: "school-budget",
        tone: "support",
        label: "Protects core classroom spending first",
        detail:
          "Says literacy, math, and Tier 2 supports should be shielded before other enhancements when money is tight.",
      },
      {
        topicId: "school-facilities",
        tone: "support",
        label: "Leans on construction and capital planning experience",
        detail:
          "Ran on a mix of budget discipline and capital-planning experience as Muraco and other building issues advance.",
      },
      {
        topicId: "metco",
        tone: "caution",
        label: "Wants the district to fix core gaps before expanding",
        detail:
          "Argued Winchester should close literacy, math, tutoring, and transportation gaps before joining METCO.",
      },
      {
        topicId: "technology",
        tone: "monitor",
        label: "Suspicious of tech replacing direct instruction",
        detail:
          "Proposed a technology advisory structure and said children should learn to read and write independently of devices.",
      },
    ],
    evidence: [
      {
        id: "heather-profile-priorities",
        kind: "statement",
        title: "Put literacy, math, and Tier 2 supports at the front of the queue",
        summary:
          "In her candidate profile, von Mering said core classroom instruction and interventions should be protected before new enhancements when only some FY27 programs can be funded.",
        topicIds: ["school-budget", "literacy"],
        sourceId: "news-heather-von-mering-profile",
      },
      {
        id: "heather-forum-metco",
        kind: "forum",
        title: "Rejected near-term METCO expansion",
        summary:
          "At the school forum, von Mering said Winchester should not take on METCO until literacy, math, tutoring, and transportation gaps are addressed.",
        topicIds: ["metco", "school-budget"],
        sourceId: "news-school-committee-forum",
      },
      {
        id: "heather-town-meeting-budget",
        kind: "vote",
        title: "Moved Town Meeting to fund the school budget as requested",
        summary:
          "Von Mering argued against using Circuit Breaker reimbursements as a recurring fix and moved the body toward the School Committee's requested budget level.",
        topicIds: ["school-budget", "override", "fiscal-governance"],
        sourceId: "news-town-meeting-school-budget-2025",
      },
      {
        id: "heather-election-night",
        kind: "context",
        title: "Campaign closing message stayed focused on core gaps",
        summary:
          "Election-night coverage summarized von Mering's pitch as fixing literacy and math before taking on newer commitments.",
        topicIds: ["literacy", "school-budget"],
        sourceId: "news-election-night-2026",
      },
    ],
  },
  {
    id: "michelle-prior",
    slug: "michelle-prior",
    name: "Michelle Prior",
    electionYear: 2026,
    isActiveBallot: true,
    officeId: "select-board",
    officeLabel: "Select Board",
    raceLabel: "2026 Select Board race",
    status: "reelected",
    background:
      "Three-year Select Board member, two-year chair, former Finance Committee chair, and lead on the State of the Town revenue workstream.",
    summary:
      "Prior ran as an experienced budget operator: pro-override, pro-revenue diversification, and more cautious than some peers about asking voters for a bigger cushion than the town could defend.",
    locationNote:
      "Won re-election on March 21, 2026 and entered the post-override phase as one of the town's central fiscal decision makers.",
    priorRecordStrength: "direct",
    priorRecordLabel: "Direct governing record",
    priorRecordSummary:
      "Prior had a live Select Board voting record, including the Feb. 12, 2026 override vote and the post-election budget discussions that followed.",
    keyThemes: [
      "Support the override, but keep the ask disciplined",
      "Grow revenue beyond residential taxes",
      "Use fees, leases, and town assets more aggressively",
      "Prefer listening sessions before a second override push",
      "Support more housing options for different age groups",
    ],
    stanceCards: [
      {
        topicId: "override",
        tone: "support",
        label: "Supported the override package",
        detail:
          "Backed the final $11.5M override while resisting a larger ask that she thought the model could not justify.",
      },
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Looks for non-tax revenue first",
        detail:
          "Focuses on fee reviews, transfer-station changes, solar leases, and better monetization of town assets.",
      },
      {
        topicId: "affordability",
        tone: "monitor",
        label: "Balances new revenue against taxpayer stress",
        detail:
          "Repeatedly framed affordability pressures as a reason not to over-ask on the override amount.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Prefers process discipline and broad coordination",
        detail:
          "Emphasizes long-range planning, committee coordination, and learning from why voters said no.",
      },
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Supports housing and business growth as revenue strategy",
        detail:
          "Connects broader housing options and commercial development to the town's long-term fiscal base.",
      },
    ],
    evidence: [
      {
        id: "prior-profile-revenue",
        kind: "statement",
        title: "Profile centered on revenue diversification",
        summary:
          "Prior's voter-guide answers emphasized fee alignment, town-asset monetization, housing options, and commercial growth beyond the property tax levy.",
        topicIds: ["town-revenue", "affordability"],
        sourceId: "news-michelle-prior-profile",
      },
      {
        id: "prior-override-vote",
        kind: "vote",
        title: "Backed the final override number on the Select Board",
        summary:
          "Prior seconded the $9M operating motion and argued the board should not ask residents for a larger cushion than the model required.",
        topicIds: ["override", "fiscal-governance"],
        sourceId: "news-select-board-override-vote",
      },
      {
        id: "prior-state-of-town",
        kind: "context",
        title: "Held a central role in the State of the Town fiscal process",
        summary:
          "The official State of the Town page lists Prior as vice chair and identifies her as a contact for residents tracking the fiscal plan.",
        topicIds: ["fiscal-governance", "town-revenue"],
        sourceId: "official-state-of-town",
      },
      {
        id: "prior-post-defeat",
        kind: "context",
        title: "Wanted feedback before another override push",
        summary:
          "After the ballot failed, Prior argued for focus groups, listening sessions, and surveys before returning to voters with another ask.",
        topicIds: ["override", "fiscal-governance"],
        sourceId: "news-override-fallout",
      },
    ],
  },
  {
    id: "shamus-brady",
    slug: "shamus-brady",
    name: "Shamus Brady",
    electionYear: 2026,
    isActiveBallot: true,
    officeId: "select-board",
    officeLabel: "Select Board",
    raceLabel: "2026 Select Board race",
    status: "lost",
    background:
      "Former School Committee member, former Finance Committee member, and public-school special education administrator.",
    summary:
      "Brady presented himself as the sharper-edged fiscal progressive in the race: pro-override, pro-school investment, openly skeptical of Winchester's regressive fee structure, and comfortable pressing for faster structural change.",
    locationNote:
      "Lost the March 21, 2026 Select Board race, but entered it with the richest recent School Committee vote record of any candidate in the field.",
    priorRecordStrength: "direct",
    priorRecordLabel: "Direct committee vote record",
    priorRecordSummary:
      "Brady served on the School Committee from 2021 through 2024 and used that record heavily in his campaign. Multiple Winchester News reports capture him backing direct student-facing spending and faster literacy action.",
    keyThemes: [
      "Support the override and protect school quality",
      "Push for affordability tools like a residential tax exemption",
      "Recruit businesses and publicize revenue strategy",
      "Favor urgency and visible disagreement over consensus theater",
      "Support literacy action sooner, not later",
    ],
    stanceCards: [
      {
        topicId: "override",
        tone: "support",
        label: "Fully supported passing the override",
        detail:
          "Said the town needed an operating override to preserve current services and then steward the money tightly.",
      },
      {
        topicId: "affordability",
        tone: "support",
        label: "Centered regressive taxes and fees",
        detail:
          "Called affordability a top issue and proposed a committee plus a residential tax exemption to ease pressure on vulnerable residents.",
      },
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Wants a more aggressive business strategy",
        detail:
          "Argued Winchester talks about investment but does not visibly court the types of businesses that fit the town and grow revenue.",
      },
      {
        topicId: "literacy",
        tone: "support",
        label: "Pushed literacy action while on School Committee",
        detail:
          "Backed funding flexibility for literacy in 2024 and separately tried to force a commitment to pilot new literacy curricula.",
      },
      {
        topicId: "school-budget",
        tone: "support",
        label: "Consistently backed direct student-facing additions",
        detail:
          "Supported math specialists, extended-day literacy work, and other initiatives tied directly to student services.",
      },
    ],
    evidence: [
      {
        id: "brady-profile-override",
        kind: "statement",
        title: "Candidate profile explicitly backed the override",
        summary:
          "Brady said Winchester needed to pass an operating override and promised to steward the funds against the written priorities if it passed.",
        topicIds: ["override", "school-budget"],
        sourceId: "news-shamus-brady-profile",
      },
      {
        id: "brady-budget-vote-2024",
        kind: "vote",
        title: "Supported added math, literacy, and arts initiatives in FY25 planning",
        summary:
          "A 2024 School Committee report quoted Brady supporting initiatives that serve students directly and noting the need for literacy funding flexibility.",
        topicIds: ["school-budget", "literacy"],
        sourceId: "news-school-committee-budget-2024",
      },
      {
        id: "brady-literacy-motion-2024",
        kind: "vote",
        title: "Tried to force a literacy pilot commitment",
        summary:
          "When district leaders delayed a literacy presentation, Brady moved to commit the committee to piloting at least two new curricula the next year. The motion failed for lack of a second, but it still marked a clear public stance.",
        topicIds: ["literacy", "fiscal-governance"],
        sourceId: "news-school-literacy-motion-2024",
      },
      {
        id: "brady-election-night",
        kind: "context",
        title: "Campaign close highlighted urgency and new revenue",
        summary:
          "Election-night coverage summarized Brady's race as an argument for urgency, visible dissent, and new revenue streams.",
        topicIds: ["town-revenue", "fiscal-governance"],
        sourceId: "news-election-night-2026",
      },
    ],
  },
];

export const voteLedger: VoteLedgerEntry[] = [...baseVoteLedger, ...expandedVoteLedger];

export const candidateProfiles: CandidateProfile[] = [
  ...baseCandidateProfiles,
  ...expandedCandidateProfiles,
];

export function getCandidateBySlug(slug: string) {
  return candidateProfiles.find((candidate) => candidate.slug === slug);
}

export function getOfficeById(id: OfficeId) {
  return offices.find((office) => office.id === id);
}

export function getTopicById(id: TopicId) {
  return topics.find((topic) => topic.id === id);
}

export function getSourceById(id: string) {
  return sourceById[id];
}

export function getCandidateSources(candidate: CandidateProfile) {
  return Array.from(new Set(candidate.evidence.map((item) => item.sourceId)))
    .map((sourceId) => getSourceById(sourceId))
    .filter(Boolean);
}

export function getEvidenceCount() {
  return candidateProfiles.reduce((count, candidate) => count + candidate.evidence.length, 0);
}
