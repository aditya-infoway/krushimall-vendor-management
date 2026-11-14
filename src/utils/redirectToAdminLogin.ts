// Env ho to wahi, warna same origin ka /krushimall-admin
const ADMIN_APP_URL =
  (import.meta.env.VITE_ADMIN_APP_URL as string | undefined) ||
  `${window.location.origin}/krushimall-admin`;

// Vendor session khatam hone par admin ke login page par bhejta hai
export function redirectToAdminLogin() {
  window.location.replace(`${ADMIN_APP_URL.replace(/\/$/, "")}/login`);
}