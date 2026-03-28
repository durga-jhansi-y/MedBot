const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function baseUrl(path: string) {
  if (API_BASE) return `${API_BASE}${path}`;
  return path;
}

export async function addMedication(data: any) {
  const res = await fetch(baseUrl("/api/medications"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Add medication failed: ${res.status}`);
  return res.json();
}

export async function uploadPrescription(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(baseUrl("/api/upload"), {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function getMedications() {
  const res = await fetch(baseUrl("/api/medications"));
  if (!res.ok) throw new Error(`Fetch medications failed: ${res.status}`);
  return res.json();
}

export async function markMedicationTaken(id: number) {
  const res = await fetch(baseUrl(`/api/medications/${id}/take`), {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Mark taken failed: ${res.status}`);
  return res.json();
}

export async function sendChatMessage(message: string) {
  const res = await fetch(baseUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  return res.json();
}

export async function getProfile() {
  const res = await fetch(baseUrl("/api/me"));
  if (!res.ok) throw new Error(`Get profile failed: ${res.status}`);
  return res.json();
}

export async function getProfiles() {
  const res = await fetch(baseUrl("/profiles"));
  if (!res.ok) throw new Error(`Get profiles failed: ${res.status}`);
  return res.json();
}

export async function createProfile(data: any) {
  const res = await fetch(baseUrl("/profiles"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Create profile failed: ${res.status}`);
  return res.json();
}

export async function resetOnboarding() {
  const res = await fetch(baseUrl("/api/onboarding/reset"), {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Reset onboarding failed: ${res.status}`);
  return res.json();
}

export default { addMedication, uploadPrescription, getMedications, markMedicationTaken, sendChatMessage, getProfile, getProfiles, createProfile, resetOnboarding };
