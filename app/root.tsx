import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { getUserSession } from "./auth.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix + Firebase auth",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);

  const authTime = (sessionUser?.auth_time || 0) * 1000;
  const expiration = (sessionUser?.exp || 0) * 1000;

  return json({
    isLoggedIn: !!sessionUser,
    expiresAt: expiration,
    createdAt: authTime,
  });
};

export default function App() {
  const { isLoggedIn, createdAt, expiresAt } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          {isLoggedIn ? (
            <Form action="/logout" method="post">
              <button>Log out</button>
            </Form>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </nav>
        {createdAt > 0 && (
          <div>
            Session creation: {new Date(createdAt).toLocaleString()}.
            Expiration: {new Date(expiresAt).toLocaleString()}
          </div>
        )}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
