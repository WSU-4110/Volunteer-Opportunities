// ViewerPage.tsx
import Link from "next/link";
import { ViewerService } from "./ViewerService";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card } from "@/components/ui/card";

const ViewerPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const viewerService = new ViewerService();
  let [organization, error] = await viewerService.getOrganizationData(slug);

  const contactInfo = viewerService.getContactInfo();
  const description = viewerService.getDescription();
  const opportunities = viewerService.getOpportunities(organization);

  return (
    <div>
      {organization ? (
        <div className="bg-gray-100 min-h-screen py-12">
          <MaxWidthWrapper>
            {/* Profile Section with Organization Name */}
            <section className="w-full max-w-4xl mx-auto flex items-center mb-8">
              <div className="mr-6">
                <img
                  src={viewerService.getProfileImage(organization)}
                  alt={organization?.name}
                  width={"200px"}
                  height={"200px"}
                  className="rounded-md object-cover shadow-lg"
                />
                <p className="text-sm text-gray-600 mt-2 ml-2">
                  Created By: {viewerService.getCreatorName(organization)}
                </p>
              </div>
              <h1 className="text-4xl font-bold text-gray-800">
                {organization?.name}
              </h1>
            </section>

            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Description Section */}
              <section className="col-span-2 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  About us
                </h2>
                <p className="text-gray-700">{description}</p>
              </section>

              {/* Contact Information Section */}
              <div className="col-span-1 flex flex-col items-center">
                <Link href={"/message"} className="w-full text-center mb-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full">
                    Message
                  </Button>
                </Link>
                <section className="w-full bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-700 font-semibold">📍 Address</p>
                      <p className="text-gray-700">{contactInfo.address}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-700 font-semibold">📞 Phone Number</p>
                      <p className="text-gray-700">{contactInfo.phone}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-700 font-semibold">📧 Email</p>
                      <p className="text-gray-700">{contactInfo.email}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Opportunities Section */}
            <section className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <Card
                    key={opportunity.id}
                    className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={opportunity.thumbnail || ""}
                        alt={opportunity.name}
                        width="70px"
                        height="70px"
                        className="rounded-md object-cover"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-800">
                          {opportunity.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {opportunity.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </MaxWidthWrapper>
        </div>
      ) : (
        <div className="mt-10 text-center">
          <h1 className="font-bold text-3xl mb-5">Organization not found.</h1>
          <p>Please go back to the previous page you were visiting and try again.</p>
        </div>
      )}
    </div>
  );
};

export default ViewerPage;
