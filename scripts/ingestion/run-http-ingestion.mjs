import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ingestRecords } from "./lib/pipeline.mjs";
import {
  createHttpJsonSourceAdapter,
  loadSourceRecords,
} from "./lib/sourceAdapters.mjs";
import {
  createKoreanPublicHealthRecordMapper,
  mapSourceRecords,
} from "./lib/sourceRecordMappers.mjs";
import { resolveSourceConfig } from "./lib/sourcePresets.mjs";
import { selectJsonRecords } from "./lib/sourceResponseSelectors.mjs";

const sourceConfig = resolveSourceConfig({
  preset: process.env.PRZM_SOURCE_PRESET,
  sourceUrl: process.env.PRZM_SOURCE_URL,
  sourceName: process.env.PRZM_SOURCE_NAME,
  sourceFormat: process.env.PRZM_SOURCE_FORMAT,
  defaultDiseaseLabel: process.env.PRZM_DEFAULT_DISEASE_LABEL,
});
const outputDir = path.join(process.cwd(), "tmp", "ingestion");
const outputPath = path.join(outputDir, "http-ingestion-output.json");

function mapRecords(records) {
  if (sourceConfig.sourceFormat === "korean-public-health") {
    return mapSourceRecords(
      records,
      createKoreanPublicHealthRecordMapper({
        sourceName: sourceConfig.sourceName,
        defaultDiseaseLabel: sourceConfig.defaultDiseaseLabel,
      }),
    );
  }

  return records;
}

async function main() {
  if (!sourceConfig.sourceUrl) {
    throw new Error("PRZM_SOURCE_URL is required for HTTP ingestion");
  }

  const adapter = createHttpJsonSourceAdapter({
    sourceName: sourceConfig.sourceName,
    url: sourceConfig.sourceUrl,
    selectRecords: selectJsonRecords,
  });
  const records = mapRecords(await loadSourceRecords(adapter));
  const result = ingestRecords(records);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf-8");

  console.log(`HTTP ingestion output written to ${outputPath}`);
  console.log(
    JSON.stringify(
      {
        source: adapter.sourceName,
        sourceUrl: sourceConfig.sourceUrl,
        sourceFormat: sourceConfig.sourceFormat,
        summary: result.summary,
      },
      null,
      2,
    ),
  );
}

void main();
