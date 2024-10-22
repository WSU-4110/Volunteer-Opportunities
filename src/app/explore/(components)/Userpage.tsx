"use client";

import { ReactNode } from "react";

import Listing from "./Listing";

import ReactDOMServer from "react-dom/server";

export interface ListingInterface {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  organizationID: string;
  talents: string[];
}

export interface ListingsProps {
  listings: ListingInterface[];
}

export function searchByTitle(title: string, listings: ListingsProps) {
  const element = document.getElementById("listings");

  if (element == null) {
    return;
  }

  const filteredListings = {
    listings: listings.listings.filter((item) => {
      return item.name.includes(title);
    }),
  };

  element.innerHTML = ReactDOMServer.renderToStaticMarkup(
    getReactNodeFromListings(filteredListings)
  );
}

export function searchByTalent(talent: string, listings: ListingsProps) {
  const element = document.getElementById("listings");

  if (element == null) {
    return;
  }

  const filteredListings = {
    listings: listings.listings.filter((item) => {
      return (
        item.talents.filter((subitem) => {
          return subitem.includes(talent);
        }).length > 0
      );
    }),
  };

  element.innerHTML = ReactDOMServer.renderToStaticMarkup(
    getReactNodeFromListings(filteredListings)
  );
}

export function getReactNodeFromListings(listings: ListingsProps) {
  return listings.listings.map((item) => (
    <Listing
      imageURL={item.thumbnail}
      title={item.name}
      description={item.description}
      talents={item.talents}
      key={item.id}
    />
  ));
}

export default function Userpage(listings: ListingsProps) {
  return (
    <>
      <div className="w-[50%] mx-auto my-3 ">
        <input
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              return searchByTitle(event.currentTarget.value, listings);
            }
          }}
          type="text"
          id="title-search-input"
          placeholder="Search for Title"
          className="w-full border-2 rounded"
        />

        <input
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              return searchByTalent(event.currentTarget.value, listings);
            }
          }}
          type="text"
          id="talent-search-input"
          placeholder="Search for Talent"
          className="w-full border-2 rounded"
        />
      </div>

      <div id="listings">{getReactNodeFromListings(listings)}</div>
    </>
  );
}
