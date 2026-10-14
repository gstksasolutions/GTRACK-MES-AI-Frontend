import newRequest from "./userRequest";

export const DETECTION_CLASSES = [
  { class: "no_helmet", label: "No Helmet" },
  { class: "no_safety_vest", label: "No Safety Vest" },
  { class: "no_mask", label: "No Mask" },
  { class: "no_boots", label: "No Boots" },
  { class: "no_goggles", label: "No Goggles" },
  { class: "no_gloves", label: "No Gloves" },
];

export const ALERT_STATUSES = ["New", "In Progress", "Resolved"];

export function formatAlertDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function fetchDetectionAlerts({
  start,
  end,
  classes,
  status,
  page = 1,
  limit = 50,
} = {}) {
  const params = { page, limit };
  if (start) params.start = start;
  if (end) params.end = end;
  if (status) params.status = status;
  if (classes?.length) params.class = classes.join(",");

  const res = await newRequest.get("/detection-alerts", { params });
  return res.data;
}
