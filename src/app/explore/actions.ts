"use server";

import { database } from "@/database/index";

import { authenticatedAction } from "@/lib/safe-action";
import { unauthenticatedAction } from "@/lib/safe-action";
import { skills, listings, skillsToListings } from "@/database/schema";

import { z } from "zod";
import { and, eq, inArray, like, sql } from "drizzle-orm";
import { list } from "postcss";
import { PgColumn } from "drizzle-orm/pg-core";

export async function getSkills(listingID: string) {
  const listingSkillsQuery = await database
    .select({ name: skills.name })
    .from(skillsToListings)
    .innerJoin(skills, eq(skillsToListings.skillId, skills.id))
    .where(eq(skillsToListings.listingId, listingID));

  return listingSkillsQuery.map((item) => item.name);
}

export const getListings = authenticatedAction
  .createServerAction()
  .handler(async () => {
    return await database.query.listings.findMany({
      with: {
        skills: {
          with: {
            skills: true,
          },
        },
      },
    });
  });

export const getAllSkills = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    return await database.query.skills.findMany();
  });

export const filterListings = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
    })
  )
  .handler(
    async ({
      ctx: { user },
      input: { title, description, skills: listingSkills },
    }) => {
      const query = database
        .select({ ...listings, skills } as any)
        .from(listings)
        .innerJoin(
          skillsToListings,
          eq(skillsToListings.listingId, listings.id)
        )
        .innerJoin(skills, eq(skills.id, skillsToListings.skillId));

      if (title != "") {
        query.where(eq(listings.name, title));
      }
      if (description != "") {
        query.where(eq(listings.description, description));
      }
      if (listingSkills && listingSkills.length > 0) {
        query.where(inArray(skills.id, listingSkills));
      }

      const data = await query;

      return data;
    }
  );

// export const getListingsBySkill = authenticatedAction
//   .createServerAction()
//   .input(
//     z.object({
//       skill: z.string(),
//     })
//   )
//   .handler(async ({ ctx: { user }, input: { skill } }) => {
//     const results = await database.query.skillsToListings.findMany({
//       with: {
//         skills: {
//           with: {
//             listings: {
//               where: eq(skills.name, skill),
//             },
//           },
//         },
//         listings: true,
//       },
//     });

//     return results;
//   });
