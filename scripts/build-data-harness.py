#!/usr/bin/env python3

from __future__ import annotations

import hashlib
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from lxml import html
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
DERIVED_DIR = DATA_DIR / "derived"
SOURCE_OUTPUT_DIR = DERIVED_DIR / "sources"


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def read_json(path: Path) -> Any:
    return json.loads(path.read_text())


def sha256_for_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def extract_pdf_text(path: Path) -> dict[str, Any]:
    reader = PdfReader(str(path))
    page_text = [normalize_whitespace(page.extract_text() or "") for page in reader.pages]
    full_text = normalize_whitespace(" ".join(page_text))

    return {
        "pageCount": len(reader.pages),
        "text": full_text,
    }


def remove_nodes(document: html.HtmlElement, xpath: str) -> None:
    for node in document.xpath(xpath):
        parent = node.getparent()
        if parent is not None:
            parent.remove(node)


def choose_best_html_root(document: html.HtmlElement) -> html.HtmlElement:
    candidates = document.xpath("//article | //main | //section | //body")
    ranked_candidates: list[tuple[int, html.HtmlElement]] = []

    for candidate in candidates:
        text = normalize_whitespace(candidate.text_content())
        if len(text) < 120:
            continue
        ranked_candidates.append((len(text), candidate))

    if not ranked_candidates:
        return document

    ranked_candidates.sort(key=lambda item: item[0], reverse=True)
    return ranked_candidates[0][1]


def extract_html_text(path: Path) -> dict[str, Any]:
    raw_html = path.read_text(errors="ignore")
    document = html.fromstring(raw_html)

    for xpath in [
        "//script",
        "//style",
        "//noscript",
        "//svg",
        "//nav",
        "//footer",
        "//header",
        "//*[contains(@class, 'menu')]",
        "//*[contains(@class, 'nav')]",
        "//*[contains(@class, 'footer')]",
        "//*[contains(@class, 'sidebar')]",
        "//*[contains(@class, 'share')]",
    ]:
        remove_nodes(document, xpath)

    root = choose_best_html_root(document)
    text = normalize_whitespace(root.text_content())

    return {
        "pageCount": None,
        "text": text,
    }


def build_signals(source: dict[str, Any], text: str) -> dict[str, bool]:
    lower = f"{source['title']} {source['url']} {text[:4000]}".lower()

    def has_any(*needles: str) -> bool:
        return any(needle in lower for needle in needles)

    return {
        "hasMinutesLanguage": has_any("minutes", "meeting was convened", "adjourned", "present -", "roll call"),
        "hasElectionLanguage": has_any("final results", "voter turnout", "precinct", "registered voters", "ballots"),
        "hasVoteLanguage": has_any("motion", "moved", "seconded", "passed", "failed", "approved", "voted"),
        "hasCandidateQALanguage": has_any("what experiences and perspectives", "candidate profile", "for school committee", "for select board"),
        "hasAgendaLanguage": has_any("agenda", "regular meeting"),
        "hasBudgetLanguage": has_any("budget", "override", "revenue", "school committee"),
    }


def classify_document(source: dict[str, Any], text: str, extension: str, signals: dict[str, bool]) -> str:
    title_lower = source["title"].lower()
    lower = f"{source['title']} {source['url']} {text[:4000]}".lower()

    if source["kind"] == "official" and "final results" in title_lower:
        return "election-results"

    if signals["hasMinutesLanguage"] and extension == "pdf":
        return "meeting-minutes"

    if source["kind"] == "official" and "state of the town" in title_lower:
        return "state-of-the-town"

    if title_lower.startswith("for school committee:") or title_lower.startswith("for select board:"):
        return "candidate-profile"

    if source["kind"] == "official" and signals["hasElectionLanguage"]:
        return "election-results"

    if source["kind"] == "official" and "state of the town" in lower:
        return "state-of-the-town"

    if source["kind"] == "local-news":
        return "meeting-coverage"

    if signals["hasVoteLanguage"] or "forum" in lower or "override" in lower:
        return "meeting-coverage"

    if signals["hasAgendaLanguage"]:
        return "meeting-agenda"

    return "reference-page"


