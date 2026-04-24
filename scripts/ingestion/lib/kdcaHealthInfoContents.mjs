export const representativeInfectiousHealthInfoContents = [
  { contentId: "5423", title: "감기", diseaseId: "common-cold" },
  { contentId: "6561", title: "결핵", diseaseId: "tuberculosis" },
  { contentId: "5227", title: "성병", diseaseId: "sti" },
  { contentId: "6303", title: "라임병", diseaseId: "lyme-disease" },
  { contentId: "5287", title: "백일해", diseaseId: "pertussis" },
  { contentId: "5317", title: "성홍열", diseaseId: "scarlet-fever" },
  { contentId: "5239", title: "식중독", diseaseId: "food-poisoning" },
  { contentId: "6313", title: "야토병", diseaseId: "tularemia" },
  { contentId: "5341", title: "장결핵", diseaseId: "intestinal-tuberculosis" },
  { contentId: "5289", title: "파상풍", diseaseId: "tetanus" },
  { contentId: "6314", title: "페스트", diseaseId: "plague" },
  { contentId: "5350", title: "편충증", diseaseId: "whipworm" },
  { contentId: "6246", title: "폴리오", diseaseId: "polio" },
  { contentId: "5338", title: "회충증", diseaseId: "ascariasis" },
  { contentId: "6294", title: "간흡충증", diseaseId: "clonorchiasis" },
  { contentId: "5284", title: "뇌수막염", diseaseId: "meningitis" },
  { contentId: "5245", title: "말라리아", diseaseId: "malaria" },
  { contentId: "5528", title: "사상충증", diseaseId: "filariasis" },
  { contentId: "5525", title: "샤가스병", diseaseId: "chagas-disease" },
  { contentId: "5311", title: "연성하감", diseaseId: "chancroid" },
];

export function buildKdcaHealthInfoUrl({ baseUrl, contentId }) {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}cntntsSn=${contentId}`;
}
