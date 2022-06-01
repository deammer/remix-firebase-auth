import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Remix + Firebase authentication</h1>
      <p>
        This is an example of how to integrate Remix with Firebase's
        authentication system. It uses a popup that asks for GitHub credentials,
        but can be adapted to work with any auth provider including username +
        password.
      </p>
      <p>
        <Link to="/login">Log in</Link> with your GitHub account. The{" "}
        <Link to="/profile">Profile page</Link> will display your email once
        you've logged in.
      </p>
      <p>Learn more:</p>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://firebase.google.com/docs/auth/admin/manage-cookies"
            rel="noreferrer"
          >
            Managing cookies with Firebase Admin
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/docs/en/v1/api/remix#sessions"
            rel="noreferrer"
          >
            Learn about session management
          </a>
        </li>
      </ul>
    </div>
  );
}
