"use server";
// Will Delete pg if it is not used not sure if I will need it at some point
import { eq, notExists, notInArray } from "drizzle-orm";
import { users, skills, skillsToUsers } from "@/database/schema";
import { database, pg } from "@/database/index";

// Select Statements for User Profile

export async function userData(id: string) {
  const data = await database
    .select({ field1: users.name, field2: users.image, field3: users.bio })
    .from(users)
    .where(eq(users.id, id));

  return data;
}

export async function userSkills(id: string) {
  const data = await database
    .select({
      field1: skillsToUsers.skillId,
      field2: skills.name,
      field3: skills.iconUrl,
    })
    .from(skillsToUsers)
    .innerJoin(skills, eq(skills.id, skillsToUsers.skillId))
    .where(eq(skillsToUsers.volunteerId, id));

  return data;
}

export async function getSkills(id: any) {
  const userSkills = database
    .select({
      data: skillsToUsers.skillId,
    })
    .from(skillsToUsers)
    .where(eq(skillsToUsers.volunteerId, id));

  const data = await database
    .select({
      field1: skills.id,
      field2: skills.name,
    })
    .from(skills)
    .where(notInArray(skills.id, userSkills));

  return data;
}

// Update and delete Statements for UserProfile
// Will add returns latter not sure what to do with them.

export async function deleteUserSkill(id: string, skill: string) {
  await database
    .delete(skillsToUsers)
    .where(
      eq(skillsToUsers.volunteerId, id) && eq(skillsToUsers.skillId, skill)
    );
}

export async function addUserSkill(id: string, skill: string) {
  await database
    .insert(skillsToUsers)
    .values({ skillId: skill, volunteerId: id });
}

export async function updateUser(
  id: string,
  picture: string,
  username: string,
  bio: string
) {
  await database
    .update(users)
    .set({ name: username, image: picture, bio: bio })
    .where(eq(users.id, id));
}
