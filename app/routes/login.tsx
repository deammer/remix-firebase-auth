import { useLoaderData, useSubmit } from "@remix-run/react";
import { FC } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { createUserSession } from "~/auth.server";
import { getFirebaseClientConfig } from "~/admin.server";

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
};

function initFirebaseClient(config: FirebaseClientConfig) {
  const app = initializeApp(config);
  const auth = getAuth(app);

  return auth;
}

export const loader: LoaderFunction = () => {
  const firebaseConfig = getFirebaseClientConfig();

  return json({ firebaseConfig });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const idToken = formData.get("idToken")?.toString() as string;

  return await createUserSession(idToken, "/profile");
};

const Login: FC = () => {
  const { firebaseConfig } = useLoaderData();

  const submit = useSubmit();

  const signIn = async () => {
    const firebaseClientAuth = initFirebaseClient(firebaseConfig);

    const githubAuth = new GithubAuthProvider();
    githubAuth.addScope("read:user");

    const result = await signInWithPopup(firebaseClientAuth, githubAuth);
    const idToken = await result.user.getIdToken(true);

    const credential = GithubAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (idToken && accessToken) {
      // Once we're logged in, we need to store the session on the server. We do
      // this by POSTing to this page, which is handled by the action function.
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("accessToken", accessToken);
      submit(formData, { method: "post", action: "/login" });
    } else {
      alert("Sign-in failed, please try again");
    }
  };

  return (
    <main>
      <p>Use your GitHub account to log in and manage your profile.</p>
      <button type="button" onClick={signIn}>
        Log in with GitHub
      </button>
    </main>
  );
};

export default Login;
