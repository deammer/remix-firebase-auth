import type { ActionFunction } from "@remix-run/node";
import { destroyUserSession } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return await destroyUserSession(request);
};