def compute_quality(
    document_type: str,
    word_count: int,
    signals: dict[str, bool],
) -> tuple[float, str, list[str]]:
    reasons: list[str] = []
    score = 0.35

    if document_type == "election-results":
        score = 0.98
        reasons.append("Contains certified or tabulated election results.")
    elif document_type == "meeting-minutes":
        score = 0.9
        reasons.append("Contains meeting-minutes style language and proceedings.")
    elif document_type == "meeting-coverage":
        score = 0.8
        reasons.append("Contains reportable public actions, motions, or vote language.")
    elif document_type == "candidate-profile":
        score = 0.68
        reasons.append("Useful for campaign positions, but weaker than prior public votes.")
    elif document_type == "state-of-the-town":
        score = 0.72
        reasons.append("Useful background and governance context.")
    elif document_type == "meeting-agenda":
        score = 0.22
        reasons.append("Agenda-only material is weak evidence for candidate stance extraction.")
    else:
        score = 0.48
        reasons.append("General reference page; usefulness depends on downstream extraction.")

    if word_count > 1400:
        score += 0.04
        reasons.append("Substantial extracted text is available.")
    elif word_count < 180:
        score -= 0.22
        reasons.append("Very little extractable text was recovered.")

    if signals["hasVoteLanguage"] and document_type != "meeting-agenda":
        score += 0.03
        reasons.append("Includes motion or vote-oriented language.")

    if signals["hasAgendaLanguage"] and document_type == "meeting-agenda":
        reasons.append("Should be treated as archival context, not as final evidence.")

    score = max(0.0, min(score, 1.0))

    if score >= 0.85:
        label = "strong"
    elif score >= 0.65:
        label = "usable"
    elif score >= 0.4:
        label = "weak"
    else:
        label = "insufficient"

    return score, label, reasons


def build_source_document(source: dict[str, Any]) -> dict[str, Any]:
    matching_files = sorted(RAW_DIR.glob(f"{source['id']}.*"))
    if not matching_files:
        raise FileNotFoundError(f"No raw file found for source {source['id']}")

    raw_path = matching_files[0]
    extension = raw_path.suffix.lstrip(".")

    if extension == "pdf":
        extracted = extract_pdf_text(raw_path)
    elif extension == "html":
        extracted = extract_html_text(raw_path)
    else:
        extracted = {
            "pageCount": None,
            "text": normalize_whitespace(raw_path.read_text(errors="ignore")),
        }

    text = extracted["text"]
    word_count = len(text.split())
    signals = build_signals(source, text)
    document_type = classify_document(source, text, extension, signals)
    quality_score, quality_label, reasons = compute_quality(
        document_type,
        word_count,
        signals,
    )

    return {
        "sourceId": source["id"],
        "title": source["title"],
        "publisher": source["publisher"],
        "kind": source["kind"],
        "publishedAt": source["publishedAt"],
        "url": source["url"],
        "rawPath": str(raw_path.relative_to(ROOT)),
        "fileType": extension,
        "sha256": sha256_for_path(raw_path),
        "sizeBytes": raw_path.stat().st_size,
        "pageCount": extracted["pageCount"],
        "wordCount": word_count,
        "documentType": document_type,
        "qualityScore": round(quality_score, 3),
        "qualityLabel": quality_label,
        "reasons": reasons,
        "signals": signals,
        "snippet": text[:500],
        "text": text,
    }


def archive_topic_priority(record: dict[str, Any]) -> int:
    priorities = {
        "override": 5,
        "school-budget": 5,
        "literacy": 4,
        "town-revenue": 4,
        "fiscal-governance": 3,
        "school-facilities": 3,
        "planning": 2,
        "housing": 2,
        "public-health": 1,
        "conservation": 1,
        "community-preservation": 1,
    }
    return sum(priorities.get(topic, 0) for topic in record.get("topics", []))


