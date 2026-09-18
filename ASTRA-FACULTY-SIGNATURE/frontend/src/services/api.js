/**
 * api.js
 * ------
 * Thin wrapper around the ASTRA 2K26 backend so components never call
 * fetch() directly. The base URL is configurable via VITE_API_URL so the
 * same build works on localhost or when opened from a phone at the event.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (networkErr) {
    throw new ApiError(
      "We couldn't reach the server. Check your connection and try again.",
      0,
      null
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // No JSON body — leave data as null.
  }

  if (!response.ok) {
    const detail = data?.detail;
    const message =
      (typeof detail === "object" && detail?.message) ||
      (typeof detail === "string" && detail) ||
      "Something went wrong. Please try again.";
    throw new ApiError(message, response.status, detail);
  }

  return data;
}

export const api = {
  getFacultyList: () => request("/faculty"),
  getFaculty: (id) => request(`/faculty/${id}`),
  getFacultyStatus: (id) => request(`/faculty/${id}/status`),
  submitSignature: (id, signatureDataUrl) =>
    request(`/faculty/${id}/signature`, {
      method: "POST",
      body: JSON.stringify({ signature: signatureDataUrl }),
    }),
};

export { ApiError };
