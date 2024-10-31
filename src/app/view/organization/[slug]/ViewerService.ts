// ViewerService.ts
import { getOrganizationById } from "./actions";

export class ViewerService {
  async getOrganizationData(slug: string) {
    return await getOrganizationById(slug);
  }

  getProfileImage(organization) {
    return organization?.thumbnail?.storageId || "";
  }

  getCreatorName(organization) {
    return organization?.users?.name || "Unknown Creator";
  }

  getOpportunities(organization) {
    return organization?.listings || [];
  }

  getContactInfo() {
    return {
      address: "10123 Test Dr",
      phone: "123-456-7890",
      email: "test@test.com",
    };
  }

  getDescription() {
    return "We do great things for our community";
  }
}
