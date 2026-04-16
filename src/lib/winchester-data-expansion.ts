import type {
  CandidateProfile,
  VoteLedgerEntry,
} from "@/lib/winchester-data";

export const expandedVoteLedger: VoteLedgerEntry[] = [
  {
    id: "override-ballot-march-2026",
    title: "Winchester voters reject the $11.5M override question",
    when: "March 21, 2026",
    result: "Failed 2,283 yes to 2,589 no",
    whyItMatters:
      "This ballot result reset the entire budget conversation in town. It ended the immediate override plan, forced another round of cuts and fee discussions, and became the fiscal backdrop for every school and town-office race that followed.",
    sourceId: "official-election-results-2026",
    participants: [
      {
        name: "Winchester voters",
        role: "Electorate",
        vote: "No vote",
        note: "A townwide majority rejected the override after a high-turnout March election.",
      },
      {
        name: "Override supporters",
        role: "Campaign coalition",
        vote: "Yes vote",
        note: "Supporters still carried 2,283 votes, but not enough to secure the fiscal runway town leaders sought.",
      },
    ],
  },
  {
    id: "planning-board-election-march-2026",
    title: "Amy Beliveau unseats Nick Rossettos in the 2026 Planning Board race",
    when: "March 21, 2026",
    result: "Keri Layton and Amy Beliveau win the two seats",
    whyItMatters:
      "The race was effectively a referendum on how fast Winchester should move on housing production, design standards, and downtown growth. The result preserved one incumbent while swapping in a challenger with a more development-facing background.",
    sourceId: "official-election-results-2026",
    participants: [
      {
        name: "Keri Layton",
        role: "Planning Board incumbent",
        vote: "Won seat",
        note: "Finished first with 2,331 votes and kept one incumbent voice on the board.",
      },
      {
        name: "Amy Beliveau",
        role: "Planning Board challenger",
        vote: "Won seat",
        note: "Won the second seat with 2,042 votes after running on balanced growth and clearer rules for development.",
      },
      {
        name: "Nick Rossettos",
        role: "Planning Board incumbent",
        vote: "Lost seat",
        note: "Received 1,864 votes and lost his re-election bid despite campaigning on mixed-use work and design standards.",
      },
    ],
  },
  {
    id: "select-board-election-march-2025",
    title: "Paras Bhayani and Anthea Brady win the 2025 Select Board race",
    when: "March 22, 2025",
    result: "Bhayani 1,945; Brady 1,649; Simboli 806; Welch 674",
    whyItMatters:
      "This race shaped the leadership bench that entered the 2026 override fight. Voters paired a new finance-heavy voice with an incumbent board member, leaving two more development-oriented challengers short of the board.",
    sourceId: "official-election-results-2025",
    participants: [
      {
        name: "Paras Bhayani",
        role: "Select Board candidate",
        vote: "Won seat",
        note: "Led the field with 1,945 votes and entered town government on a fiscal-management and housing-growth platform.",
      },
      {
        name: "Anthea Brady",
        role: "Select Board incumbent",
        vote: "Won seat",
        note: "Held the second seat with 1,649 votes and preserved continuity on the board.",
      },
      {
        name: "Dorothy Simboli",
        role: "Select Board candidate",
        vote: "Lost seat",
        note: "Ran on business-friendly growth and preservation themes but finished well behind the winners.",
      },
      {
        name: "Rick Welch",
        role: "Select Board candidate",
        vote: "Lost seat",
        note: "Finished fourth after campaigning on development-led revenue growth and a more override-averse approach.",
      },
    ],
  },
  {
    id: "school-committee-election-march-2025",
    title: "Stefanie Mnayarji joins Karen Maruyama Bolognese on School Committee",
    when: "March 22, 2025",
    result: "Mnayarji 1,964; Bolognese 1,512; Nixon 975",
    whyItMatters:
      "The outcome changed the committee heading into the FY26 budget and literacy reform fights. Voters kept one incumbent but also elected a newcomer running on urgency around curriculum, culture, and budget transparency.",
    sourceId: "official-election-results-2025",
    participants: [
      {
        name: "Stefanie Mnayarji",
        role: "School Committee candidate",
        vote: "Won seat",
        note: "Finished first with 1,964 votes after running on literacy reform, technology limits, and school culture.",
      },
      {
        name: "Karen Maruyama Bolognese",
        role: "School Committee incumbent",
        vote: "Won seat",
        note: "Held the second seat with 1,512 votes and carried forward an incumbent budget and literacy record.",
      },
      {
        name: "Christian Nixon",
        role: "School Committee incumbent",
        vote: "Lost seat",
        note: "Received 975 votes and lost his re-election bid despite foregrounding Muraco planning and sustainable revenue.",
      },
    ],
  },
  {
    id: "planning-board-writein-march-2025",
    title: "Jack LeMenager wins an open Planning Board seat as a write-in",
    when: "March 22, 2025",
    result: "LeMenager wins with 739 write-in votes",
    whyItMatters:
      "The result showed that even low-signal races can matter for zoning and development policy. Winchester voters filled an otherwise open planning seat with a historical-commission leader running on coordinated, design-conscious growth.",
    sourceId: "official-election-results-2025",
    participants: [
      {
        name: "Jack LeMenager",
        role: "Write-in Planning Board candidate",
        vote: "Won seat",
        note: "Captured the seat with 739 write-in votes after running on better coordination among planning bodies.",
      },
      {
        name: "Matthew Zarracina",
        role: "Write-in Planning Board candidate",
        vote: "Lost seat",
        note: "Received 146 write-in votes and finished behind LeMenager.",
      },
    ],
  },
  {
    id: "literacy-motion-february-2024",
    title: "Shamus Brady's push for a literacy-pilot commitment dies without a second",
    when: "February 27, 2024",
    result: "Motion failed for lack of a second",
    whyItMatters:
      "This was an early public split over how quickly Winchester should move on literacy reform. Brady tried to force a commitment to pilot new curricula the next year, while district leaders wanted a slower evaluation process.",
    sourceId: "news-school-literacy-motion-2024",
    participants: [
      {
        name: "Shamus Brady",
        role: "School Committee member",
        vote: "No second",
        note: "Moved to commit the committee to piloting at least two literacy curricula in the next school year.",
      },
      {
        name: "School Committee majority",
        role: "School Committee",
        vote: "Not on body",
        note: "No other member seconded the motion, leaving the district on its slower review path.",
      },
    ],
  },
];

