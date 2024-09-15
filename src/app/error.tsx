"use client";

import { AUTHENTICATION_ERROR_MESSAGE, CustomError } from "./util";

export default function ErrorPage({
  error,
}: {
  error: CustomError & { digest?: string };
}) {
  const authenticationError = error.message == AUTHENTICATION_ERROR_MESSAGE;
  return (
    <>
      {authenticationError ? (
        <div className="flex flex-col items-center w-full justify-center mt-20 gap-10">
          <h1>
            Please login as either a volunteer or an organization to access this
            feature.
          </h1>
          <div className="flex flex-row items-center w-full gap-4 justify-center">
            <p>{error.message}</p>
            <p>{error.statusCode}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full justify-center mt-20 gap-10">
          <h1>Unfortunately something went wrong.</h1>
          <div className="flex flex-row items-center w-full gap-4 justify-center">
            <p>{error.message}</p>
            <p>{error.statusCode}</p>
          </div>
        </div>
      )}
    </>
  );
}
