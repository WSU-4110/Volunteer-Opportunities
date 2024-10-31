"use server";

import { database } from "@/database/index";

import Listing from "@/components/Listing"

import { authenticatedAction } from "@/lib/safe-action";
import { unauthenticatedAction } from "@/lib/safe-action";
import { skills, listings, skillsToListings } from "@/database/schema";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { list } from "postcss";
import { PgColumn } from "drizzle-orm/pg-core";
import { ListingsWithTalentsInterface } from "@/components/Listing";
import ReactDOMServer from "react-dom/server";

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

// AUTHENTICATED ACTION

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
