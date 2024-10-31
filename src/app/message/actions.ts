"use server";

import { database } from "@/database";
import { authenticatedAction } from "@/lib/safe-action";
import { and, eq, inArray, not, sql } from "drizzle-orm";
import {
  conversations,
  conversationsRelations,
  conversationsToUsers,
  messages,
  organizations,
  skills,
  skillsToUsers,
  users,
} from "@/database/schema";
import { z } from "zod";
import { CustomError } from "@/util";

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
    //console.log("otherVolunteers");
    //console.log(otherVolunteers);
    return otherVolunteers;
  });

export const getOtherOrganizationsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const otherOrganizations = await database.query.organizations.findMany({
      where: not(eq(organizations.creator, user.id)),
    });
    //console.log("otherOrganizations");
    //console.log(otherOrganizations);

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
      try {
        const organization = await database.query.organizations.findFirst({
          where: and(
            eq(organizations.creator, user.id),
            eq(organizations.id, senderId)
          ),
        });

        if (!organization) {
          throw new CustomError(
            "You aren't the creator of this organization. Please login as the account that created this organization in order to send a message.",
            401
          );
        }
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
      } catch (err) {
        console.log(err);
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
      try {
        const organization = await database.query.organizations.findFirst({
          where: and(
            eq(organizations.creator, user.id),
            eq(organizations.id, senderId)
          ),
        });

        if (!organization) {
          throw new CustomError(
            "You aren't the creator of this organization. Please login as the account that created this organization in order to send a message.",
            401
          );
        }
      } catch (err) {
        console.log(err);
      }
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

// I used ChatGPT to help me generate the sql queries for these two functions. I used a variety of prompts revolving around how to join the tables together, and how to group the join by conversation.

export const getOrganizationMessages = authenticatedAction
  .createServerAction()
  .input(z.object({ organizationId: z.string() }))
  .handler(async ({ ctx: { user }, input: { organizationId } }) => {
    const organization = await database.query.organizations.findFirst({
      where: and(
        eq(organizations.creator, user.id),
        eq(organizations.id, organizationId)
      ),
    });

    if (!organization) {
      throw new CustomError(
        "You aren't the creator of this organization. Please login as the account that created this organization in order to send a message.",
        401
      );
    }
    try {
      const organizationConversationIDs = await database
        .select({
          conversationId: conversations.id,
          conversations_to_users: sql`array_agg(conversations_to_users.id)`, // Aggregate user IDs into an array
        })
        .from(conversations)
        .innerJoin(
          conversationsToUsers,
          eq(conversationsToUsers.conversationId, conversations.id)
        )
        .where(eq(conversationsToUsers.organizationId, organizationId))
        .groupBy(conversations.id);

      const organizationConversations = await database
        .select({
          users: sql`COALESCE(
            (SELECT json_agg(u) 
             FROM (
               SELECT DISTINCT ON (u.id) 
               u.id, u.name, u.email, u.image, u."customUserImage", u."customImage"
               FROM "user" AS u
               JOIN conversations_to_users AS ctu ON ctu."userId" = u.id
               WHERE ctu."conversationId" = conversations.id
             ) AS u), '[]'::json) AS users`,
          organizations: sql`COALESCE(
            (SELECT json_agg(o)
             FROM (
               SELECT DISTINCT ON (o.id) 
               o.id, o.name, o.thumbnail
               FROM organizations AS o
               JOIN conversations_to_users AS ctu ON ctu."organizationId" = o.id
               WHERE ctu."conversationId" = conversations.id
             ) AS o), '[]'::json) AS organizations`,
          messages: sql`COALESCE(
              (SELECT json_agg(m)
               FROM (
                 SELECT 
                   m.id, 
                   m.content, 
                   m."createdAt", 
                   m.sender_user_id, 
                   m.sender_organization_id, 
                   m."messageType",
                   CASE 
                     WHEN m.sender_user_id IS NOT NULL 
                     THEN (SELECT u.image FROM "user" AS u WHERE u.id = m.sender_user_id) 
                     ELSE NULL 
                   END AS "userImage",
                   CASE 
                     WHEN m.sender_organization_id IS NOT NULL 
                     THEN (SELECT o.thumbnail FROM organizations AS o WHERE o.id = m.sender_organization_id) 
                     ELSE NULL 
                   END AS "organizationImage"
                 FROM messages AS m
                 WHERE m.conversation_id = conversations.id
                 ORDER BY m."createdAt" ASC, m.id ASC
               ) AS m), '[]'::json) AS messages`,
          conversations,
        })
        .from(conversations)
        .where(
          inArray(
            conversations.id,
            organizationConversationIDs.map((c) => c.conversationId)
          )
        )
        .leftJoin(
          conversationsToUsers,
          eq(conversationsToUsers.conversationId, conversations.id)
        )
        .leftJoin(users, eq(conversationsToUsers.userId, users.id))
        .leftJoin(
          organizations,
          eq(conversationsToUsers.organizationId, organizations.id)
        )
        .groupBy(conversations.id)
        .execute();

      //console.log(organizationConversations);

      return organizationConversations;
    } catch (err) {
      console.log(err);
    }
  });

export const getVolunteerMessages = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    try {
      const userConversationIDs = await database
        .select({
          conversationId: conversations.id,
        })
        .from(conversations)
        .innerJoin(
          conversationsToUsers,
          eq(conversationsToUsers.conversationId, conversations.id)
        )
        .where(eq(conversationsToUsers.userId, user.id))
        .groupBy(conversations.id);

      const userConversations = await database
        .select({
          users: sql`COALESCE(
            (SELECT json_agg(u) 
             FROM (
               SELECT DISTINCT ON (u.id) 
               u.id, u.name, u.email, u.image, u.bio, u."customUserImage", u."customImage"
               FROM "user" AS u
               JOIN conversations_to_users AS ctu ON ctu."userId" = u.id
               WHERE ctu."conversationId" = conversations.id
             ) AS u), '[]'::json) AS users`,
          organizations: sql`COALESCE(
            (SELECT json_agg(o)
             FROM (
               SELECT DISTINCT ON (o.id) 
               o.id, o.name, o.thumbnail
               FROM organizations AS o
               JOIN conversations_to_users AS ctu ON ctu."organizationId" = o.id
               WHERE ctu."conversationId" = conversations.id
             ) AS o), '[]'::json) AS organizations`,
          messages: sql`COALESCE(
              (SELECT json_agg(m)
               FROM (
                 SELECT 
                   m.id, 
                   m.content, 
                   m."createdAt", 
                   m.sender_user_id, 
                   m.sender_organization_id, 
                   m."messageType",
                   CASE 
                     WHEN m.sender_user_id IS NOT NULL 
                     THEN (SELECT u.image FROM "user" AS u WHERE u.id = m.sender_user_id) 
                     ELSE NULL 
                   END AS "userImage",
                   CASE 
                     WHEN m.sender_organization_id IS NOT NULL 
                     THEN (SELECT o.thumbnail FROM organizations AS o WHERE o.id = m.sender_organization_id) 
                     ELSE NULL 
                   END AS "organizationImage"
                 FROM messages AS m
                 WHERE m.conversation_id = conversations.id
                 ORDER BY m."createdAt" ASC, m.id ASC
               ) AS m), '[]'::json) AS messages`,
          conversations,
        })
        .from(conversations)
        .where(
          inArray(
            conversations.id,
            userConversationIDs.map((c) => c.conversationId)
          )
        )
        .leftJoin(
          conversationsToUsers,
          eq(conversationsToUsers.conversationId, conversations.id)
        )
        .leftJoin(users, eq(conversationsToUsers.userId, users.id))
        .leftJoin(
          organizations,
          eq(conversationsToUsers.organizationId, organizations.id)
        )
        .groupBy(conversations.id)
        .execute();
      //console.log("userConversations");
      //console.log(userConversations);
      return userConversations;
    } catch (err) {
      console.log(err);
    }
  });
export const createMessage = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      content: z.string(),
      senderUserId: z.string().nullable(),
      conversationId: z.string(),
      senderOrganizationId: z.string().nullable(),
    })
  )
  .handler(
    async ({
      ctx: { user },
      input: { content, senderUserId, conversationId, senderOrganizationId },
    }) => {
      try {
        const newMessage = await database
          .insert(messages)
          .values({
            content: content,
            senderId: senderUserId || null,
            conversationId: conversationId,
            senderOrganizationId: senderOrganizationId || null,
            messageType: 0,
          })
          .returning();

        return newMessage;
      } catch (err) {
        console.log(err);
      }
    }
  );
