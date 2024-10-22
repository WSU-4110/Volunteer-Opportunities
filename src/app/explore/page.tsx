import { useEffect, useState } from "react";
import {
  getListings,
  getSkills,
  getListingsBySkill,
  getListingsSearchTitle,
} from "./actions";

import Listing from "./(components)/Listing";
import Userpage from "./(components)/Userpage";

import ListingInterface from "./(components)/Userpage";

export default async function Explore() {
  const listings = await getListings();

  const listingsWithTalents = await Promise.all(
    listings.map(async (item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        thumbnail: item.thumbnail == null ? "" : item.thumbnail,
        organizationID: item.organizationId,
        talents: await getSkills(item.id),
      };
    })
  );

  return (
    <>
      <Userpage listings={listingsWithTalents} />
    </>
  );
}
