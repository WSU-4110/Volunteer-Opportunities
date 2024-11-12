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

import { getImage, putImage, rePutImage } from "@/database/sthree";

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
      url: skills.iconUrl,
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
        return internalUpdateUser(
          picture,
          username,
          bio,
          user.id,
          image,
          data.get("data")
        );
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
  let customImage = true;
  try {
    if (userImage != "" && userImage != undefined) {
      userImage = await rePutImage(data, userImage);
      picture = await getImage(userImage);
    } else {
      userImage = await putImage(data);
      if (userImage == "") {
        //If put image fails and does not return a key
        customImage = false;
      } else {
        picture = await getImage(userImage);
      }
    }
    return await database
      .update(users)
      .set({
        name: username,
        image: picture,
        bio: bio,
        customFile: customImage,
        userImage: { id: userImage },
      })
      .where(eq(users.id, id))
      .returning();
  } catch (caught) {
    //If put image fails and does not return a key
    customImage = false;
    return await database
      .update(users)
      .set({
        name: username,
        image: picture,
        bio: bio,
        customFile: customImage,
        userImage: { id: "" },
      })
      .where(eq(users.id, id))
      .returning();
  }
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
          bio: organizations.bio,
          email: organizations.email,
          latitude: organizations.latitude,
          longitude: organizations.longitude,
          phoneNumber: organizations.phoneNumber,
          address: organizations.address,
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
      id: z.string(),
      name: z.string(),
      data: z.any(),
      bio: z.string(),
      phoneNumber: z.string(),
      address: z.string(),
      coordinates: z.object({
        longitude: z.number(),
        latitude: z.number(),
      }),
      email: z.string(),
    })
  )
  .handler(
    async ({
      ctx: { user },
      input: {
        picture,
        id,
        name,
        data,
        bio,
        phoneNumber,
        address,
        coordinates,
        email,
      },
    }) => {
      if (user != undefined) {
        return internalUpdateOrg(
          picture,
          id,
          user.id,
          name,
          data,
          bio,
          phoneNumber,
          address,
          coordinates,
          email
        );
      }
    }
  );

async function internalUpdateOrg(
  picture: string,
  id: string,
  userID: string,
  name: string,
  data: any,
  bio: string,
  phoneNumber: string,
  address: string,
  coordinates: any,
  email: string
) {
  let image = picture;
  //Either overwrites current image or adds a new image
  if (picture != "") {
    image = await rePutImage(data.get("data"), image);

    await database
      .update(organizations)
      .set({
        name: name || "",

        bio: bio,
        email: email,
        latitude: coordinates.latitude as any,
        longitude: coordinates.longitude as any,
        phoneNumber: phoneNumber,
        address: address,
      })
      .where(and(eq(organizations.id, id), eq(organizations.creator, userID)));
  } else {
    image = await putImage(data.get("data"));
    const url = await getImage(image);

    await database
      .update(organizations)
      .set({
        name: name || "",
        thumbnail: { storageId: url, key: image },
        bio: bio,
        email: email,
        latitude: coordinates.latitude as any,
        longitude: coordinates.longitude as any,
        phoneNumber: phoneNumber,
        address: address,
      })
      .where(and(eq(organizations.id, id), eq(organizations.creator, userID)));
  }
}

export const addOrganization = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string(),
      data: z.any(),
      bio: z.string(),
      phoneNumber: z.string(),
      address: z.string(),
      coordinates: z.object({
        longitude: z.number(),
        latitude: z.number(),
      }),
      email: z.string(),
    })
  )
  .handler(
    async ({
      ctx: { user },
      input: { name, data, bio, phoneNumber, address, coordinates, email },
    }) => {
      if (user != undefined) {
        const image = await putImage(data.get("data"));
        const url = await getImage(image);
        return await database
          .insert(organizations)
          .values({
            name: name || "",
            creator: user.id,
            thumbnail: { storageId: url, key: image },
            bio: bio,
            email: email,
            latitude: coordinates.latitude as any,
            longitude: coordinates.longitude as any,
            phoneNumber: phoneNumber,
            address: address,
          })
          .returning();
      }
    }
  );

export const revalidatePathAction = () => {
  revalidatePath("/profile/view");
  revalidatePath("/explore");
  revalidatePath("/message");
};

export const revalidateUserViewerPage = (userId: string) => {
  revalidatePath(`/view/volunteer/${userId}`);
};

export const revalidateOrganizationViewerPage = (orgId: string) => {
  revalidatePath(`/view/organization/${orgId}`);
};
