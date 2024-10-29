"use server"

import { database } from "@/database/index";

import { skills, listings, skillsToListings } from "@/database/schema";
import Listing from "@/app/explore/(components)/Listing";
import { ListingInterface, ListingsProps } from "@/app/explore/(components)/Userpage";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { list } from "postcss";
import { PgColumn } from "drizzle-orm/pg-core";
import { getSkills } from "@/app/explore/actions";


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

    await database.insert(skillsToListings).values({skillId: talentID, listingId: listingID})
  }

  export async function updateListing(listingID: string, name: string, description: string, thumbnail: string, organizationID: string, talent: string) {
    console.log(listingID)
    console.log(talent)
    await insertTalent(listingID, talent)
  }