export const expandedCandidateProfiles: CandidateProfile[] = [
  {
    id: "keri-layton",
    slug: "keri-layton",
    name: "Keri Layton",
    electionYear: 2026,
    isActiveBallot: true,
    officeId: "planning-board",
    officeLabel: "Planning Board",
    raceLabel: "2026 Planning Board race",
    status: "reelected",
    background:
      "Planning Board chair, former Conservation Commission member, and former Master Plan Steering Committee representative.",
    summary:
      "Layton ran as the process-heavy incumbent: pro-housing, pro-mixed-use zoning, and focused on clearer up-front rules so growth does not become improvisation.",
    locationNote:
      "Won re-election on March 21, 2026 with 2,331 votes, the top total in the three-candidate Planning Board race.",
    priorRecordStrength: "direct",
    priorRecordLabel: "Direct Planning Board record",
    priorRecordSummary:
      "Layton entered the race with an active Planning Board voting record and campaigned on work she had already done on the Master Plan, North Main Street zoning, and board process changes.",
    keyThemes: [
      "Master Plan implementation",
      "Mixed-use zoning near transit",
      "Affordable housing with clear rules",
      "Lower-friction site review for homeowners",
      "Commercial tax base growth through planning",
    ],
    stanceCards: [
      {
        topicId: "affordability",
        tone: "support",
        label: "Supports more affordable and mixed-use housing",
        detail:
          "Frames new zoning and affordable-housing planning as necessary to diversify Winchester's housing stock and stay ahead of 40B pressure.",
      },
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Connects mixed-use growth to revenue",
        detail:
          "Argues mixed-use projects can broaden the commercial tax base without bringing the same school-enrollment impacts as purely residential projects.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Wants clearer expectations before projects arrive",
        detail:
          "Calls for pre-application meetings and more explicit design, affordability, and height rules before applicants spend heavily on proposals.",
      },
      {
        topicId: "affordability",
        tone: "monitor",
        label: "Pairs growth with guardrails",
        detail:
          "Supports more housing production, but emphasizes design review, neighborhood fit, and a townwide affordable-housing strategy instead of ad hoc bargaining.",
      },
    ],
    evidence: [
      {
        id: "layton-profile-master-plan",
        kind: "statement",
        title: "Profile emphasized Master Plan and zoning work already underway",
        summary:
          "Layton pointed to her Master Plan and Planning Board work on downtown and North Main Street zoning as proof she can keep implementation moving.",
        topicIds: ["affordability", "fiscal-governance"],
        sourceId: "news-keri-layton-profile",
      },
      {
        id: "layton-forum-process",
        kind: "forum",
        title: "Called for pre-application clarity on affordability and design",
        summary:
          "At the 2026 forum, Layton said the board should set affordability, design, and height expectations early so development is negotiated on clearer terms.",
        topicIds: ["fiscal-governance", "town-revenue", "affordability"],
        sourceId: "news-planning-board-forum-2026",
      },
      {
        id: "layton-election-2026",
        kind: "context",
        title: "Finished first in the 2026 Planning Board race",
        summary:
          "Official election results gave Layton the top vote total in the field, preserving one incumbent voice as the board heads into its next zoning phase.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2026",
      },
    ],
  },
  {
    id: "nick-rossettos",
    slug: "nick-rossettos",
    name: "Nick Rossettos",
    electionYear: 2026,
    isActiveBallot: true,
    officeId: "planning-board",
    officeLabel: "Planning Board",
    raceLabel: "2026 Planning Board race",
    status: "lost",
    background:
      "Planning Board incumbent with a finance background who worked on MBTA zoning, North Main Street rules, and Waterfield mixed-use approvals.",
    summary:
      "Rossettos ran on an incumbent-growth lane: pro-mixed-use development, pro-design standards, and explicitly focused on keeping downtown growth from eroding Winchester's historic feel.",
    locationNote:
      "Lost re-election on March 21, 2026 with 1,864 votes after finishing behind Keri Layton and Amy Beliveau.",
    priorRecordStrength: "direct",
    priorRecordLabel: "Direct Planning Board record",
    priorRecordSummary:
      "Rossettos entered the race as a sitting board member and tied his campaign to Waterfield approval, MBTA zoning compliance, and design-standard work.",
    keyThemes: [
      "Waterfield mixed-use approval",
      "MBTA Communities zoning compliance",
      "Design standards for new development",
      "Historic-preservation emphasis",
      "Commercial growth with tighter guardrails",
    ],
    stanceCards: [
      {
        topicId: "affordability",
        tone: "support",
        label: "Supports inclusionary and mixed-use housing",
        detail:
          "Backed zoning that encourages mixed-use and inclusionary housing near transit and town centers.",
      },
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Sees commercial growth as part of the tax-base fix",
        detail:
          "Argues the town needs business growth alongside housing so new development improves the fiscal picture rather than worsening it.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Pushes design standards and negotiated guardrails",
        detail:
          "Framed design review and clearer standards as essential tools for keeping growth orderly and politically durable.",
      },
      {
        topicId: "affordability",
        tone: "caution",
        label: "More preservation-minded than some rivals",
        detail:
          "Warned that new downtown projects should not turn into oversized corridors that sacrifice Winchester's character for speed alone.",
      },
    ],
    evidence: [
      {
        id: "rossettos-profile-waterfield",
        kind: "statement",
        title: "Profile pointed to Waterfield and North Main Street work",
        summary:
          "Rossettos said he helped advance Waterfield mixed-use approval and the board's MBTA and North Main Street zoning work, with design standards as a focus.",
        topicIds: ["affordability", "town-revenue", "fiscal-governance"],
        sourceId: "news-nick-rossettos-profile",
      },
      {
        id: "rossettos-forum-preservation",
        kind: "forum",
        title: "Forum message centered on preservation plus growth",
        summary:
          "At the 2026 forum, Rossettos argued growth and preservation are not mutually exclusive, but said the town needs experienced judgment to manage both.",
        topicIds: ["affordability", "fiscal-governance"],
        sourceId: "news-planning-board-forum-2026",
      },
      {
        id: "rossettos-election-2026",
        kind: "context",
        title: "Finished third in the 2026 vote",
        summary:
          "Election-night and official results confirmed Rossettos lost one of the board's two seats despite campaigning on his incumbency record.",
        topicIds: ["fiscal-governance"],
        sourceId: "news-election-night-2026",
      },
    ],
  },
  {
    id: "amy-beliveau",
    slug: "amy-beliveau",
    name: "Amy Beliveau",
    electionYear: 2026,
    isActiveBallot: true,
    officeId: "planning-board",
    officeLabel: "Planning Board",
    raceLabel: "2026 Planning Board race",
    status: "elected",
    background:
      "Town Meeting member with State of the Town and EFPBC experience plus a professional background in development, design, and negotiation.",
    summary:
      "Beliveau ran as the pro-execution challenger: supportive of housing growth, fluent in the development process, and focused on rewriting rules so good projects do not stall in Winchester's bylaw maze.",
    locationNote:
      "Won a Planning Board seat on March 21, 2026 with 2,042 votes, unseating incumbent Nick Rossettos.",
    priorRecordStrength: "adjacent",
    priorRecordLabel: "Adjacent town-development record",
    priorRecordSummary:
      "Beliveau did not bring a Planning Board voting record, but she did campaign from Town Meeting, EFPBC, and State of the Town work tied to capital and development questions.",
    keyThemes: [
      "Balanced growth and housing diversity",
      "Real-estate and design experience",
      "Simpler zoning and permitting rules",
      "More options for seniors and downsizers",
      "Clearer development expectations",
    ],
    stanceCards: [
      {
        topicId: "affordability",
        tone: "support",
        label: "Pushes for more housing variety",
        detail:
          "Argues Winchester needs more affordable and market-rate options, especially for seniors and empty nesters who want to stay in town.",
      },
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Sees better rules as a growth strategy",
        detail:
          "Frames clearer bylaws and better execution as part of making Winchester a place where useful mixed-use projects can actually get built.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Wants clearer design and zoning guidance",
        detail:
          "Says developers should not have to guess what Winchester wants and that the board should make the rules more legible up front.",
      },
      {
        topicId: "affordability",
        tone: "monitor",
        label: "Emphasizes balanced growth over maximal growth",
        detail:
          "Supports more housing production, but repeatedly frames it as careful and design-conscious rather than purely volumetric.",
      },
    ],
    evidence: [
      {
        id: "beliveau-profile-development",
        kind: "statement",
        title: "Profile foregrounded development and negotiation experience",
        summary:
          "Beliveau said her real-estate and design background would help the board move projects from concept to occupancy without losing sight of Winchester's character.",
        topicIds: ["affordability", "fiscal-governance"],
        sourceId: "news-amy-beliveau-profile",
      },
      {
        id: "beliveau-forum-bylaws",
        kind: "forum",
        title: "Forum answer tied business growth to bylaw reform",
        summary:
          "At the 2026 forum, Beliveau said Winchester should examine whether its bylaws are blocking the kinds of businesses and mixed-use projects residents say they want.",
        topicIds: ["town-revenue", "fiscal-governance", "affordability"],
        sourceId: "news-planning-board-forum-2026",
      },
      {
        id: "beliveau-election-2026",
        kind: "context",
        title: "Won the 2026 race on her first bid",
        summary:
          "Election-night coverage and official totals confirmed Beliveau won a seat and displaced one incumbent in the process.",
        topicIds: ["fiscal-governance"],
        sourceId: "news-election-night-2026",
      },
    ],
  },
  {
    id: "paras-bhayani",
    slug: "paras-bhayani",
    name: "Paras Bhayani",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "select-board",
    officeLabel: "Select Board",
    raceLabel: "2025 Select Board race",
    status: "elected",
    background:
      "Finance executive and former Chicago Transit Authority budget leader with local education-advocacy involvement through Winchester Literacy Initiative for Change.",
    summary:
      "Bhayani ran as a finance-and-growth candidate: pro-efficiency, pro-commercial development, pro-housing, and open to additional revenue once the town had exhausted smarter operational fixes.",
    locationNote:
      "Won a Select Board seat on March 22, 2025 with 1,945 votes, the highest total in the four-candidate field.",
    priorRecordStrength: "limited",
    priorRecordLabel: "No prior Winchester vote record",
    priorRecordSummary:
      "Bhayani entered the 2025 race without a municipal voting history in Winchester, so this page leans on his detailed profile, forum answers, and election outcome.",
    keyThemes: [
      "Budget management and efficiencies",
      "Commercial growth in the center",
      "Thoughtful infill housing",
      "Literacy advocacy",
      "Climate and sustainability framing",
    ],
    stanceCards: [
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Wants new revenue beyond the levy",
        detail:
          "Called for efficiency work, strategic purchasing, better use of town assets, and a stronger small-business and mixed-use agenda.",
      },
      {
        topicId: "affordability",
        tone: "support",
        label: "Supports infill and broader housing choice",
        detail:
          "Backed thoughtful infill housing, transit-oriented redevelopment, and more options for residents who cannot find a fit in the current stock.",
      },
      {
        topicId: "override",
        tone: "support",
        label: "Open to another override when the runway expires",
        detail:
          "Argued the 2019 override had lasted longer than planned and said additional revenue would likely be needed to meet operating and capital needs.",
      },
      {
        topicId: "literacy",
        tone: "support",
        label: "Brought outside literacy-advocacy experience",
        detail:
          "Connected his local literacy-organizing work to a broader argument for protecting school quality while reworking town finances.",
      },
    ],
    evidence: [
      {
        id: "bhayani-profile-growth",
        kind: "statement",
        title: "Profile centered on efficiency, housing, and business growth",
        summary:
          "Bhayani said the board should pursue efficiencies and new revenue together, with mixed-use housing and small-business growth at the center of that strategy.",
        topicIds: ["town-revenue", "affordability", "override"],
        sourceId: "news-paras-bhayani-profile-2025",
      },
      {
        id: "bhayani-forum-deficit",
        kind: "forum",
        title: "Forum answer framed the deficit as a management problem first",
        summary:
          "At the 2025 debate, Bhayani spoke about the looming deficit through a budget-operator lens, emphasizing efficiencies and financial planning before defaulting to austerity.",
        topicIds: ["town-revenue", "fiscal-governance"],
        sourceId: "news-select-board-forum-2025",
      },
      {
        id: "bhayani-election-2025",
        kind: "context",
        title: "Led the 2025 Select Board field",
        summary:
          "Official results put Bhayani first in the four-candidate Select Board race, showing strong voter appetite for a finance-heavy newcomer.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
    ],
  },
  {
    id: "anthea-brady",
    slug: "anthea-brady",
    name: "Anthea Brady",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "select-board",
    officeLabel: "Select Board",
    raceLabel: "2025 Select Board race",
    status: "reelected",
    background:
      "Select Board incumbent with education-sector policy experience and prior work on ARPA grants, playground funding, and pedestrian-safety projects.",
    summary:
      "Brady ran as the continuity candidate: supportive of school and town staffing, comfortable considering an override if necessary, and broadly aligned with mixed-use and affordable-housing growth.",
    locationNote:
      "Won re-election on March 22, 2025 with 1,649 votes and kept one incumbent seat on the Select Board.",
    priorRecordStrength: "direct",
    priorRecordLabel: "Direct Select Board record",
    priorRecordSummary:
      "Brady had already served three years on the Select Board and campaigned directly on town actions she had helped steer, from ARPA grants to safety and playground investments.",
    keyThemes: [
      "ARPA implementation",
      "School and town staffing support",
      "Affordable housing at multiple scales",
      "Commercial growth near the station",
      "Override as a reluctant backstop",
    ],
    stanceCards: [
      {
        topicId: "override",
        tone: "support",
        label: "Saw override options as potentially necessary",
        detail:
          "Said neither free cash nor an override is ideal, but framed both as tools that might be required to preserve services if costs keep rising.",
      },
      {
        topicId: "school-budget",
        tone: "support",
        label: "Treats school staffing as core infrastructure",
        detail:
          "Repeatedly tied school quality to the town's long-term competitiveness and argued students and families need stable staffing.",
      },
      {
        topicId: "affordability",
        tone: "support",
        label: "Backs both large and small affordable-housing projects",
        detail:
          "Pointed to Waterfield-scale projects and smaller efforts like Cross Street or 160 Forest as part of the same housing toolbox.",
      },
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Looks to zoning and station recovery for revenue growth",
        detail:
          "Linked commercial growth to the reopening of station parking, Holton Street opportunities, and new mixed-use zoning work.",
      },
    ],
    evidence: [
      {
        id: "brady2025-profile-service",
        kind: "statement",
        title: "Profile tied fiscal choices to service protection",
        summary:
          "Brady said the town needed to maintain staffing and high-quality schools even if officials eventually had to consider free cash or an override.",
        topicIds: ["school-budget", "override"],
        sourceId: "news-anthea-brady-profile-2025",
      },
      {
        id: "brady2025-forum-override",
        kind: "forum",
        title: "Forum answer kept an override on the table",
        summary:
          "At the 2025 debate, Brady said the board was studying what an override might look like while also warning that rising costs were not the result of obvious town mismanagement.",
        topicIds: ["override", "fiscal-governance"],
        sourceId: "news-select-board-forum-2025",
      },
      {
        id: "brady2025-election",
        kind: "context",
        title: "Held the second Select Board seat",
        summary:
          "Official election results confirmed Brady held the final winning spot and preserved continuity on the board.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
    ],
  },
  {
    id: "dorothy-simboli",
    slug: "dorothy-simboli",
    name: "Dorothy Simboli",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "select-board",
    officeLabel: "Select Board",
    raceLabel: "2025 Select Board race",
    status: "lost",
    background:
      "Lawyer and Zoning Board of Appeals member with a land-use, real-estate, and historic-preservation perspective.",
    summary:
      "Simboli campaigned on business-friendly growth, parking and permitting reform, and a more transparently managed path through the town's structural deficit and school-facilities backlog.",
    locationNote:
      "Finished third in the 2025 Select Board race with 806 votes.",
    priorRecordStrength: "adjacent",
    priorRecordLabel: "Adjacent zoning and land-use record",
    priorRecordSummary:
      "Simboli did not bring a Select Board vote record, but she did enter the race with local zoning-board experience and a campaign rooted in land-use, preservation, and school-quality concerns.",
    keyThemes: [
      "Business-friendly permitting",
      "Parking and downtown access",
      "Balanced housing growth with preservation",
      "Transparent budgeting",
      "School quality and Muraco concerns",
    ],
    stanceCards: [
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Wants a more overtly business-friendly town",
        detail:
          "Argued Winchester should streamline permitting, solve parking issues, and become visibly more welcoming to new businesses.",
      },
      {
        topicId: "affordability",
        tone: "support",
        label: "Supports diverse housing with preservation constraints",
        detail:
          "Described balanced housing growth as compatible with preserving neighborhood character and infrastructure quality.",
      },
      {
        topicId: "school-budget",
        tone: "support",
        label: "Linked school quality to townwide competitiveness",
        detail:
          "Said Winchester's education reputation depends on updating literacy, math, special-education, and professional-development supports.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Calls for more transparent budgeting discipline",
        detail:
          "Framed deferred capital projects and Muraco planning as reasons to tighten budgeting and communicate trade-offs more clearly.",
      },
    ],
    evidence: [
      {
        id: "simboli-profile-growth",
        kind: "statement",
        title: "Profile blended housing, business, and school themes",
        summary:
          "Simboli's candidate answers combined preservation-minded housing growth, business-friendly permitting, and support for updated school standards and facilities planning.",
        topicIds: ["affordability", "town-revenue", "school-budget"],
        sourceId: "news-dorothy-simboli-profile-2025",
      },
      {
        id: "simboli-forum-parking",
        kind: "forum",
        title: "Forum answer stressed parking and downtown business turnover",
        summary:
          "At the 2025 debate, Simboli argued that parking policy and permitting speed were central to whether Winchester could keep businesses alive downtown.",
        topicIds: ["town-revenue", "fiscal-governance"],
        sourceId: "news-select-board-forum-2025",
      },
      {
        id: "simboli-election-2025",
        kind: "context",
        title: "Finished behind the two winning candidates",
        summary:
          "Official results show Simboli drew 806 votes, well short of the two winning totals in the 2025 race.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
    ],
  },
  {
    id: "rick-welch",
    slug: "rick-welch",
    name: "Rick Welch",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "select-board",
    officeLabel: "Select Board",
    raceLabel: "2025 Select Board race",
    status: "lost",
    background:
      "Real-estate developer, former Planning Board member, and home builder with deep experience permitting housing projects.",
    summary:
      "Welch ran as the development-first candidate: skeptical of relying on overrides, supportive of school funding, and eager to use mixed-use, 55-plus housing, and planning flexibility to widen the tax base.",
    locationNote:
      "Finished fourth in the 2025 Select Board field with 674 votes.",
    priorRecordStrength: "adjacent",
    priorRecordLabel: "Adjacent planning and development record",
    priorRecordSummary:
      "Welch did not have a current Select Board vote record, but he campaigned from prior Planning Board experience and decades of permitting and development work in Massachusetts.",
    keyThemes: [
      "Development-led revenue growth",
      "55-plus housing and mixed-use projects",
      "Avoid override where possible",
      "Support school quality",
      "Asset-by-asset town review",
    ],
    stanceCards: [
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Sees growth as the main revenue lever",
        detail:
          "Talked about expanding downtown mixed-use activity and using new development to build a larger commercial tax base.",
      },
      {
        topicId: "override",
        tone: "caution",
        label: "Wanted to avoid an override if development could close the gap",
        detail:
          "Said development should be the main focus before town leaders ask voters for more money.",
      },
      {
        topicId: "affordability",
        tone: "support",
        label: "Supports more housing types, including senior-oriented projects",
        detail:
          "Argued Winchester should use 55-plus and mixed-use housing tools to serve residents who need more options.",
      },
      {
        topicId: "school-budget",
        tone: "support",
        label: "Accepted the case for maintaining school standards",
        detail:
          "Said his own children showed him that school spending was preserving a strong educational product, not funding obvious waste.",
      },
    ],
    evidence: [
      {
        id: "welch-profile-growth",
        kind: "statement",
        title: "Profile emphasized housing and tax-base expansion",
        summary:
          "Welch said Winchester should use mixed-use and age-targeted housing projects to expand the downtown economy and avoid leaning too quickly on tax overrides.",
        topicIds: ["town-revenue", "affordability", "override"],
        sourceId: "news-rick-welch-profile-2025",
      },
      {
        id: "welch-forum-assets",
        kind: "forum",
        title: "Forum answer called for an asset-by-asset review",
        summary:
          "At the 2025 debate, Welch said town leaders should evaluate each public asset and focus on practical revenue-producing improvements before conceding to an override.",
        topicIds: ["town-revenue", "fiscal-governance", "override"],
        sourceId: "news-select-board-forum-2025",
      },
      {
        id: "welch-election-2025",
        kind: "context",
        title: "Finished fourth in the field",
        summary:
          "Official results show Welch received 674 votes, the smallest total among the four Select Board candidates.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
    ],
  },
  {
    id: "karen-maruyama-bolognese",
    slug: "karen-maruyama-bolognese",
    name: "Karen Maruyama Bolognese",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "school-committee",
    officeLabel: "School Committee",
    raceLabel: "2025 School Committee race",
    status: "reelected",
    background:
      "School Committee incumbent and later chair with a finance-heavy background spanning veterinary work, corporate finance, and volunteer district planning groups.",
    summary:
      "Bolognese ran as the continuity-and-process incumbent: supportive of literacy reform, careful about the tax burden, and willing to add priority school spending when the committee could still defend a multi-year plan.",
    locationNote:
      "Won re-election on March 22, 2025 with 1,512 votes, taking the second of the race's two seats.",
    priorRecordStrength: "direct",
    priorRecordLabel: "Direct School Committee record",
    priorRecordSummary:
      "Bolognese brought an active School Committee voting record into the 2025 election, including the committee's March 2025 budget add vote.",
    keyThemes: [
      "Protect school quality while managing tax burden",
      "Support superintendent-led literacy process",
      "Long-range budget planning",
      "Special education and broad student opportunity",
      "Coordinate with other town boards",
    ],
    stanceCards: [
      {
        topicId: "school-budget",
        tone: "support",
        label: "Supports targeted budget adds with a long-range plan",
        detail:
          "Backed adding priority items to the FY26 request while still referencing the district's five-year planning framework.",
      },
      {
        topicId: "literacy",
        tone: "support",
        label: "Supports the district's literacy rollout process",
        detail:
          "Defended the superintendent's literacy review approach and argued the district should fund the strategic pieces it has identified.",
      },
      {
        topicId: "mental-health",
        tone: "support",
        label: "Frames student opportunity broadly",
        detail:
          "Talked about academics, sports, arts, and special education as part of the same obligation to serve different student needs.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Keeps the tax burden in view",
        detail:
          "Said district priorities matter, but repeatedly tied budget asks to what Winchester residents can realistically absorb over time.",
      },
    ],
    evidence: [
      {
        id: "bolognese-profile-literacy",
        kind: "statement",
        title: "Profile paired literacy support with fiscal caution",
        summary:
          "Bolognese said she supports literacy work and broad student opportunity, but also emphasized keeping school improvements financially sustainable for residents.",
        topicIds: ["school-budget", "literacy", "mental-health"],
        sourceId: "news-karen-maruyama-bolognese-profile-2025",
      },
      {
        id: "bolognese-budget-vote-2025",
        kind: "vote",
        title: "Voted for the FY26 budget add package",
        summary:
          "In the March 2025 budget debate, Bolognese backed adding high-priority items while still referencing the district's five-year funding plan.",
        topicIds: ["school-budget", "fiscal-governance"],
        sourceId: "news-school-budget-vote-2025",
      },
      {
        id: "bolognese-forum-2025",
        kind: "forum",
        title: "Forum answer defended the current literacy process",
        summary:
          "At the 2025 debate, Bolognese defended the district's literacy process against calls to accelerate it on a more political timetable.",
        topicIds: ["literacy", "fiscal-governance"],
        sourceId: "news-school-committee-forum-2025",
      },
      {
        id: "bolognese-election-2025",
        kind: "context",
        title: "Held one of the two available seats",
        summary:
          "Official results show Bolognese won re-election and preserved one incumbent vote on the committee.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
    ],
  },
  {
    id: "christian-nixon",
    slug: "christian-nixon",
    name: "Christian Nixon",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "school-committee",
    officeLabel: "School Committee",
    raceLabel: "2025 School Committee race",
    status: "lost",
    background:
      "School Committee incumbent with architecture and education-policy training who foregrounded facilities planning and district operations.",
    summary:
      "Nixon ran as the systems-minded incumbent: focused on funding the district's true needs, moving Muraco and long-range facilities work, and supporting curriculum change while keeping teacher buy-in central.",
    locationNote:
      "Lost re-election on March 22, 2025 with 975 votes.",
    priorRecordStrength: "direct",
    priorRecordLabel: "Direct School Committee record",
    priorRecordSummary:
      "Nixon entered the race as a sitting School Committee member, so his page is anchored in his public role even when the evidence here leans more on campaign and forum material than named roll calls.",
    keyThemes: [
      "True FY26 funding case",
      "Muraco and facilities planning",
      "Teacher voice in curriculum change",
      "State of the Town revenue alignment",
      "Collective-bargaining and district culture",
    ],
    stanceCards: [
      {
        topicId: "school-budget",
        tone: "support",
        label: "Wanted the town to hear the district's full funding case",
        detail:
          "Said one of his first priorities was making the case for WPS's true FY26 funding needs rather than understating the ask.",
      },
      {
        topicId: "literacy",
        tone: "support",
        label: "Supports curriculum change with teacher input",
        detail:
          "Backed change in literacy and math, but argued teachers and specialists had to be substantively heard as the district made those shifts.",
      },
      {
        topicId: "school-facilities",
        tone: "support",
        label: "Made Muraco and facilities planning central",
        detail:
          "Campaigned heavily on filing the New Muraco statement of interest and completing the district's facilities planning phases.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Connected school funding to long-range town revenue work",
        detail:
          "Tied district planning to the State of the Town effort and framed sustainable revenue as necessary to make school promises credible.",
      },
    ],
    evidence: [
      {
        id: "nixon-profile-funding",
        kind: "statement",
        title: "Profile centered on Muraco, funding, and sustainable revenue",
        summary:
          "Nixon said his immediate priorities were the district's real FY26 needs, Muraco planning, and aligning school strategy with broader town revenue work.",
        topicIds: ["school-budget", "school-facilities", "fiscal-governance"],
        sourceId: "news-christian-nixon-profile-2025",
      },
      {
        id: "nixon-budget-2025",
        kind: "context",
        title: "Budget debate showed his bargaining-year caution",
        summary:
          "During the March 2025 budget discussion, Nixon said he was reluctant to push the public funding signal too far while the district was in collective bargaining with all five unions.",
        topicIds: ["school-budget", "fiscal-governance"],
        sourceId: "news-school-budget-vote-2025",
      },
      {
        id: "nixon-forum-2025",
        kind: "forum",
        title: "Forum answer backed change but with more staff input",
        summary:
          "At the 2025 debate, Nixon said the committee should embrace curriculum change, but not in a way that shuts down teacher and specialist voice.",
        topicIds: ["literacy", "technology", "fiscal-governance"],
        sourceId: "news-school-committee-forum-2025",
      },
      {
        id: "nixon-election-2025",
        kind: "context",
        title: "Lost one of the two available seats",
        summary:
          "Official results show Nixon finished third and did not return to the School Committee after the 2025 race.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
    ],
  },
  {
    id: "stefanie-mnayarji",
    slug: "stefanie-mnayarji",
    name: "Stefanie Mnayarji",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "school-committee",
    officeLabel: "School Committee",
    raceLabel: "2025 School Committee race",
    status: "elected",
    background:
      "Economist and fintech strategist with Town Meeting and school-parent leadership roles, including Parents' Inter-School Council work.",
    summary:
      "Mnayarji ran as the urgency candidate: pro-literacy reform now, more skeptical of student-device drift, and insistent that school budget decisions should be more transparent and more directly tied to student outcomes.",
    locationNote:
      "Won a School Committee seat on March 22, 2025 with 1,964 votes, the highest total in the field.",
    priorRecordStrength: "adjacent",
    priorRecordLabel: "Adjacent school and Town Meeting record",
    priorRecordSummary:
      "Mnayarji did not bring a School Committee vote record into the race, but she did run with a visible Town Meeting and parent-leadership background tied to district issues.",
    keyThemes: [
      "Literacy reform urgency",
      "Phone-free school experience",
      "Budget transparency",
      "Elementary-school representation",
      "Collaborative culture and grant-seeking",
    ],
    stanceCards: [
      {
        topicId: "literacy",
        tone: "support",
        label: "Wanted literacy reform to move faster",
        detail:
          "Argued Winchester had already spent too long studying the problem and should not let budget caution slow literacy change again.",
      },
      {
        topicId: "technology",
        tone: "caution",
        label: "Supports a more phone-free student experience",
        detail:
          "Questioned current device norms and said the district should be more intentional about how phones and personal devices affect focus.",
      },
      {
        topicId: "mental-health",
        tone: "support",
        label: "Connects culture and student thriving",
        detail:
          "Talked about school culture as something students feel every day and linked that directly to whether every child can thrive.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Pushes for more transparent budget discussion",
        detail:
          "Called for clearer budget conversations with teachers, parents, and other boards while also pursuing grants and outside support where possible.",
      },
    ],
    evidence: [
      {
        id: "mnayarji-profile-reform",
        kind: "statement",
        title: "Profile foregrounded literacy, technology, and culture",
        summary:
          "Mnayarji said she was running to push literacy reform, review device use more intentionally, and help schools address funding and culture challenges together.",
        topicIds: ["literacy", "technology", "mental-health", "fiscal-governance"],
        sourceId: "news-stefanie-mnayarji-profile-2025",
      },
      {
        id: "mnayarji-forum-phones",
        kind: "forum",
        title: "Forum answer explicitly backed a more phone-free model",
        summary:
          "At the 2025 debate, Mnayarji said a phone-free school experience would improve student focus and mental health and should be pursued more seriously.",
        topicIds: ["technology", "mental-health"],
        sourceId: "news-school-committee-forum-2025",
      },
      {
        id: "mnayarji-election-2025",
        kind: "context",
        title: "Led the 2025 School Committee field",
        summary:
          "Official results show Mnayarji finished first in the race and joined the committee as the top vote-getter.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
    ],
  },
  {
    id: "jack-lemenager",
    slug: "jack-lemenager",
    name: "Jack LeMenager",
    electionYear: 2025,
    isActiveBallot: false,
    officeId: "planning-board",
    officeLabel: "Planning Board",
    raceLabel: "2025 Planning Board write-in race",
    status: "elected",
    background:
      "Historical Commission chair, longtime Town Meeting member, and ad hoc committee veteran who ran a write-in campaign for an open Planning Board seat.",
    summary:
      "LeMenager ran on coordinated, preservation-aware growth: more communication among town boards, more commercial space where it fits, and less reactive planning across Winchester's development bodies.",
    locationNote:
      "Won the open Planning Board seat on March 22, 2025 with 739 write-in votes.",
    priorRecordStrength: "adjacent",
    priorRecordLabel: "Adjacent land-use and Town Meeting record",
    priorRecordSummary:
      "LeMenager did not have a Planning Board vote history before the race, but he campaigned from a long historical-commission and Town Meeting record tied to development and preservation issues.",
    keyThemes: [
      "Historic-preservation lens",
      "Board-to-board coordination",
      "Right-sized mixed-use growth",
      "Commercial-space expansion",
      "Write-in civic organizing",
    ],
    stanceCards: [
      {
        topicId: "town-revenue",
        tone: "support",
        label: "Supports more commercial and mixed-use development",
        detail:
          "Argued Winchester needs more right-sized mixed-use development and additional commercial space to strengthen the town's fiscal footing.",
      },
      {
        topicId: "affordability",
        tone: "support",
        label: "Views housing growth as part of rational development",
        detail:
          "Described mixed-use and residential growth as necessary, but only if the town coordinates it more intentionally across boards.",
      },
      {
        topicId: "fiscal-governance",
        tone: "support",
        label: "Wants tighter coordination across boards",
        detail:
          "Said the Planning Board, Select Board, and other bodies should communicate more directly rather than reacting to one another late in the process.",
      },
      {
        topicId: "affordability",
        tone: "monitor",
        label: "Pairs growth with a preservation lens",
        detail:
          "Repeatedly said growth should fit Winchester's built environment and not degrade what residents value about the town.",
      },
    ],
    evidence: [
      {
        id: "lemenager-profile-growth",
        kind: "statement",
        title: "Write-in profile stressed coordination and right-sized growth",
        summary:
          "LeMenager said Winchester needs more communication among boards, more mixed-use development, and more commercial space without sacrificing character.",
        topicIds: ["town-revenue", "affordability", "fiscal-governance"],
        sourceId: "news-jack-lemenager-profile-2025",
      },
      {
        id: "lemenager-results-2025",
        kind: "context",
        title: "Won the planning seat outright as a write-in",
        summary:
          "Official certified results show LeMenager won the open Planning Board seat with 739 write-in votes.",
        topicIds: ["fiscal-governance"],
        sourceId: "official-election-results-2025",
      },
      {
        id: "lemenager-election-2025",
        kind: "context",
        title: "Election-night coverage confirmed the upset",
        summary:
          "Winchester News highlighted LeMenager's write-in win as one of the clearest examples of how low-visibility town races can still reshape policy boards.",
        topicIds: ["fiscal-governance"],
        sourceId: "news-election-night-2025",
      },
    ],
  },
];
