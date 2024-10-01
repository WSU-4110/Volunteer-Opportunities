"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { listings, organizations } from "@/database/schema";
import { database } from "@/database";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const createListingAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string(),
      organizationId: z.string(),
      description: z.string(),
      thumbnail: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const listing = await database.insert(listings).values({ ...input });

    redirect(`/view/organization/${input.organizationId}`);
  });

export const getOrganizationsForUser = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: user }) => {
    const organizationsForUser = await database.query.organizations.findMany({
      where: eq(organizations.creator, user.user.id),
    });

    return organizationsForUser;
  });
