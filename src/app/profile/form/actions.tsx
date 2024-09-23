"use server";
import { eq, notExists, notInArray } from "drizzle-orm";
import { users, skills, skillsToUsers } from "@/database/schema";
import { database } from "@/database/index";

import { z } from "zod";

// Select Statements for User Profile
// Convert to internal fumctions
export async function userData() {
  const data = await database
    .select({ name: users.name, image: users.image, bio: users.bio })
    .from(users)
    .where(eq(users.id, id));

  return data;
}

export async function userSkills() {
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

export async function getSkills() {
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

export async function deleteUserSkill(skill: string) {
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
  picture: string,
  username: string,
  bio: string
) {
  await database
    .update(users)
    .set({ name: username, image: picture, bio: bio })
    .where(eq(users.id, id));
}
