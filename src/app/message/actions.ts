"use server";

import { database } from "@/database";
import { authenticatedAction } from "@/lib/safe-action";
import { eq, not } from "drizzle-orm";
import {
  organizations,
  skills,
  skillsToUsers,
  user_to_user_conversations,
  users,
} from "@/database/schema";
import { z } from "zod";

export const getOtherVolunteersAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const otherVolunteers = await database.query.users.findMany({
      where: not(eq(users.id, user.id)),
      with: {
        skills: {
          with: {
            skills: true,
          },
        },
        listings: {
          with: {
            listings: {
              with: {
                organizations: true,
              },
            },
          },
        },
      },
    });

    return otherVolunteers;
  });

export const getOtherOrganizationsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const otherOrganizations = await database.query.organizations.findMany({
      where: not(eq(organizations.creator, user.id)),
    });

    return otherOrganizations;
  });

export const startNewUserToUserConversation = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      senderId: z.string(),
      receiverId: z.string(),
      subject: z.string(),
    })
  )
  .handler(
    async ({ ctx: { user }, input: { senderId, receiverId, subject } }) => {
      await database
        .insert(user_to_user_conversations)
        .values({
          senderId: senderId,
          recipientId: receiverId,
          subject: subject,
        });
    }
  );
