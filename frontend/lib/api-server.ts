import { API_INTERNAL } from "@/lib/api-config";
import { createClient } from "@/lib/supabase/server";

/** Server Component API calls — attaches the session token from request cookies. */
export async function apiFetchServer<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const response = await fetch(`${API_INTERNAL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
