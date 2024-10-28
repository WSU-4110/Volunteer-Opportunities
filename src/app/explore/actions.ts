"use server";

import { database } from "@/database/index";

import { authenticatedAction } from "@/lib/safe-action";
import { unauthenticatedAction } from "@/lib/safe-action";
import { skills, listings, skillsToListings } from "@/database/schema";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { list } from "postcss";
import { PgColumn } from "drizzle-orm/pg-core";

export async function getSkills(listingID : string) {
  const listingSkillsQuery = await database
  .select({name: skills.name})
  .from(skillsToListings)
  .innerJoin(skills, eq(skillsToListings.skillId, skills.id))
  .where(eq(skillsToListings.listingId, listingID))

  return listingSkillsQuery.map((item) => item.name);
}

export async function getListings() {
  return await database.select().from(listings);
}

export async function getListingsByCategory(category : PgColumn) {
  const results = await database.select().from(listings).where(sql`${category} LIKE '%${"Evil"}%'`) 
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
