function toRecordArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    return [value];
  }

  return value;
}

export function selectJsonRecords(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  const dataGoKrItems = payload?.response?.body?.items?.item;
  if (dataGoKrItems) {
    return toRecordArray(dataGoKrItems);
  }

  return payload;
}
