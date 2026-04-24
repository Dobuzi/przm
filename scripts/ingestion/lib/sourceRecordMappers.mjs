function readField(record, fieldName) {
  return record?.[fieldName] ?? "";
}

function joinRegionLabel(sido, sigungu) {
  return [sido, sigungu].filter(Boolean).join(" ");
}

function makeSourceRecordId(sourceName, record, values) {
  const explicitId = record.id
    ?? record.ID
    ?? record.source_record_id
    ?? record["연번"]
    ?? record["순번"];

  if (explicitId) {
    return String(explicitId);
  }

  return [
    sourceName,
    values.reportedDate,
    values.sido,
    values.sigungu,
    values.diseaseLabel,
    values.ageRaw,
    values.genderRaw,
  ]
    .filter(Boolean)
    .join("-");
}

export function mapSourceRecords(records, mapper) {
  return records.map((record) => mapper(record));
}

export function createKoreanPublicHealthRecordMapper({
  sourceName,
  defaultDiseaseLabel = "",
  dateField = "발생일자",
  sidoField = "발생시도",
  sigunguField = "발생시군구",
  diseaseField = "질병명",
  ageField = "나이",
  genderField = "성별",
  caseCountField = "신고건수",
}) {
  return (record) => {
    const values = {
      reportedDate: readField(record, dateField),
      sido: readField(record, sidoField),
      sigungu: readField(record, sigunguField),
      diseaseLabel: readField(record, diseaseField) || defaultDiseaseLabel,
      ageRaw: readField(record, ageField),
      genderRaw: readField(record, genderField),
      caseCountRaw: readField(record, caseCountField),
    };

    return {
      source_name: sourceName,
      source_record_id: makeSourceRecordId(sourceName, record, values),
      reported_date: values.reportedDate,
      region_label: joinRegionLabel(values.sido, values.sigungu),
      disease_label: values.diseaseLabel,
      age_raw: values.ageRaw,
      gender_raw: values.genderRaw,
      case_count_raw: values.caseCountRaw,
    };
  };
}