def build_archive_record_audit(record: dict[str, Any]) -> dict[str, Any]:
    reasons: list[str] = []
    score = 0.18
    readiness = "agenda-only"
    current_year = datetime.now(timezone.utc).year

    if record["recordType"] == "agenda+minutes" and record.get("minutesUrl"):
        score = 0.78
        readiness = "minutes-available"
        reasons.append("Minutes link is available for this meeting.")
    else:
        reasons.append("Only the agenda is linked today, which is not sufficient for stance extraction.")

    topic_priority = archive_topic_priority(record)
    if topic_priority > 0:
        score += min(topic_priority * 0.02, 0.14)
        reasons.append("Meeting topics overlap with current civic priorities.")

    if record["year"] >= current_year - 1:
        score += 0.04
        reasons.append("Recent meeting, so higher value for near-term testing.")

    score = max(0.0, min(score, 1.0))

    if score >= 0.8:
        label = "high-priority"
    elif score >= 0.6:
        label = "worth-fetching"
    elif score >= 0.35:
        label = "context-only"
    else:
        label = "not-ready"

    return {
        "id": record["id"],
        "bodyId": record["bodyId"],
        "bodyLabel": record["bodyLabel"],
        "meetingDate": record["meetingDate"],
        "meetingLabel": record["meetingLabel"],
        "year": record["year"],
        "title": record["title"],
        "recordType": record["recordType"],
        "agendaUrl": record["agendaUrl"],
        "minutesUrl": record.get("minutesUrl"),
        "topics": record.get("topics", []),
        "readiness": readiness,
        "qualityScore": round(score, 3),
        "qualityLabel": label,
        "reasons": reasons,
        "topicPriority": topic_priority,
    }


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"{json.dumps(payload, indent=2)}\n")


def build_source_reports() -> dict[str, Any]:
    manifest = read_json(DATA_DIR / "source-manifest.json")
    documents = [build_source_document(source) for source in manifest]

    report_documents = []
    for document in documents:
        derived_path = SOURCE_OUTPUT_DIR / f"{document['sourceId']}.json"
        write_json(derived_path, document)
        report_documents.append(
            {
                key: value
                for key, value in document.items()
                if key not in {"text"}
            }
            | {"derivedPath": str(derived_path.relative_to(ROOT))}
        )

    summary = {
        "sourceCount": len(report_documents),
        "byFileType": dict(Counter(document["fileType"] for document in report_documents)),
        "byDocumentType": dict(Counter(document["documentType"] for document in report_documents)),
        "byQualityLabel": dict(Counter(document["qualityLabel"] for document in report_documents)),
        "strongSourceIds": [
            document["sourceId"]
            for document in report_documents
            if document["qualityLabel"] in {"strong", "usable"}
        ],
    }

    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "summary": summary,
        "documents": report_documents,
    }
    write_json(DERIVED_DIR / "source-quality-report.json", report)
    return report


def build_archive_report() -> dict[str, Any]:
    archive_records = read_json(DATA_DIR / "official-record-archive.json")
    audits = [build_archive_record_audit(record) for record in archive_records]
    by_body: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"bodyLabel": "", "total": 0, "minutesAvailable": 0, "agendaOnly": 0}
    )

    for audit in audits:
        body = by_body[audit["bodyId"]]
        body["bodyLabel"] = audit["bodyLabel"]
        body["total"] += 1
        if audit["readiness"] == "minutes-available":
            body["minutesAvailable"] += 1
        else:
            body["agendaOnly"] += 1

    fetch_queue = sorted(
        [audit for audit in audits if audit["minutesUrl"]],
        key=lambda audit: (
            audit["qualityScore"],
            audit["topicPriority"],
            audit["meetingDate"],
        ),
        reverse=True,
    )[:80]

    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "recordCount": len(audits),
            "minutesAvailableCount": sum(1 for audit in audits if audit["minutesUrl"]),
            "agendaOnlyCount": sum(1 for audit in audits if audit["readiness"] == "agenda-only"),
            "byReadiness": dict(Counter(audit["readiness"] for audit in audits)),
            "byQualityLabel": dict(Counter(audit["qualityLabel"] for audit in audits)),
            "byBody": dict(sorted(by_body.items())),
        },
        "priorityFetchQueue": fetch_queue,
        "records": audits,
    }
    write_json(DERIVED_DIR / "official-record-quality-report.json", report)
    return report


def main() -> None:
    DERIVED_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    source_report = build_source_reports()
    archive_report = build_archive_report()

    print(
        "built data harness outputs: "
        f"{source_report['summary']['sourceCount']} raw sources, "
        f"{archive_report['summary']['recordCount']} archive records"
    )


if __name__ == "__main__":
    main()
