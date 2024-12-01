"use server";
import { database } from "@/database/index";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { organizations } from "@/database/schema";

export const getOrganizationById = unauthenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ input }: { input: string }) => {
    const organization = await database.query.organizations.findFirst({
      where: eq(organizations.id, input),
      with: {
        listings: true,
        users: true,
      },
    });

    return {
      ...organization,
      phoneNumber: organization?.phoneNumber
        ? formatPhoneNumber(organization?.phoneNumber)
        : "No Phone Number",
    };
  });

//I got this code for formatting a phone number from ChatGPT. The prompt I used was "Can you write code to display this in a normal phone number format? 12345678910"
export const formatPhoneNumber = (phoneNumber: string) => {
  // Ensure the phone number is exactly 10 digits
  const cleaned = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters

  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }

  return phoneNumber; // Return the original if it doesn't match the expected format
};
