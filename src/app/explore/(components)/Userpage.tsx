"use client";

import { useState } from "react";

import Listing, { ListingsWithTalentsInterface } from "@/components/Listing";

import ReactDOMServer from "react-dom/server";

import { SearchBarNodeFactory } from "./SearchBarNode";

export function getReactNodeFromListings(
  listings: ListingsWithTalentsInterface
) {
  return listings.listings.map((item) => (
    <Listing
      id={item.id}
      name={item.name}
      description={item.description}
      thumbnail={item.thumbnail}
      organizationID={item.organizationID}
      talents={item.talents}
      key={item.id}
    />
  ));
}

export function displayListings(listings: ListingsWithTalentsInterface) {
  const element = document.getElementById("listings");

  if (element == null) {
    return;
  }

  element.innerHTML = ReactDOMServer.renderToStaticMarkup(
    getReactNodeFromListings(listings)
  );
}

export default function Userpage(listings: ListingsWithTalentsInterface) {
  const searchBarFactory = new SearchBarNodeFactory(listings);

  const [searchBarType, setSearchBarType] = useState("title");

  return (
    <>
      <div className="w-[50%] mx-auto my-3">
        <div className="my-5">
          <span>Search by: </span>
          <select
            name="search-options"
            id="search-options"
            onChange={(event) => {
              setSearchBarType(event.target.value);
            }}
          >
            <option value="title">Title</option>
            <option value="description">Description</option>
            <option value="talents">Talents</option>
          </select>
        </div>

        <div id="search-bar">
          {searchBarFactory.getSearchBar(searchBarType)?.getReactNode()}
        </div>
      </div>

      <div id="listings">{getReactNodeFromListings(listings)}</div>
    </>
  );
}
