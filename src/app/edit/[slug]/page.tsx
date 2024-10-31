import { getSkills } from "@/app/explore/actions";
import { getListingFromID } from "./actions";
import EditListing from "./EditListing";

import Listing from "@/components/Listing";

export const Edit = async ({ params }: { params: { slug: string } }) => {
  const listingID = params.slug;

  const listing = (await getListingFromID(listingID))[0];

  if (listing == null) {
    return;
  }

  const talents = await getSkills(listingID);

  return (
    <>
      <Listing
        id={listing.id}
        name={listing.name}
        description={listing.description}
        thumbnail={listing.thumbnail == null ? "" : listing.thumbnail}
        organizationID={listing.organizationId}
        talents={talents}
      />

      <EditListing listing={listing} talents={talents} />
    </>
  );
};

export default Edit;
