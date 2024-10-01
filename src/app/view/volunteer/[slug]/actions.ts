import { database } from "@/database/index";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";

export const getUserById = unauthenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ input }: { input: string }) => {
    return await database.query.users.findFirst({
      where: eq(users.id, input),
      with: {
        organizations: true,
        listings: { with: { listings: true } },
        skills: { with: { skills: true } },
      },
    });
  });
