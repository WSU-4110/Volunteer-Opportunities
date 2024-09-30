import { useEffect, useState } from "react";
import getListings, { getListingsBySkill } from "./actions";

import Listing from "./(components)/Listing";

export default async function Explore() {
  const listings = await getListings();
  return (
    <>
      {listings.map((item) => (
        <Listing
          image={
            <img src={item.thumbnail == null ? undefined : item.thumbnail} />
          }
          title={item.name}
          description={item.description}
          talents={["WIP"]}
        />
      ))}
    </>
  );
}
