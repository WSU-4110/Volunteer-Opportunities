"use server";

import { database } from "@/database";
import { authenticatedAction } from "@/lib/safe-action";
import { eq, not } from "drizzle-orm";
import {
  conversations,
  conversationsRelations,
  conversationsToUsers,
  organizations,
  skills,
  skillsToUsers,
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

export const getUserOrganizations = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const userOrganizations = await database.query.organizations.findMany({
      where: eq(organizations.creator, user.id),
    });

    return userOrganizations;
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
      const conversation = await database
        .insert(conversations)
        .values({
          subject: subject,
        })
        .returning();

      for (let returnedConversation of conversation) {
        await database.insert(conversationsToUsers).values([
          {
            conversationId: returnedConversation.id,
            userId: senderId,
            organizationId: null,
          },
          {
            conversationId: returnedConversation.id,
            userId: receiverId,
            organizationId: null,
          },
        ]);
      }
    }
  );

export const startNewUserToOrgConversation = authenticatedAction
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
      const conversation = await database
        .insert(conversations)
        .values({
          subject: subject,
        })
        .returning();

      for (let returnedConversation of conversation) {
        await database.insert(conversationsToUsers).values([
          {
            conversationId: returnedConversation.id,
            userId: senderId,
            organizationId: null,
          },
          {
            conversationId: returnedConversation.id,
            userId: null,
            organizationId: receiverId,
          },
        ]);
      }
    }
  );

export const startNewOrgToUserConversation = authenticatedAction
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
      const conversation = await database
        .insert(conversations)
        .values({
          subject: subject,
        })
        .returning();

      for (let returnedConversation of conversation) {
        await database.insert(conversationsToUsers).values([
          {
            conversationId: returnedConversation.id,
            userId: null,
            organizationId: senderId,
          },
          {
            conversationId: returnedConversation.id,
            userId: receiverId,
            organizationId: null,
          },
        ]);
      }
    }
  );

export const startNewOrgToOrgConversation = authenticatedAction
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
      const conversation = await database
        .insert(conversations)
        .values({
          subject: subject,
        })
        .returning();

      for (let returnedConversation of conversation) {
        try {
          await database.insert(conversationsToUsers).values([
            {
              conversationId: returnedConversation.id,
              userId: null,
              organizationId: senderId,
            },
            {
              conversationId: returnedConversation.id,
              userId: null,
              organizationId: receiverId,
            },
          ]);
        } catch (err) {
          console.log(err);
        }
      }
    }
  );
