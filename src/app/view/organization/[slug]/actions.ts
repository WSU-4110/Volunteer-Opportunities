import { database } from "@/database/index";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { organizations, listings, listingsToUsers, users } from "@/database/schema";

export const getOrganizationById = unauthenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ input }: { input: string }) => {
    const organization = await database.query.organizations.findFirst({
      where: eq(organizations.id, input),
      with: {
        listings: {
          with: {
            volunteers: {
              with: {
                volunteers: true, 
              },
            },
          },
        },
        users: true, 
      },
    });

    if (!organization) return null;

    const volunteerData: Record<string, any> = {};
    organization.listings.forEach((listing: any) => {
      listing.volunteers.forEach((volunteer: any) => {
        const userId = volunteer.volunteers.id;

        if (!volunteerData[userId]) {
          volunteerData[userId] = {
            name: volunteer.volunteers.name,
            participatedListings: [],
          };
        }

        volunteerData[userId].participatedListings.push({
          name: listing.name,
          dateSignedUp: volunteer.dateSignedUp,
        });
      });
    });

    return {
      ...organization,
      phoneNumber: organization?.phoneNumber
        ? formatPhoneNumber(organization?.phoneNumber)
        : "No Phone Number",
      volunteers: Object.values(volunteerData), 
    };
  });
//I got this code for formatting a phone number from ChatGPT. The prompt I used was "Can you write code to display this in a normal phone number format? 12345678910"
const formatPhoneNumber = (phoneNumber: string) => {
  // Ensure the phone number is exactly 10 digits
  const cleaned = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters

  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    console.log(`(${match[1]}) ${match[2]}-${match[3]}`);
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }

  return phoneNumber; // Return the original if it doesn't match the expected format
};