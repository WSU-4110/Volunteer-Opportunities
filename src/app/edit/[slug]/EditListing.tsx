"use client";

import { Textarea } from "@/components/ui/textarea";

export default function EditListing({
  listing,
  talents,
}: {
  listing: {
    description: string;
    id: string;
    name: string;
    thumbnail: string | null;
    organizationId: string;
  };
  talents: string[];
}) {
  return (
    <>
      <div className="w-[50%] mx-auto my-3">
        <span className="ml-2.5">New Title: </span>
        <input
          type="text"
          id="listing-title-input"
          placeholder="New Title"
          className="w-full text-xl border-2 rounded p-1.5"
          defaultValue={listing.name}
        />

        <br />
        <br />

        <span className="ml-2.5">New Description: </span>
        <Textarea
          id="listing-description-input"
          placeholder="New Description"
          className="w-full text-xl border-2 rounded p-1.5 h-min"
          defaultValue={listing.description}
        />

        <br />

        <span className="ml-2.5">New Thumbnail: </span>
        <input
          type="text"
          id="listing-thumbnail-input"
          placeholder="New Thumbnail"
          className="w-full text-xl border-2 rounded p-1.5"
          defaultValue={listing.thumbnail == null ? "" : listing.thumbnail}
        />

        <br />
        <br />

        <span className="ml-2.5">New Talent: </span>
        <input
          type="text"
          id="listing-talent-input"
          placeholder="New Talent"
          className="w-full text-xl border-2 rounded p-1.5"
        />

        <br />

        <button
          onClick={async (event) => {
            location.reload();
          }}
          type="button"
          id="submit-button"
          key={"submit-button"}
          className="bg-gray-100 text-2xl w-fit p-[5px] m-[5px] rounded-[5px]"
        >
          Submit
        </button>
      </div>
    </>
  );
}
