"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { listings, organizations, skillsToListings } from "@/database/schema";
import { database } from "@/database";
import { eq } from "drizzle-orm";
import { getImage, putImage } from "@/database/sthree";
import {
  revalidateOrganizationViewerPage,
  revalidatePathAction,
} from "@/app/profile/view/actions";

export const createListingAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string(),
      organizationId: z.string(),
      description: z.string(),
      thumbnail: z.any().nullable(),
      skills: z.array(z.string()),
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      address: z.string(),
    })
  )
  .handler(async ({ input: { thumbnail, skills, coordinates, ...rest } }) => {
    try {
      let listing;
      if (thumbnail) {
        console.log("ran with picture");
        const image = await putImage(thumbnail.get("data"));
        const url = await getImage(image);

        listing = await database
          .insert(listings)
          .values({
            ...rest,
            thumbnail: url,
            latitude: coordinates.latitude as any,
            longitude: coordinates.longitude as any,
          });
      } else {
        listing = await database
          .insert(listings)
          .values({
            ...rest,
            thumbnail:
              "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
            latitude: coordinates.latitude as any,
            longitude: coordinates.longitude as any,
          })
          .returning();
      }

      if (skills.length > 0) {
        await database.insert(skillsToListings).values([
          ...skills.map((addSkill) => {
            return { listingId: listing[0].id, skillId: addSkill };
          }),
        ]);
      }
      revalidatePathAction();
      revalidateOrganizationViewerPage(listing[0].organizationId);
    } catch (err) {
      console.log(err);
    }
  });

export const getOrganizationsForUser = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: user }) => {
    const organizationsForUser = await database.query.organizations.findMany({
      where: eq(organizations.creator, user.user.id),
    });

    return organizationsForUser;
  });
