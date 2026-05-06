// Auth helper functions
// Těchto funkcí můžeš použít k ověření autentizace

// Kontrola, jestli je uživatel přihlášený
export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false; // SSR safety
  const auth = localStorage.getItem("adminAuth");
  return !!auth;
}

// Přihlášení (uloží auth token do localStorage)
export function loginAdmin() {
  const authData = {
    authenticated: true,
    timestamp: Date.now(),
    expiresAt: Date.now() + 3600000, // 1 hodina
  };
  localStorage.setItem("adminAuth", JSON.stringify(authData));
}

// Odhlášení
export function logoutAdmin() {
  localStorage.removeItem("adminAuth");
}

// Kontrola, jestli je session stále platná
export function isSessionValid() {
  if (typeof window === "undefined") return false;
  const auth = localStorage.getItem("adminAuth");
  if (!auth) return false;

  try {
    const authData = JSON.parse(auth);
    const now = Date.now();
    return authData.expiresAt > now;
  } catch {
    return false;
  }
}

// Refresh session (prodloužení doby přihlášení)
export function refreshSession() {
  const authData = {
    authenticated: true,
    timestamp: Date.now(),
    expiresAt: Date.now() + 3600000, // 1 hodina
  };
  localStorage.setItem("adminAuth", JSON.stringify(authData));
}
