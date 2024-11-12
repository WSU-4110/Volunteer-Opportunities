import Link from "next/link";
import { getUserById } from "./actions";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ViewerPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [user, error] = await getUserById(slug);

  return (
    <div className="py-12 bg-slate-200 min-h-[70vh]">
      <div className="w-[90%] m-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 py-12 bg-white p-12 rounded-lg">
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
              <img
                src={user?.image || "/default-profile.png"}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Bio */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">About Me</h2>
              <p className="text-gray-600">{user?.bio || ""}</p>
            </div>

            {/* Send Message Button */}
            <Link
              href={"/message"}
              className="mt-4 py-2 px-6 bg-blue-600 rounded-md text-white shadow-lg hover:bg-blue-700 transition-all"
            >
              Send Message
            </Link>
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-12">
            {/* Skills Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-left">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {user?.skills.map((skill, index) => (
                  <Badge
                    key={skill.skillId}
                    className="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white rounded-md shadow-sm cursor-pointer"
                  >
                    {skill.skills.name}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Organizations Created */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-left">
                Organizations Created
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user?.organizations.map((organization) => (
                  <Link
                    href={`/view/organization/${organization.id}`}
                    key={organization.id}
                  >
                    <Card className="flex flex-col items-center p-4 rounded-lg border shadow-md hover:shadow-lg transition-shadow w-full">
                      <img
                        src={
                          (organization.thumbnail as { storageId: string })
                            .storageId || "/default-organization.png"
                        }
                        alt={organization.name}
                        className="rounded-lg mb-2 w-24 h-24 object-cover"
                      />
                      <h3 className="font-semibold text-center text-gray-700">
                        {organization.name}
                      </h3>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Volunteer Opportunities Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-left">
                Volunteer Opportunities Participated In
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {user?.listings.map((opportunity, index) => (
                  <Card
                    className="p-6 rounded-lg border shadow-md hover:shadow-lg transition-shadow w-full flex gap-4 items-center"
                    key={opportunity.listingId}
                  >
                    <img
                      src={opportunity.listings.thumbnail || ""}
                      alt={opportunity.listings.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {opportunity.listings.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {opportunity.listings.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
