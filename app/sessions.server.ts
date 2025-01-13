// app/sessions.server.ts
import { createCookieSessionStorage } from "@remix-run/cloudflare";

let _sessionStorage: ReturnType<typeof createCookieSessionStorage>;

export function getSessionStorage(env: Env) {
  if (!_sessionStorage) {
    _sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "edit_session",
        secrets: [env.SESSION_SECRET],
        sameSite: "lax",
        secure: true,
      },
    });
  }
  return _sessionStorage;
}

export async function getSession(request: Request, env: Env) {
  const storage = getSessionStorage(env);
  return storage.getSession(request.headers.get("Cookie"));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function commitSession(session: any, env: Env) {
  const storage = getSessionStorage(env);
  return storage.commitSession(session);
}
