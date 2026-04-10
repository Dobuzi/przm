import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ingestRecords } from "./lib/pipeline.mjs";
import {
  createLocalJsonSourceAdapter,
  loadSourceRecords,
} from "./lib/sourceAdapters.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(__dirname, "fixtures", "sample-source-records.json");
const outputDir = path.join(process.cwd(), "tmp", "ingestion");
const outputPath = path.join(outputDir, "mock-ingestion-output.json");

async function main() {
  const adapter = createLocalJsonSourceAdapter({
    sourceName: "sample-public-health",
    fixturePath,
  });
  const records = await loadSourceRecords(adapter);
  const result = ingestRecords(records);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf-8");

  console.log(`ingestion output written to ${outputPath}`);
  console.log(
    JSON.stringify(
      {
        source: adapter.sourceName,
        summary: result.summary,
      },
      null,
      2,
    ),
  );
}

void main();
