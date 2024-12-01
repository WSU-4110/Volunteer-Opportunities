import {
  getAllSkills,
  getListings,
  getListingsWithOffset,
  getNumberOfPagesOfListings,
  getUser,
} from "./actions";

import Userpage from "./(components)/Userpage";

const limit = 2;

export default async function Explore({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const [listings, listingsError] = await getListingsWithOffset({
    limit: 2,
    offset: limit * parseInt(searchParams?.page || "0"),
  });
  const [skills, skillsError] = await getAllSkills();
  const [userId, getUserError] = await getUser();
  const [numberOfPages, getNumberOfPages] = await getNumberOfPagesOfListings({
    limit: limit,
  });

  return (
    <>
      <Userpage
        initialListings={listings}
        skills={!skills ? [] : skills}
        userId={userId ? userId : ""}
        currentPage={parseInt(searchParams?.page || "0")}
        numberOfPages={numberOfPages || 0}
      />
    </>
  );
}
