import { ListingsWithTalentsInterface } from "@/components/Listing";
import { searchByTalent } from "../client-actions";
import { displayListings } from "./Userpage";

export default function DescriptionSearchBar(listings: {
  listings: ListingsWithTalentsInterface;
}) {
  return (
    <input
      onKeyDown={(event) => {
        if (event.key == "Enter") {
          displayListings(
            searchByTalent(event.currentTarget.value, listings.listings)
          );
        }
      }}
      type="text"
      id="talent-search-input"
      placeholder="Search for Talent"
      className="w-full text-xl border-2 rounded p-1.5"
    />
  );
}
