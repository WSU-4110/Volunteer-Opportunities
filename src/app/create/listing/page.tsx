import { getAllSkills } from "@/app/explore/actions";
import { getOrganizationsForUser } from "./actions";
import CreateListing from "./CreateListingClient";

const CreateListingPage = async () => {
  const [organizationsForUser, error] = await getOrganizationsForUser();

  const [allSkills, getAllSkillsError] = await getAllSkills();
  return (
    <CreateListing
      organizations={organizationsForUser}
      allSkills={allSkills ? allSkills : []}
    ></CreateListing>
  );
};

export default CreateListingPage;
