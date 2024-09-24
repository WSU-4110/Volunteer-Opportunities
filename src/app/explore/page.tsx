import { useEffect, useState } from "react";
import { getListingsBySkill } from "./actions";

import Listing from "./(components)/Listing";

export default function Explore() {
  return (
    <Listing
      image={
        <img src="https://static.vecteezy.com/system/resources/previews/024/193/043/non_2x/modern-office-building-business-center-neural-network-ai-generated-photo.jpg" />
      }
      title="Organization Inc."
      description="This is an organization looking for talent"
      talents={["Janitor", "Hardworking"]}
    />
  );
}
