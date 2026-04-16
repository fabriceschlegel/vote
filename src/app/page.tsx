import { HomeWorkspace } from "@/components/home-workspace";
import {
  candidateProfiles,
  getEvidenceCount,
  offices,
  topics,
  townSignals,
  voteLedger,
} from "@/lib/winchester-data";
import {
  getOfficialBodyCounts,
  getOfficialBodyCount,
  getOfficialMinutesCount,
  getOfficialRecordCount,
  getOfficialRecordYears,
  getRecentOfficialRecords,
} from "@/lib/winchester-records";

export default function Home() {
  const officialRecordCount = getOfficialRecordCount();
  const officialMinutesCount = getOfficialMinutesCount();
  const officialYears = getOfficialRecordYears();
  const recentOfficialRecords = getRecentOfficialRecords();
  const officialBodyCounts = getOfficialBodyCounts(4);
  const officialBodyCount = getOfficialBodyCount();
  const yearCoverageLabel =
    officialYears.length > 0
      ? `${Math.min(...officialYears)}-${Math.max(...officialYears)}`
      : "n/a";

  return (
    <main className="pb-16">
      <HomeWorkspace
        candidates={candidateProfiles}
        evidenceCount={getEvidenceCount()}
        offices={offices}
        topics={topics}
        townSignals={townSignals}
        voteLedger={voteLedger}
        officialBodyCount={officialBodyCount}
        officialBodyCounts={officialBodyCounts}
        officialMinutesCount={officialMinutesCount}
        officialRecordCount={officialRecordCount}
        recentOfficialRecords={recentOfficialRecords}
        yearCoverageLabel={yearCoverageLabel}
      />
    </main>
  );
}
