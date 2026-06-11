/**
 * @file API client — wraps fetch calls to the Express backend
 * @description Provides the `api` object used by page components for all data operations.
 * @service Backend API (Express)
 */

const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  datetime: string;
  slots: number;
  filled: number;
  anon: boolean;
  category: string;
  categoryEmoji: string;
  tags: string[];
  hostPhone: string;
  hostName: string;
  hostAvatar: string;
  stripe: "primary" | "secondary" | "tertiary";
}

export const api = {
  activities: {
    getAll: (_params: unknown) => request<any[]>("/activities"),
    getOne: (id: string) => request<any>(`/activities/${id}`),
    create: (data: unknown) =>
      request<any>("/activities", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    join: (activityId: string, phone: string) =>
      request<any>(`/activities/${activityId}/join`, {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),
  },
  auth: {
    googleUrl: (_redirect: string) => request<{ url: string }>("/auth/google"),
    requestOtp: (phone: string) =>
      request<{ ok: boolean }>("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),
    verifyOtp: (phone: string, code: string) =>
      request<{ isNewUser: boolean }>("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
      }),
    getProfile: (phone: string) => request<any>(`/auth/profile/${phone}`),
    saveProfile: (data: unknown) =>
      request<any>("/auth/profile", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
