import { db } from "../server/db";
import { standards, hotspots } from "../shared/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";

interface ParsedStandard {
  title: string;
  body: string;
  standardNumber: string | null;
  inspectionYear: string | null;
  inspectionRound: string | null;
  hotspotId: number;
}

const HOTSPOT_KEYWORDS: { [key: number]: string[] } = {
  1: ["기계실", "권상기", "제어반"],
  6: ["제어반", "전기장치", "조작반"],
  7: ["권상기", "구동기", "모터", "브레이크"],
  11: ["로프", "주로프", "현가로프", "조속기로프"],
  12: ["토가드", "에이프런"],
  13: ["도르래", "풀리", "스프라켓"],
  15: ["카 지붕", "카상부", "카 상부", "상부틈새"],
  16: ["비상통화", "통화장치", "인터폰"],
  17: []
};

function extractStandardNumber(text: string): string | null {
  const patterns = [
    /\[별표\s*\d+\]\s*([\d.]+)/,
    /별표\s*\d+.*?([\d.]+)/,
    /^(\d+\.\d+(?:\.\d+)*)/m,
    /([\d]+\.[\d]+(?:\.[\d]+)*)/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function determineHotspot(title: string, body: string): number {
  const combined = (title + " " + body).toLowerCase();
  for (const [hotspotId, keywords] of Object.entries(HOTSPOT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword.toLowerCase())) {
        return parseInt(hotspotId);
      }
    }
  }
  return 17;
}

function parseYearRound(header: string): { year: string | null; round: string | null } {
  const yearMatch = header.match(/(20\d{2})년/);
  const roundMatch = header.match(/\[?(\d+)차\]?|제\s*(\d+)\s*차/);
  return {
    year: yearMatch ? yearMatch[1] : null,
    round: roundMatch ? (roundMatch[1] || roundMatch[2]) : null
  };
}

async function parseStandardsFromFile(filePath: string): Promise<ParsedStandard[]> {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const standards: ParsedStandard[] = [];
  
  let currentYear: string | null = null;
  let currentRound: string | null = null;
  let currentEntry: { num: number; title: string; bodyLines: string[] } | null = null;
  
  const entryStartPattern = /^\s*(\d+)\s+[‣▸]\s*(.+)$/;
  const yearRoundPattern = /(20\d{2})년.*?(\[?\d+차\]?|제\s*\d+\s*차)/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    const yrMatch = trimmed.match(yearRoundPattern);
    if (yrMatch) {
      const { year, round } = parseYearRound(trimmed);
      if (year) currentYear = year;
      if (round) currentRound = round;
      continue;
    }
    
    const entryMatch = line.match(entryStartPattern);
    if (entryMatch) {
      if (currentEntry && currentEntry.bodyLines.length > 0) {
        const body = currentEntry.bodyLines.join("\n").trim();
        const standardNumber = extractStandardNumber(body);
        const hotspotId = determineHotspot(currentEntry.title, body);
        standards.push({
          title: currentEntry.title,
          body: body,
          standardNumber,
          inspectionYear: currentYear,
          inspectionRound: currentRound,
          hotspotId
        });
      }
      currentEntry = {
        num: parseInt(entryMatch[1]),
        title: entryMatch[2].trim(),
        bodyLines: []
      };
      continue;
    }
    
    if (currentEntry && trimmed) {
      if (trimmed.startsWith("검사") || trimmed.startsWith("기준") ||
          trimmed.startsWith("표준") || trimmed.startsWith("화") ||
          trimmed.includes("『") || trimmed.includes("‣") ||
          trimmed.includes("▸") || trimmed.includes("※")) {
        currentEntry.bodyLines.push(trimmed);
      } else if (currentEntry.bodyLines.length > 0 || 
                 trimmed.startsWith("[별표") || 
                 trimmed.match(/^[가-힣]/)) {
        currentEntry.bodyLines.push(trimmed);
      }
    }
  }
  
  if (currentEntry && currentEntry.bodyLines.length > 0) {
    const body = currentEntry.bodyLines.join("\n").trim();
    const standardNumber = extractStandardNumber(body);
    const hotspotId = determineHotspot(currentEntry.title, body);
    standards.push({
      title: currentEntry.title,
      body: body,
      standardNumber,
      inspectionYear: currentYear,
      inspectionRound: currentRound,
      hotspotId
    });
  }
  
  return standards;
}

async function main() {
  console.log("Parsing PDF text file...");
  const parsedStandards = await parseStandardsFromFile("/tmp/elevator_standards.txt");
  console.log(`Found ${parsedStandards.length} standards`);
  
  const uniqueStandards = new Map<string, ParsedStandard>();
  for (const std of parsedStandards) {
    const key = std.title.trim().toLowerCase();
    if (!uniqueStandards.has(key)) {
      uniqueStandards.set(key, std);
    }
  }
  console.log(`Unique standards: ${uniqueStandards.size}`);
  
  const existingStandards = await db.select({ title: standards.title }).from(standards);
  const existingTitles = new Set(existingStandards.map(s => s.title.trim().toLowerCase()));
  
  const newStandards = Array.from(uniqueStandards.values())
    .filter(s => !existingTitles.has(s.title.trim().toLowerCase()));
  console.log(`New standards to add: ${newStandards.length}`);
  
  let added = 0;
  for (const std of newStandards) {
    try {
      await db.insert(standards).values({
        title: std.title,
        body: std.body,
        standardNumber: std.standardNumber,
        inspectionYear: std.inspectionYear,
        inspectionRound: std.inspectionRound,
        categoryId: null,
        hotspotId: std.hotspotId,
        imageUrls: null,
        permitDate: null,
        inspectionDate: null
      });
      added++;
      if (added % 10 === 0) {
        console.log(`Added ${added} standards...`);
      }
    } catch (error) {
      console.error(`Error adding: ${std.title}`, error);
    }
  }
  
  console.log(`Successfully added ${added} new standards`);
  process.exit(0);
}

main().catch(console.error);
