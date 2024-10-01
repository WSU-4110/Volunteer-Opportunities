import Link from "next/link";
import { getUserById } from "./actions";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card } from "@/components/ui/card";

const ViewerPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [user, error] = await getUserById(slug);

  return (
    <MaxWidthWrapper>
      <section className="w-fit m-auto">
        <div className="mb-4">
          <img
            src={user?.image || ""} // Replace with actual profile image
            alt={user?.name}
            width={"300px"}
            height={"300px"}
            className="m-auto"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-center">{user?.name}</h1>
        </div>
        <h1 className="mt-10 text-center">
          Organizations This user has created:{" "}
        </h1>
        <div className="flex flex-row justify-center items-center">
          {user?.organizations.map((organization) => {
            return (
              <Link
                href={`/view/organization/${organization.id}`}
                key={organization.id}
              >
                <div className="flex flex-col justify-center items-center ">
                  <img
                    src={
                      (organization!.thumbnail! as { storageId: string })
                        .storageId || ""
                    }
                    alt={organization.name}
                    width="100px"
                    height="100px"
                  />
                  <h1>{organization?.name}</h1>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dynamic Main Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mt-4">
          Volunteer Opportunities this user has participated in:
        </h2>
        {user?.listings.map((opportunity, index) => (
          <Card className="p-8 shadow-lg" key={opportunity.listingId}>
            <div className="flex justify-start flex-row items-center gap-6">
              <img
                src={opportunity.listings.thumbnail || ""}
                alt={opportunity.listings.name}
                width={"70px"}
                height={"70px"}
              />
              <div>
                <h3 className="font-bold">{opportunity.listings.name}</h3>
                <p>{opportunity.listings.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mt-4">Skills this user has:</h2>
        {user?.skills.map((skill, index) => (
          <div
            className="flex justify-start flex-row items-center gap-6"
            key={skill.skillId}
          >
            <div>
              <h3>{skill.skills.name}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Action Button */}
      <section className="mt-10 text-center">
        <Link href={"/message"} className="p-4 bg-black rounded-lg text-white">
          Message
        </Link>
      </section>
    </MaxWidthWrapper>
  );
};

export default ViewerPage;
