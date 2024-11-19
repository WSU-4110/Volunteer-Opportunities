"use client";

import { ListingsWithTalentsInterface } from "@/components/Listing";
import { searchByTitle } from "../client-actions";
import { displayListings } from "./Userpage";

export default function TitleSearchBar(listings: {
  listings: ListingsWithTalentsInterface;
}) {
  return (
    <input
      onKeyDown={(event) => {
        if (event.key == "Enter") {
          displayListings(
            searchByTitle(event.currentTarget.value, listings.listings)
          );
        }
      }}
      type="text"
      id="title-search-input"
      placeholder="Search for Title"
      className="w-full text-xl border-2 rounded p-1.5"
    />
  );
}
