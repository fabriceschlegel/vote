import officialArchive from "../../data/official-record-archive.json";

export type OfficialRecordTopic =
  | "school-budget"
  | "literacy"
  | "school-facilities"
  | "town-revenue"
  | "override"
  | "fiscal-governance"
  | "housing"
  | "planning"
  | "public-health"
  | "conservation"
  | "community-preservation";

export type OfficialBodySummary = {
  bodyId: string;
  bodyLabel: string;
  count: number;
};

export type OfficialRecord = {
  id: string;
  bodyId: string;
  bodyLabel: string;
  year: number;
  meetingDate: string;
  meetingLabel: string;
  postedAt: string | null;
  title: string;
  agendaUrl: string;
  minutesUrl: string | null;
  recordType: "agenda" | "agenda+minutes";
  availableFormats: string[];
  topics: OfficialRecordTopic[];
  sourcePageUrl: string;
};

export const officialRecords = officialArchive as OfficialRecord[];

export function getOfficialRecordCount() {
  return officialRecords.length;
}

export function getOfficialRecordYears() {
  return Array.from(new Set(officialRecords.map((record) => record.year))).sort(
    (left, right) => right - left,
  );
}

export function getOfficialBodyCounts(limit?: number) {
  const counts = Array.from(
    officialRecords.reduce((accumulator, record) => {
      const existing = accumulator.get(record.bodyId);

      if (existing) {
        existing.count += 1;
        return accumulator;
      }

      accumulator.set(record.bodyId, {
        bodyId: record.bodyId,
        bodyLabel: record.bodyLabel,
        count: 1,
      });
      return accumulator;
    }, new Map<string, OfficialBodySummary>()).values(),
  )
    .sort(
      (left, right) =>
        right.count - left.count || left.bodyLabel.localeCompare(right.bodyLabel),
    );

  return typeof limit === "number" ? counts.slice(0, limit) : counts;
}

export function getOfficialMinutesCount() {
  return officialRecords.filter((record) => record.minutesUrl).length;
}

export function getOfficialBodyCount() {
  return getOfficialBodyCounts().length;
}

export function getRecentOfficialRecords(limit = 6) {
  return officialRecords.slice(0, limit);
}
