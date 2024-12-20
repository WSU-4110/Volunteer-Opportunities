import { ReactNode } from "react";

export interface ListingWithTalentsInterface {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  organizationID: string;
  talents: string[];
}

export interface ListingsWithTalentsInterface {
  listings: ListingWithTalentsInterface[];
}

export default function Listing({
  id,
  name,
  description,
  thumbnail,
  organizationID,
  talents,
}: ListingWithTalentsInterface) {
  return (
    <div className="p-[20px] my-[20px] w-[50%] mx-auto rounded-[20px] bg-slate-200">
      <div className="bg-black">
        <img className="max-w-full max-h-96 mx-auto block" src={thumbnail} />
      </div>
      <br />
      <h1 className="text-2xl font-black leading-10 text-center">{name}</h1>
      <br />
      <p className="font-bold leading-10">Description:</p>
      <p>{description}</p>
      <br />
      <p className="font-bold">Looking for the following talents:</p>
      <div>
        {talents.map((item) => (
          <button
            type="button"
            key={item}
            className="bg-blue-300 text-2xl w-fit p-[5px] m-[5px] rounded-[5px]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
