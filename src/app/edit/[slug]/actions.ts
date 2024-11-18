"use server";

import { database } from "@/database/index";

import {
  skills,
  listings,
  skillsToListings,
  listingsToUsers,
  organizations,
  users,
} from "@/database/schema";
import Listing from "@/app/explore/(components)/Listing";

import { z } from "zod";
import { eq, sql, inArray, and } from "drizzle-orm";
import { list } from "postcss";
import { PgColumn } from "drizzle-orm/pg-core";
import { revalidatePath } from "next/cache";
import { authenticatedAction, unauthenticatedAction } from "@/lib/safe-action";
import { getImage, putImage } from "@/database/sthree";

export const getAllSkills = unauthenticatedAction
  .createServerAction()
  .handler(async () => {
    return await database.query.skills.findMany();
  });

export const getListingOrganizations = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    try {
      return await database.query.organizations.findMany({
        where: eq(organizations.creator, user.id),
      });
    } catch (err) {
      console.log(err);
    }
  });

export const updateListing = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      listingID: z.string(),
      name: z.string(),
      description: z.string(),
      organizationId: z.string(),
      address: z.string(),
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      skills: z.array(z.string()),
      data: z.any().nullable(),
    })
  )
  .handler(
    async ({
      ctx: { user },
      input: {
        listingID,
        name,
        description,
        organizationId,
        address,
        coordinates,
        skills,
        data,
      },
    }) => {
      try {
        const validListing = await database
          .select({ listings })
          .from(listings)
          .innerJoin(
            organizations,
            eq(organizations.id, listings.organizationId)
          )
          .innerJoin(
            users,
            and(eq(users.id, organizations.creator), eq(users.id, user.id))
          )
          .where(eq(listings.id, listingID));

        if (validListing.length == 0) {
          return;
        }
        if (data) {
          const image = await putImage(data.get("data"));
          const url = await getImage(image);
          await database
            .update(listings)
            .set({
              name: name,
              description: description,
              organizationId: organizationId,
              latitude: coordinates.latitude as any,
              longitude: coordinates.longitude as any,
              address: address,
              thumbnail: url,
            })
            .where(eq(listings.id, listingID));
        } else {
          await database
            .update(listings)
            .set({
              name: name,
              description: description,
              organizationId: organizationId,
              latitude: coordinates.latitude as any,
              longitude: coordinates.longitude as any,
              address: address,
            })
            .where(eq(listings.id, listingID));
        }

        await database
          .delete(skillsToListings)
          .where(eq(skillsToListings.listingId, listingID));

        if (skills.length > 0) {
          await database.insert(skillsToListings).values([
            ...skills.map((addSkill) => {
              return { listingId: listingID, skillId: addSkill };
            }),
          ]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  );

export const getIndividualListing = authenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ ctx: { user }, input }) => {
    try {
      const validListing = await database
        .select({ listings })
        .from(listings)
        .innerJoin(organizations, eq(organizations.id, listings.organizationId))
        .innerJoin(
          users,
          and(eq(users.id, organizations.creator), eq(users.id, user.id))
        )
        .where(eq(listings.id, input));

      if (validListing.length > 0) {
        return await database.query.listings.findFirst({
          where: eq(listings.id, input),
          with: { skills: { with: { skills: true } } },
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

export const revalidateListingPaths = () => {
  revalidatePath("/message");
  revalidatePath("/explore");
  revalidatePath("/profile/view");
};
