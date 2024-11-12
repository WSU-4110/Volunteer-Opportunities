"use server"

import { database } from "@/database/index";

import { skills, listings, skillsToListings } from "@/database/schema";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function revalidateListing(listing_id : string) {
  revalidatePath("/explore");
  revalidatePath("/edit" + listing_id);
}

export async function getListings() {
    return await database.select().from(listings);
  }

  export async function getListingFromID(listingID: string) {
    return await database.select().from(listings).where(eq(listings.id, listingID))
  }

  export async function addTalentToListing(listingID: string, skillID: string) {
    await database.insert(skillsToListings).values({skillId: skillID, listingId: listingID})
  }

  export async function getTalentID(talent: string) {
    const talentID = (await database.select({id: skills.id}).from(skills).where(eq(skills.name, talent)))[0]

    if (talentID == null) {
        return
    }

    return talentID.id
  }

  export async function insertTalent(listingID: string, talent: string) {
    const talentID = await getTalentID(talent)

    if (talentID == null) {
        return
    }

    console.log(await database.select().from(skillsToListings).where(eq(skillsToListings.listingId, listingID)))
    const talentExists = (await database.select().from(skillsToListings).where(and(eq(skillsToListings.skillId, talentID), eq(skillsToListings.listingId, listingID)))).length > 0

    if (talentExists) {
      await database.delete(skillsToListings).where(and(eq(skillsToListings.skillId, talentID), eq(skillsToListings.listingId, listingID)))
    }
    else {
      await database.insert(skillsToListings).values({skillId: talentID, listingId: listingID})
    }
  }

  export async function updateListing(listingID: string, name: string, description: string, thumbnail: string, organizationID: string) {
    await database.update(listings).set({name: name, description: description, thumbnail: thumbnail, organizationId: organizationID}).where(eq(listings.id, listingID))
  }

  export async function updateListingWithTalent(listingID: string, name: string, description: string, thumbnail: string, organizationID: string, talent: string) {
    await updateListing(listingID, name, description, thumbnail, organizationID)
    await insertTalent(listingID, talent)
  }