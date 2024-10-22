"use server";

import { signOut, auth } from "@/auth";
import { database } from "@/database";
import { authenticatedAction } from "@/lib/safe-action";
import { organizations } from "@/database/schema";
import { eq } from "drizzle-orm";

export const signOutAction = async () => {
  await signOut({ redirect: true, redirectTo: "/" });
};

export const getOneUserOrganization = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const userHasOrganization = await database.query.organizations.findFirst({
      where: eq(organizations.creator, user.id),
    });

    return !!userHasOrganization;
  });
