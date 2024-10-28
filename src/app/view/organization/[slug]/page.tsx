import Link from "next/link";
import { getOrganizationById } from "./actions";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card } from "@/components/ui/card";

const ViewerPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  let [organizations, error] = await getOrganizationById(slug);

  return (
    <MaxWidthWrapper>
      {organizations ? (
        <>
          <section className="w-fit m-auto">
            <div className="mb-4">
              <img
                src={
                  (organizations!.thumbnail! as { storageId: string })
                    .storageId || ""
                } // Replace with actual profile image
                alt={organizations?.name}
                width={"300px"}
                height={"300px"}
                className="m-auto"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-center">
                {organizations?.name}
              </h1>
            </div>
            <div className="flex flex-col justify-center items-center mt-10">
              <h1>Created By:</h1>
              <Link href={`/view/volunteer/${organizations?.users.id}`}>
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={organizations?.users.image || ""}
                    alt={organizations?.users.name}
                    width="100px"
                    height="100px"
                  />
                  <h1>{organizations?.users.name}</h1>
                </div>
              </Link>
            </div>
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-semibold mt-4">Opportunities</h2>
            {organizations?.listings.map((opportunity, index) => (
              <Card className="p-8 shadow-lg" key={opportunity.id}>
                <div className="flex justify-start flex-row items-center gap-6">
                  <img
                    src={opportunity.thumbnail || ""}
                    alt={opportunity.name}
                    width={"70px"}
                    height={"70px"}
                  />
                  <div>
                    <h3 className="font-bold">{opportunity.name}</h3>
                    <p>{opportunity.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </section>
          <section className="mt-10 text-center">
            <Link
              href={"/message"}
              className="p-4 bg-black rounded-lg text-white"
            >
              Message
            </Link>
          </section>
        </>
      ) : (
        <div className="mt-10 text-center">
          <h1 className="font-bold text-3xl mb-5">Organization not found.</h1>
          <p>
            Please go back to the previous page you were visiting and try again.
          </p>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default ViewerPage;
