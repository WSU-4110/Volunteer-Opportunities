import { database } from "@/database/index";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { listings, listingsToUsers } from "@/database/schema";

export const getListingById = unauthenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ input }: { input: string }) => {
    return await database.query.listings.findFirst({
      where: eq(listings.id, input),
      with: {
        organizations: true,
        volunteers: { with: { volunteers: true } },
        skills: { with: { skills: true } },
      },
    });
  });
