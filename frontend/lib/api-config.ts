// API_BASE is used by the browser (client-side) to reach the backend.
// In Docker, the browser runs on the host machine so localhost works.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// INTERNAL_API_URL is used by the Next.js server (SSR) to reach the backend.
// In Docker, the frontend container uses the Docker service name "backend".
// For local dev, the default is the same as API_BASE.
export const API_INTERNAL =
  process.env.INTERNAL_API_URL || API_BASE;
