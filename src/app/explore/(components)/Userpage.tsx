"use client";

import { ReactNode } from "react";

import Listing, { ListingsWithTalentsInterface } from "@/components/Listing";

import ReactDOMServer from "react-dom/server";
import {
  searchByDescription,
  searchByTalent,
  searchByTitle,
} from "../client-actions";

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
  return (
    <>
      <div className="w-[50%] mx-auto my-3">
        <div className="my-5">
          <span>Search by: </span>
          <select
            name="search-options"
            id="search-options"
            onChange={(event) => {
              const makeAllHidden = () => {
                document.getElementById("title-search-input")!.hidden = true;
                document.getElementById("description-search-input")!.hidden =
                  true;
                document.getElementById("talent-search-input")!.hidden = true;
              };

              if (event.target.value == "title") {
                makeAllHidden();

                document.getElementById("title-search-input")!.hidden = false;
              } else if (event.target.value == "description") {
                makeAllHidden();

                document.getElementById("description-search-input")!.hidden =
                  false;
              } else if (event.target.value == "talents") {
                makeAllHidden();

                document.getElementById("talent-search-input")!.hidden = false;
              }
            }}
          >
            <option value="title">Title</option>
            <option value="description">Description</option>
            <option value="talents">Talents</option>
          </select>
        </div>

        <input
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              displayListings(
                searchByTitle(event.currentTarget.value, listings)
              );
            }
          }}
          type="text"
          id="title-search-input"
          placeholder="Search for Title"
          className="w-full text-xl border-2 rounded p-1.5"
          hidden={false}
        />

        <input
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              displayListings(
                searchByDescription(event.currentTarget.value, listings)
              );
            }
          }}
          type="text"
          id="description-search-input"
          placeholder="Search for Description"
          className="w-full text-xl border-2 rounded p-1.5"
          hidden={true}
        />

        <input
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              displayListings(
                searchByTalent(event.currentTarget.value, listings)
              );
            }
          }}
          type="text"
          id="talent-search-input"
          placeholder="Search for Talent"
          className="w-full text-xl border-2 rounded p-1.5"
          hidden={true}
        />
      </div>

      <div id="listings">{getReactNodeFromListings(listings)}</div>
    </>
  );
}
