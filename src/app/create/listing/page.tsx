import { getOrganizationsForUser } from "./actions";
import CreateListing from "./CreateListingClient";

const CreateListingPage = async () => {
  const [organizationsForUser, error] = await getOrganizationsForUser();
  return <CreateListing organizations={organizationsForUser}></CreateListing>;
};

export default CreateListingPage;
