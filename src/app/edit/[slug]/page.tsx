import {
  getAllSkills,
  getIndividualListing,
  getListingOrganizations,
} from "./actions";
import EditListing from "./EditListing";

const Edit = async ({ params }: { params: { slug: string } }) => {
  const listingID = params.slug;

  const [listing, listingError] = await getIndividualListing(listingID);
  const [organizations, getOrganizationError] = await getListingOrganizations();

  const [allSkills, getAllSkillsError] = await getAllSkills();

  return (
    <>
      {listing ? (
        <EditListing
          listing={listing}
          organizations={organizations || []}
          allSkills={allSkills && allSkills.length > 0 ? allSkills : []}
        />
      ) : (
        <h1 className="mt-20 text-center text-2xl font-bold">
          You do not own this listing and don't have the ability to edit it.
        </h1>
      )}
    </>
  );
};

export default Edit;
