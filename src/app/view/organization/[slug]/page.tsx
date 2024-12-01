import { getOrganizationById } from "./actions";
import ViewerPageClient from "./organizationViewer";

const ViewerPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  let [organizations, error] = await getOrganizationById(slug);

  return <ViewerPageClient organizations={organizations} />;
};

export default ViewerPage;