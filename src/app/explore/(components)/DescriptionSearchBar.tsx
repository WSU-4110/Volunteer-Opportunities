import { ListingsWithTalentsInterface } from "@/components/Listing";
import { searchByDescription } from "../client-actions";
import { displayListings } from "./Userpage";

export default function DescriptionSearchBar(listings: {
  listings: ListingsWithTalentsInterface;
}) {
  return (
    <input
      onKeyDown={(event) => {
        if (event.key == "Enter") {
          displayListings(
            searchByDescription(event.currentTarget.value, listings.listings)
          );
        }
      }}
      type="text"
      id="description-search-input"
      placeholder="Search for Description"
      className="w-full text-xl border-2 rounded p-1.5"
    />
  );
}
