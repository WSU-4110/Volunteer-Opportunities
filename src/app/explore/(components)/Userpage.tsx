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

export function searchByTitle(keyword: string, listings: ListingsProps) {
  const element = document.getElementById("listings");

  if (element == null) {
    return;
  }

  const filteredListings = {
    listings: listings.listings.filter((item) => {
      return item.name.includes(keyword);
    }),
  };

  element.innerHTML = ReactDOMServer.renderToStaticMarkup(
    getReactNodeFromListings(filteredListings)
  );
}

export function searchByDescription(keyword: string, listings: ListingsProps) {
  const element = document.getElementById("listings");

  if (element == null) {
    return;
  }

  const filteredListings = {
    listings: listings.listings.filter((item) => {
      return item.description.includes(keyword);
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
              return searchByTitle(event.currentTarget.value, listings);
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
              return searchByDescription(event.currentTarget.value, listings);
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
              return searchByTalent(event.currentTarget.value, listings);
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
