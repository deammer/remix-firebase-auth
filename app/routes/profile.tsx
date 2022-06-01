import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { getUserSession } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);

  return json({
    isLoggedIn: !!sessionUser,
    email: sessionUser?.email,
  });
};

const Profile: FC = () => {
  const { isLoggedIn, email } = useLoaderData();

  return (
    <div>
      <h1>Profile</h1>
      {isLoggedIn ? (
        <p>Welcome, {email}!</p>
      ) : (
        <p>
          Please <Link to="/login">log in</Link> to view your profile
        </p>
      )}
    </div>
  );
};

export default Profile;
