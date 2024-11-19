import Link from "next/link";
import { getListingById } from "./actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ListingPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [listing, error] = await getListingById(slug);

  return (
    <div className="py-12 bg-slate-200 min-h-[70vh]">
      <div className="w-[90%] m-auto max-w-4xl">
        {/* Main Wrapper */}
        <div className="flex flex-col gap-12 bg-white p-12 rounded-lg shadow-lg">
          {/* Header Section */}
          <div className="relative bg-gray-100 p-6 rounded-lg shadow-md">
            {/* Listing Image */}
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={listing?.thumbnail || "/default-listing.png"}
                  alt={listing?.name || "Listing Thumbnail"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Listing Name */}
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
              {listing?.name || "Unnamed Listing"}
            </h1>

            {/* Date */}
            <p className="absolute bottom-4 right-4 text-sm text-gray-500">
              {listing?.createdAt
                ? `Created: ${new Date(listing.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}`
                : "Date not available"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {/* Description */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-left">
                  Description
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  {listing?.description || "No description available"}
                </p>
              </section>

              {/* Skills Needed */}
              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-left">
                  Skills Needed
                </h2>
                {listing?.skills && listing.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {listing.skills.map((skill) => (
                      <Badge
                        key={skill.skillId}
                        className="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white rounded-md shadow-sm"
                      >
                        {skill.skills?.name || "Unknown Skill"}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </section>
            </div>

            <div>
              {/* Organization */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-left">
                  Organization
                </h2>
                {listing?.organizations ? (
                  <Link href={`/view/organization/${listing.organizations.id}`}>
                    <Card className="flex items-center p-4 rounded-lg border shadow-md hover:shadow-lg transition-shadow w-full">
                      <img
                        src={
                          typeof listing.organizations.thumbnail === "string"
                            ? listing.organizations.thumbnail
                            : (
                                listing.organizations.thumbnail as {
                                  storageId: string;
                                }
                              )?.storageId || "/default-organization.png"
                        }
                        alt={
                          listing.organizations.name || "Organization Thumbnail"
                        }
                        className="rounded-lg w-16 h-16 object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-700">
                          {listing.organizations.name}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                ) : (
                  <p className="text-gray-500">Organization not available</p>
                )}
              </section>
            </div>
          </div>
          <div className="w-full">
            {/* Volunteers */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Volunteers
              </h2>
              <div
                className={`${listing?.volunteers && listing?.volunteers.length > 0 ? "grid grid-cols-1 xl:grid-cols-4 gap-4" : null}`}
              >
                {listing?.volunteers && listing?.volunteers.length > 0 ? (
                  <>
                    {listing.volunteers.map((vol) => {
                      return (
                        <Link
                          href={`/view/volunteer/${vol.volunteers.id}`}
                          key={vol.volunteers.id}
                        >
                          <Card className="flex flex-col items-center p-4 rounded-lg border shadow-md hover:shadow-lg transition-shadow w-full">
                            <img
                              src={vol.volunteers.image || ""}
                              alt={vol.volunteers.name || "Volunteer"}
                              className="rounded-lg w-16 h-16 object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-700">
                                {vol.volunteers.name}
                              </h3>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  <p className="text-gray-500 text-center w-full">
                    No Volunteers
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
