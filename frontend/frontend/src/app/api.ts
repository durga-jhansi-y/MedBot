const BASE_URL = "http://127.0.0.1:5000";

export const api = {
  login: async (patientName: string) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_name: patientName }),
    });
    return res.json();
  },

  uploadPrescription: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/upload-prescription`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },

  addManual: async (data: object) => {
    const res = await fetch(`${BASE_URL}/add-manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  askQuestion: async (patientName: string, question: string) => {
    const res = await fetch(`${BASE_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_name: patientName, question }),
    });
    return res.json();
  },

  getMedications: async (patientName: string) => {
    const res = await fetch(`${BASE_URL}/get-medications/${patientName}`);
    return res.json();
  },
};