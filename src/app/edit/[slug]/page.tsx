import { getSkills } from "@/app/explore/actions";
import { getListingFromID } from "./actions";
import EditListing from "./EditListing";

import { getReactNodeFromListings } from "@/app/explore/(components)/Userpage";

export const Edit = async ({ params }: { params: { slug: string } }) => {
  const listingID = params.slug;

  const listing = (await getListingFromID(listingID))[0];

  if (listing == null) {
    return;
  }

  const talents = await getSkills(listingID);

  return (
    <>
      <EditListing listing={listing} talents={talents} />
    </>
  );
};

export default Edit;
