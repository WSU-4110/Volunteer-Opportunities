"use server";

import { database } from "@/database/index";

import { authenticatedAction } from "@/lib/safe-action";
import { unauthenticatedAction } from "@/lib/safe-action";
import {
  skills,
  listings,
  skillsToListings,
  organizations,
  users,
  listingsToUsers,
} from "@/database/schema";

import { z } from "zod";
import { and, eq, inArray, sql, ilike, count } from "drizzle-orm";
import { list } from "postcss";
import { PgColumn } from "drizzle-orm/pg-core";
import { revalidateListingPaths } from "../edit/[slug]/actions";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/database/sthree";

export const getUser = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    return user.id;
  });
export const getListings = unauthenticatedAction
  .createServerAction()
  .handler(async () => {
    try {
      const results = await database
        .select({
          listings,
          skills: sql`
        COALESCE(
          (
            SELECT json_agg(subquery) 
            FROM (
              SELECT DISTINCT ON (s.id) 
                s.id, s.name, s."iconUrl"
              FROM "skills" AS s
              JOIN "listings_skills" AS ls ON ls."skill_id" = s.id
              WHERE ls."listingId" = listings.id
            ) as subquery
          ), '[]'::json
        ) AS skills`,
          organizations,
          volunteers: sql`
          COALESCE(
            (
              SELECT json_agg(subquery) 
              FROM (
                SELECT DISTINCT ON (u.id)
                  u.id, u.name, u.image
                FROM "user" AS u
                JOIN "listing_volunteers" AS ltu ON ltu."userId" = u.id
                WHERE ltu."listing_id" = listings.id
              ) as subquery
            ), '[]'::json
          ) AS users`,
        })
        .from(listings)
        .leftJoin(organizations, eq(listings.organizationId, organizations.id))
        .groupBy(listings.id, organizations.id)
        .execute();

      return results;
    } catch (err) {
      console.log(err);
    }
  });

export const getListingsWithOffset = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      limit: z.number().default(2),
      offset: z.number(),
    })
  )
  .handler(async ({ input: { limit, offset } }) => {
    try {
      const results = await database
        .select({
          listings,
          skills: sql`
        COALESCE(
          (
            SELECT json_agg(subquery) 
            FROM (
              SELECT DISTINCT ON (s.id) 
                s.id, s.name, s."iconUrl"
              FROM "skills" AS s
              JOIN "listings_skills" AS ls ON ls."skill_id" = s.id
              WHERE ls."listingId" = listings.id
            ) as subquery
          ), '[]'::json
        ) AS skills`,
          organizations,
          volunteers: sql`
          COALESCE(
            (
              SELECT json_agg(subquery) 
              FROM (
                SELECT DISTINCT ON (u.id)
                  u.id, u.name, u.image
                FROM "user" AS u
                JOIN "listing_volunteers" AS ltu ON ltu."userId" = u.id
                WHERE ltu."listing_id" = listings.id
              ) as subquery
            ), '[]'::json
          ) AS users`,
        })
        .from(listings)
        .leftJoin(organizations, eq(listings.organizationId, organizations.id))
        .groupBy(listings.id, organizations.id)
        .limit(limit)
        .offset(offset)
        .execute();

      return results;
    } catch (err) {
      console.log(err);
    }
  });

export const getNumberOfPagesOfListings = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      limit: z.number().default(2),
    })
  )
  .handler(async ({ input: { limit } }) => {
    try {
      const results = await database.select({ count: count() }).from(listings);

      const numberOfPages = Math.ceil(results[0].count / limit);
      return numberOfPages;
    } catch (err) {
      console.log(err);
    }
  });

export const getAllSkills = unauthenticatedAction
  .createServerAction()
  .handler(async () => {
    return await database.query.skills.findMany();
  });

