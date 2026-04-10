import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildSnapshotCandidate } from "./lib/snapshotCandidate.mjs";

const inputPath = path.join(process.cwd(), "tmp", "ingestion", "mock-ingestion-output.json");
const outputDir = path.join(process.cwd(), "tmp", "analytics");
const outputPath = path.join(outputDir, "mock-snapshot-candidate.json");

async function main() {
  const rawInput = await readFile(inputPath, "utf-8");
  const ingestionOutput = JSON.parse(rawInput);
  const candidate = buildSnapshotCandidate(ingestionOutput.normalizedRecords ?? []);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(candidate, null, 2)}\n`, "utf-8");

  console.log(`snapshot candidate written to ${outputPath}`);
  console.log(
    JSON.stringify(
      {
        snapshot: candidate.snapshot,
        summary: candidate.summary,
      },
      null,
      2,
    ),
  );
}

void main();
