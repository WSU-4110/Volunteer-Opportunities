// Methods to update user images with authenicated action
"use server";
import { users, organizations } from "@/database/schema";
import { eq } from "drizzle-orm";

import { database } from "@/database/index";
import { authenticatedAction } from "@/lib/safe-action";

import { custom, z } from "zod";

import { getImage, putImage, rePutImage } from "@/database/sthree";

export const organizationImage = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      picture: z.string(),
      id: z.string(),
      date: z.string(),
    })
  )
  .handler(async ({ ctx: { user }, input: { picture, id, date } }) => {
    if (user != undefined) {
      return internalUpdateOrg(picture, id, date);
    }
  });

async function internalUpdateOrg(picture: string, id: string, date: string) {
  //console.log(name);
  let image = picture;
  //Either overwrites current image or adds a new image
  // Get new URL and timestamp

  await database
    .update(organizations)
    .set({ thumbnail: { storageId: picture, key: image, date: date } })
    .where(eq(organizations.id, id));
}

export const userImage = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      picture: z.string(),
      id: z.string(),
      image: z.any(),
    })
  )
  .handler(async ({ ctx: { user }, input: { picture, id, image } }) => {
    //console.log(data.get("data"));
    if (user != undefined) {
      return internalUpdateUser(picture, id, image);
    }
  });

async function internalUpdateUser(picture: string, id: string, userImage: any) {
  let customImage = true;
  //console.log("UserID");
  //console.log(userImage);
  try {
    //console.log(data);

    picture = await getImage(userImage);
    // Time stamp for the url in the bucket
    const now = new Date().toISOString();

    await database
      .update(users)
      .set({
        image: picture,
        userImage: { id: userImage, date: now },
      })
      .where(eq(users.id, id));
    //console.log("success");
  } catch (caught) {}
}
