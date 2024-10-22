"use server";
import {
  users,
  skills,
  skillsToUsers,
  organizations,
  listings,
} from "@/database/schema";
import { and, eq, inArray, notExists, notInArray } from "drizzle-orm";

import { database } from "@/database/index";
import { authenticatedAction } from "@/lib/safe-action";
import { unauthenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

import { custom, z } from "zod";
import { redirect } from "next/navigation";
import { timeStamp } from "console";

import { putImage, rePutImage } from "@/database/sthree";

// Select Statements for User Profile
// Convert to internal fumctions

export const userData = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    if (user != undefined) {
      return internalUserData(user.id);
    } else {
      return null;
    }
  });

async function internalUserData(id: string) {
  const data = await database
    .select({
      name: users.name,
      image: users.image,
      bio: users.bio,
      customFile: users.customFile,
      userImage: users.userImage,
    })
    .from(users)
    .where(eq(users.id, id));

  return data;
}

export const userSkills = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    if (user != undefined) {
      return internalUserSkills(user.id);
    } else {
      return null;
    }
  });

async function internalUserSkills(id: string) {
  const data = await database
    .select({
      skillId: skillsToUsers.skillId,
      skillName: skills.name,
      url: skills.iconUrl,
    })
    .from(skillsToUsers)
    .innerJoin(skills, eq(skills.id, skillsToUsers.skillId))
    .where(eq(skillsToUsers.volunteerId, id));

  return data;
}

export const getSkills = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    if (user != undefined) {
      return internalGetSkills(user.id);
    } else {
      return null;
    }
  });

async function internalGetSkills(id: string) {
  const userSkills = database
    .select({
      data: skillsToUsers.skillId,
    })
    .from(skillsToUsers)
    .where(eq(skillsToUsers.volunteerId, id));

  const data = await database
    .select({
      skillId: skills.id,
      skillName: skills.name,
    })
    .from(skills)
    .where(notInArray(skills.id, userSkills));

  return data;
}

// Update and delete Statements for UserProfile
// Will add returns latter not sure what to do with them.

export const deleteUserSkill = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      skill: z.array(z.string()),
    })
  )
  .handler(async ({ ctx: { user }, input: { skill } }) => {
    if (user != undefined) {
      return internalDeleteUserSkill(skill, user.id);
    }
  });

async function internalDeleteUserSkill(deleteUserSkills: string[], id: string) {
  await database
    .delete(skillsToUsers)
    .where(
      and(
        eq(skillsToUsers.volunteerId, id),
        inArray(skillsToUsers.skillId, deleteUserSkills)
      )
    );
}

export const addUserSkill = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      skill: z.array(z.string()),
    })
  )
  .handler(async ({ ctx: { user }, input: { skill } }) => {
    if (user != undefined) {
      return internalAddUserSkill(user.id, skill);
    }
  });

async function internalAddUserSkill(id: string, skills: string[]) {
  await database.insert(skillsToUsers).values(
    skills.map((skill) => {
      return { skillId: skill, volunteerId: id };
    })
  );
}

export const updateUser = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      picture: z.string(),
      username: z.string(),
      bio: z.string(),
      data: z.any(),
      image: z.any(),
    })
  )
  .handler(
    async ({
      ctx: { user },
      input: { picture, username, bio, image, data },
    }) => {
      if (user != undefined) {
        return internalUpdateUser(picture, username, bio, user.id, image, data);
      }
    }
  );

async function internalUpdateUser(
  picture: string,
  username: string,
  bio: string,
  id: string,
  userImage: any,
  data: any
) {
  let image = picture;
  let customImage = true;
  if (userImage.id != "" && userImage.id != undefined) {
    userImage.id = await rePutImage(data.get(data), userImage.id);
  } else {
    userImage.id = await putImage(data.get(data));
    if (userImage.id == "") {
      //If put image fails and does not return a key
      customImage = false;
    }
  }
  await database
    .update(users)
    .set({
      name: username,
      image: image,
      bio: bio,
      customFile: customImage,
      userImage: { id: "Stuff" },
    })
    .where(eq(users.id, id));
}

//Organization database calls

export const getOrganizations = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    if (user != undefined) {
      return await database
        .select({
          id: organizations.id,
          name: organizations.name,
          image: organizations.thumbnail,
        })
        .from(organizations)
        .where(eq(organizations.creator, user.id));
    } else return null;
  });

export const getListings = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      orgID: z.string(),
    })
  )
  .handler(async ({ ctx: { user }, input: { orgID } }) => {
    if (user != undefined) {
      return await database
        .select({
          organizationId: listings.organizationId,
          id: listings.id,

          name: listings.name,
          description: listings.description,
          thumbnail: listings.thumbnail,
        })
        .from(listings)
        .where(eq(listings.organizationId, orgID));
    }
  });

export const updateOrganization = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      picture: z.string(),
      name: z.string(),
      id: z.string(),
      data: z.any(),
    })
  )
  .handler(async ({ ctx: { user }, input: { picture, name, id, data } }) => {
    if (user != undefined) {
      return internalUpdateOrg(picture, name, id, user.id, data);
    }
  });

async function internalUpdateOrg(
  picture: string,
  name: string,
  id: string,
  userID: string,
  data: any
) {
  //console.log(name);
  let image = picture;
  //Either overwrites current image or adds a new image

  if (picture != "") {
    image = await rePutImage(data.get("data"), image);
  } else {
    image = await putImage(data.get("data"));
  }

  await database
    .update(organizations)
    .set({ name: name, thumbnail: { storageId: image } })
    .where(eq(organizations.id, id));
}

export const addOrganization = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      picture: z.string(),
      name: z.string(),
      data: z.any(),
    })
  )
  .handler(async ({ ctx: { user }, input: { picture, name, data } }) => {
    if (user != undefined) {
      const image = await putImage(data.get("data"));
      return await database.insert(organizations).values({
        name: name,
        thumbnail: { storageId: image },
        creator: user.id,
      });
    }
  });

export const revalidatePathAction = () => {
  revalidatePath("/profile/form");
};
