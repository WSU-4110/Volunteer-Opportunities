import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authenticatedAction } from "./safe-action";
import { z } from "zod";
import { database } from "@/database/index";
import { organizations, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { CustomError } from "@/util";

export const uploadFileToDatabaseForOrganization = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      filesToUpload: z.array(z.object({ id: z.string(), file: z.any() })),
      filesToDelete: z.array(z.object({ id: z.string(), file: z.any() })),
      organizationId: z.string(),
    })
  )
  .handler(
    async ({
      ctx: { user },
      input: { filesToUpload, filesToDelete, organizationId },
    }) => {
      const organization = await database.query.organizations.findFirst({
        where: and(
          eq(organizations.creator, user?.id),
          eq(organizations.id, organizationId)
        ),
      });

      if (!organization) {
        throw new CustomError(
          "We couldn't find this organization. Please ensure that you own this organization and that it exists before uploading files for it.",
          404
        );
      }

      const potentialDeleteFiles = organization.images;

      const generateUploadUrl = useMutation(
        api.mutations.generateUploadUrlFunc
      );

      const deleteFileMutation = useMutation(api.mutations.deleteById);

      const listOfAddedStorageIds = [];

      for (let item of filesToUpload) {
        const { id, file } = item;
        const postUrl = await generateUploadUrl();

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file!.type },
          body: file,
        });

        const { storageId } = await result.json();

        listOfAddedStorageIds.push({ id, storageId });
      }

      await database
        .update(organizations)
        .set({ images: listOfAddedStorageIds })
        .where(eq(organizations.id, organizationId));

      for (let file of potentialDeleteFiles as any) {
        for (let fileDeletion of filesToDelete) {
          if (fileDeletion.id == file.id) {
            deleteFileMutation({ storageId: file.storageId });
          }
        }
      }
    }
  );

export const uploadFileToDatabaseForUser = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      fileToUpload: z.object({ id: z.string(), file: z.any() }),
      organizationId: z.string(),
    })
  )
  .handler(
    async ({ ctx: { user }, input: { fileToUpload, organizationId } }) => {
      const organization = await database.query.organizations.findFirst({
        where: and(
          eq(organizations.creator, user?.id),
          eq(organizations.id, organizationId)
        ),
      });

      if (!organization) {
        throw new CustomError(
          "We couldn't find this organization. Please ensure that you own this organization and that it exists before uploading files for it.",
          404
        );
      }

      const generateUploadUrl = useMutation(
        api.mutations.generateUploadUrlFunc
      );

      const { id, file } = fileToUpload;
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file!.type },
        body: file,
      });

      const { storageId } = await result.json();

      const listOfAddedStorageIds = { id, storageId };

      await database
        .update(users)
        .set({ userImage: listOfAddedStorageIds })
        .where(eq(users.id, user.id));

      const deleteFileMutation = useMutation(api.mutations.deleteById);

      if (user.customFile) {
        deleteFileMutation({
          storageId: (user as any).userImage.storageId,
        });
      }
    }
  );
