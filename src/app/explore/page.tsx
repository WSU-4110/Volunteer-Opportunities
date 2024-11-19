import { getAllSkills, getListings, getUser } from "./actions";

import Userpage from "./(components)/Userpage";

export default async function Explore() {
  const [listings, listingsError] = await getListings();
  const [skills, skillsError] = await getAllSkills();
  const [userId, getUserError] = await getUser();

  return (
    <>
      <Userpage
        initialListings={listings}
        skills={!skills ? [] : skills}
        userId={userId ? userId : ""}
      />
    </>
  );
}
