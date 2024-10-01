import { useEffect, useState } from "react";
import { getListings, getSkills, getListingsBySkill } from "./actions";

import Listing from "./(components)/Listing";

export default async function Explore() {
  const listings = await getListings();
  const skills = await getSkills();

  return (
    <>
      {listings.map((item) => (
        <Listing
          imageURL={item.thumbnail == null ? "" : item.thumbnail}
          title={item.name}
          description={item.description}
          talents={skills}
        />
      ))}
    </>
  );
}