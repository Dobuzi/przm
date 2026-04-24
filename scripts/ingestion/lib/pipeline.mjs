const regionAliases = new Map([
  ["서울 강서구", "11160"],
  ["서울특별시 강서구", "11160"],
  ["강서구", "11160"],
  ["성남시 분당구", "31023"],
  ["분당구", "31023"],
  ["수원시 영통구", "31014"],
  ["영통구", "31014"],
]);

const diseaseAliases = new Map([
  ["감기", "common-cold"],
  ["common cold", "common-cold"],
  ["flu a", "flu-a"],
  ["flu-a", "flu-a"],
  ["influenza a", "flu-a"],
  ["rsv", "rsv"],
  ["respiratory syncytial virus", "rsv"],
  ["adeno", "adeno"],
  ["adenovirus", "adeno"],
  ["heat illness", "heat-illness"],
  ["heat-illness", "heat-illness"],
  ["온열질환", "heat-illness"],
  ["결핵", "tuberculosis"],
  ["tuberculosis", "tuberculosis"],
  ["성병", "sti"],
  ["sti", "sti"],
  ["라임병", "lyme-disease"],
  ["lyme disease", "lyme-disease"],
  ["백일해", "pertussis"],
  ["pertussis", "pertussis"],
  ["성홍열", "scarlet-fever"],
  ["scarlet fever", "scarlet-fever"],
  ["식중독", "food-poisoning"],
  ["food poisoning", "food-poisoning"],
  ["야토병", "tularemia"],
  ["tularemia", "tularemia"],
  ["장결핵", "intestinal-tuberculosis"],
  ["파상풍", "tetanus"],
  ["tetanus", "tetanus"],
  ["페스트", "plague"],
  ["plague", "plague"],
  ["편충증", "whipworm"],
  ["폴리오", "polio"],
  ["polio", "polio"],
  ["회충증", "ascariasis"],
  ["간흡충증", "clonorchiasis"],
  ["뇌수막염", "meningitis"],
  ["meningitis", "meningitis"],
  ["말라리아", "malaria"],
  ["malaria", "malaria"],
  ["사상충증", "filariasis"],
  ["샤가스병", "chagas-disease"],
  ["chagas disease", "chagas-disease"],
  ["연성하감", "chancroid"],
]);

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeLookupKey(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/\s*-\s*/g, "-");
}

function normalizeAge(value) {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function normalizeGender(value) {
  const normalized = normalizeLookupKey(value);

  if (["m", "male", "남", "남아"].includes(normalized)) {
    return "male";
  }

  if (["f", "female", "여", "여아"].includes(normalized)) {
    return "female";
  }

  return null;
}

function normalizeCaseCount(value) {
  const number = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function getRegionId(label) {
  return regionAliases.get(normalizeText(label)) ?? null;
}

function getDiseaseId(label) {
  return diseaseAliases.get(normalizeLookupKey(label)) ?? null;
}

export function ingestRecords(records) {
  const rawRecords = records.map((record) => ({
    sourceName: normalizeText(record.source_name),
    sourceRecordId: normalizeText(record.source_record_id),
    sourcePayload: record,
    reportedDate: normalizeText(record.reported_date),
    regionLabel: normalizeText(record.region_label),
    diseaseLabel: normalizeText(record.disease_label),
    ageRaw: normalizeText(record.age_raw),
    genderRaw: normalizeText(record.gender_raw),
    caseCountRaw: normalizeText(record.case_count_raw),
  }));

  const normalizedRecords = [];
  const quarantinedRecords = [];

  for (const rawRecord of rawRecords) {
    const date = rawRecord.reportedDate || null;
    const regionId = getRegionId(rawRecord.regionLabel);
    const diseaseId = getDiseaseId(rawRecord.diseaseLabel);
    const age = normalizeAge(rawRecord.ageRaw);
    const gender = normalizeGender(rawRecord.genderRaw);
    const caseCount = normalizeCaseCount(rawRecord.caseCountRaw);

    let quarantineReason = null;

    if (!date) {
      quarantineReason = "missing_date";
    } else if (!regionId) {
      quarantineReason = normalizeText(rawRecord.regionLabel).includes("서울")
        || normalizeText(rawRecord.regionLabel).includes("경기")
        || normalizeText(rawRecord.regionLabel).includes("성남")
        || normalizeText(rawRecord.regionLabel).includes("수원")
        ? "unknown_region"
        : "unsupported_region";
    } else if (!diseaseId) {
      quarantineReason = "unknown_disease";
    } else if (age === null || age < 0 || age > 13) {
      quarantineReason = "unsupported_age";
    } else if (!gender) {
      quarantineReason = "unsupported_gender";
    } else if (caseCount === null) {
      quarantineReason = "invalid_case_count";
    }

    const normalizedRecord = {
      sourceName: rawRecord.sourceName,
      sourceRecordId: rawRecord.sourceRecordId,
      date,
      regionId,
      diseaseId,
      age,
      gender,
      caseCount,
      isQuarantined: quarantineReason !== null,
      quarantineReason,
    };

    if (quarantineReason) {
      quarantinedRecords.push(normalizedRecord);
    } else {
      normalizedRecords.push(normalizedRecord);
    }
  }

  const summary = {
    rawCount: rawRecords.length,
    normalizedCount: normalizedRecords.length,
    quarantineCount: quarantinedRecords.length,
    quarantineByReason: quarantinedRecords.reduce((acc, record) => {
      const key = record.quarantineReason;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  };

  return {
    rawRecords,
    normalizedRecords,
    quarantinedRecords,
    summary,
  };
}