export const filterListings = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
    })
  )
  .handler(async ({ input: { title, description, skills: listingSkills } }) => {
    try {
      const query = database
        .select({
          listings,
          skills: sql`
        COALESCE(
          (
            SELECT json_agg(subquery) 
            FROM (
              SELECT DISTINCT ON (s.id) 
                s.id, s.name, s."iconUrl"
              FROM "skills" AS s
              JOIN "listings_skills" AS ls ON ls."skill_id" = s.id
              WHERE ls."listingId" = listings.id
            ) as subquery
          ), '[]'::json
        ) AS skills`,
          organizations,
          volunteers: sql`
          COALESCE(
            (
              SELECT json_agg(subquery) 
              FROM (
                SELECT DISTINCT ON (u.id)
                  u.id, u.name, u.image
                FROM "user" AS u
                JOIN "listing_volunteers" AS ltu ON ltu."userId" = u.id
                WHERE ltu."listing_id" = listings.id
              ) as subquery
            ), '[]'::json
          ) AS users`,
        })
        .from(listings)
        .leftJoin(organizations, eq(listings.organizationId, organizations.id))
        .leftJoin(skillsToListings, eq(listings.id, skillsToListings.listingId))
        .leftJoin(skills, eq(skillsToListings.skillId, skills.id))
        .groupBy(listings.id, organizations.id);

      const conditions = [];

      // Add conditions based on the presence of values
      if (title != "") {
        conditions.push(ilike(listings.name, `%${title}%`));
      }
      if (description != "") {
        conditions.push(ilike(listings.description, `%${description}%`));
      }
      if (listingSkills && listingSkills.length > 0) {
        conditions.push(inArray(skills.id, listingSkills));
      }

      // Use and() to combine all conditions with AND

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      const data = await query.execute();

      return data;
    } catch (err) {
      console.log(err);
    }
  });

export const filterListingsWithOffset = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
    })
  )
  .handler(async ({ input: { title, description, skills: listingSkills } }) => {
    try {
      const query = database
        .select({
          listings,
          skills: sql`
        COALESCE(
          (
            SELECT json_agg(subquery) 
            FROM (
              SELECT DISTINCT ON (s.id) 
                s.id, s.name, s."iconUrl"
              FROM "skills" AS s
              JOIN "listings_skills" AS ls ON ls."skill_id" = s.id
              WHERE ls."listingId" = listings.id
            ) as subquery
          ), '[]'::json
        ) AS skills`,
          organizations,
          volunteers: sql`
          COALESCE(
            (
              SELECT json_agg(subquery) 
              FROM (
                SELECT DISTINCT ON (u.id)
                  u.id, u.name, u.image
                FROM "user" AS u
                JOIN "listing_volunteers" AS ltu ON ltu."userId" = u.id
                WHERE ltu."listing_id" = listings.id
              ) as subquery
            ), '[]'::json
          ) AS users`,
        })
        .from(listings)
        .leftJoin(organizations, eq(listings.organizationId, organizations.id))
        .leftJoin(skillsToListings, eq(listings.id, skillsToListings.listingId))
        .leftJoin(skills, eq(skillsToListings.skillId, skills.id))
        .groupBy(listings.id, organizations.id);

      const conditions = [];

      // Add conditions based on the presence of values
      if (title != "") {
        conditions.push(ilike(listings.name, `%${title}%`));
      }
      if (description != "") {
        conditions.push(ilike(listings.description, `%${description}%`));
      }
      if (listingSkills && listingSkills.length > 0) {
        conditions.push(inArray(skills.id, listingSkills));
      }

      // Use and() to combine all conditions with AND

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      const data = await query.execute();

      return data;
    } catch (err) {
      console.log(err);
    }
  });

export const getNumberOfPagesOfListingsWithFilter = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      limit: z.number().default(2),
    })
  )
  .handler(async ({ input: { limit } }) => {
    try {
      const results = await database.select({ count: count() }).from(listings);

      const numberOfPages = Math.ceil(results[0].count / limit);
      return numberOfPages;
    } catch (err) {
      console.log(err);
    }
  });

export const volunteerForSpecificOpportunity = authenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ ctx: { user }, input }) => {
    try {
      await database
        .insert(listingsToUsers)
        .values({ volunteerId: user.id, listingId: input });
    } catch (err) {
      console.log(err);
    }
  });

export const deleteIndividualListing = authenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ ctx: { user }, input }) => {
    revalidateListingPaths();
    revalidatePath("/explore");
    const validListing = await database
      .select()
      .from(listings)
      .innerJoin(organizations, eq(organizations.id, listings.organizationId))
      .innerJoin(
        users,
        and(eq(organizations.creator, users.id), eq(users.id, user.id))
      );

    if (!validListing) {
      return;
    } else {
      try {
        deleteImage(validListing[0].listings.thumbnail!.substring(-40));
      } catch {}
    }
    await database.delete(listings).where(eq(listings.id, input));
  });

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
