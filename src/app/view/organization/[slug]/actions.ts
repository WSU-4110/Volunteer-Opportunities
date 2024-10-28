import { database } from "@/database/index";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { organizations } from "@/database/schema";

export const getOrganizationById = unauthenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ input }: { input: string }) => {
    const organization = await database.query.organizations.findFirst({
      where: eq(organizations.id, input),
      with: {
        listings: true,
        users: true,
      },
    });

    return organization;
  });