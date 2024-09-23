import { PublicError } from "@/app/Errors/errors";
import { auth } from "@/auth";
import { database } from "@/database";
import { createServerActionProcedure } from "zsa";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError;
  // let's all errors pass through to the UI so debugging locally is easier
  const isDev = process.env.NODE_ENV === "development";
  if (isAllowedError || isDev) {
    console.error(err);
    return {
      code: err.code ?? "ERROR",
      message: `${!isAllowedError && isDev ? "DEV ONLY ENABLED - " : ""}${
        err.message
      }`,
    };
  } else {
    return {
      code: "ERROR",
      message: "Something went wrong",
    };
  }
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const userInfo = await auth();

    const user = await database.query.users.findFirst({
      where: eq(users.id, userInfo?.user.id || ""),
    });
    return { user };
  });

export const unauthenticatedAction =
  createServerActionProcedure().experimental_shapeError(shapeErrors);
