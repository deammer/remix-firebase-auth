import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { auth } from "./admin.server";

const sessionCookieSecret = process.env.SESSION_COOKIE_SECRET;
if (!sessionCookieSecret) {
  throw new Error(
    "Please provide a SESSION_COOKIE_SECRET environment variable"
  );
}

const fiveMinutesInSeconds = 60 * 5;
const fiveMinutesInMilliseconds = fiveMinutesInSeconds * 1000;

// We're using 5 minutes for demo purposes. In a real project, the cookie
// expiration should probably be a lot longer!
const COOKIE_EXPIRATION = {
  seconds: fiveMinutesInSeconds,
  milliseconds: fiveMinutesInMilliseconds,
};

const sessionStorage =
  // Remix's built-in session handling
  // https://remix.run/docs/en/v1/api/remix#sessions
  createCookieSessionStorage({
    cookie: {
      // Firebase token
      name: "fb:token",
      httpOnly: true,
      maxAge: COOKIE_EXPIRATION.seconds,
      path: "/",
      sameSite: "lax",
      // https://remix.run/docs/en/v1/api/remix#signing-cookies
      secrets: [sessionCookieSecret],
      secure: true,
    },
  });

export async function createUserSession(idToken: string, redirectTo = "/") {
  const token = await auth.createSessionCookie(idToken, {
    expiresIn: COOKIE_EXPIRATION.milliseconds,
  });
  const session = await sessionStorage.getSession();
  session.set("token", token);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const cookieSession = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const token = cookieSession.get("token");
  if (!token) return null;

  try {
    const tokenUser = await auth.verifySessionCookie(token, true);
    return tokenUser;
  } catch (error) {
    return null;
  }
}

export async function destroyUserSession(
  request: Request,
  redirectTo = "/login"
) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const newCookie = await sessionStorage.destroySession(session);

  return redirect(redirectTo, { headers: { "Set-Cookie": newCookie } });
}
