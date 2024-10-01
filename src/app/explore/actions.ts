"use server";

import { database } from "@/database/index";

import { authenticatedAction } from "@/lib/safe-action";
import { unauthenticatedAction } from "@/lib/safe-action";
import { skills, listings, skillsToListings } from "@/database/schema";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { list } from "postcss";

export async function getSkills(listingID : string) {
  const listingSkillsQuery = await database
  .select()
  .from(skillsToListings)
  .innerJoin(skills, eq(skillsToListings.skillId, skills.id))
  .where(eq(skillsToListings.listingId, listingID))

  const listingSkills = listingSkillsQuery.map((item) => (
    item.skills.name
  ))

  return listingSkills;
}

export async function getListings() {
  return await database.select().from(listings);
}

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

    return results;
  });
