import { useEffect, useState } from "react";
import { getAllSkills, getListings } from "./actions";

import Listing from "./(components)/Listing";
import Userpage from "./(components)/Userpage";

import ListingInterface from "./(components)/Userpage";

export default async function Explore() {
  const [listings, listingsError] = await getListings();
  const [skills, skillsError] = await getAllSkills();

  return (
    <>
      <Userpage initialListings={listings} skills={!skills ? [] : skills} />
    </>
  );
}
