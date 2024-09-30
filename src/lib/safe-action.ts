import { auth } from "@/auth";
import { database } from "@/database";
import { createServerActionProcedure } from "zsa";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { AUTHENTICATION_ERROR_MESSAGE, CustomError } from "@/util";

function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof CustomError;
  if (isAllowedError) {
    console.error(err);
    return {
      code: err.statusCode ?? "ERROR",
      message: err.message,
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

    if (!userInfo?.user) {
      throw new CustomError(AUTHENTICATION_ERROR_MESSAGE, 401);
    }

    const user = await database.query.users.findFirst({
      where: eq(users.id, userInfo?.user.id || ""),
    });

    if (!user) {
      throw new CustomError(AUTHENTICATION_ERROR_MESSAGE, 404);
    }
    return { user };
  });

export const unauthenticatedAction =
  createServerActionProcedure().experimental_shapeError(shapeErrors);
