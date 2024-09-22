"use server";

import { database } from "@/database/index";

import { authenticatedAction } from "@/lib/safe-action";
import { unauthenticatedAction } from "@/lib/safe-action";
import { skills, listings } from "@/database/schema";

import { z } from "zod";
import { eq } from "drizzle-orm";

export const getListingsBySkill = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      skill: z.string(),
    })
  )
  .handler(async ({ ctx: { user }, input: { skill } }) => {
    const results = await database.query.skillsToListings.findMany({
      with: {
        skills: {
          with: {
            listings: {
              where: eq(skills.name, skill),
            },
          },
        },
        listings: true,
      },
    });
  });
