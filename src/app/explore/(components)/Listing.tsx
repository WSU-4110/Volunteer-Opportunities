import { ReactNode } from "react";

interface ListingProps {
  image: ReactNode;
  title: string;
  description: string;
  talents: string[];
}

export default function Listing({
  image,
  title,
  description,
  talents,
}: ListingProps) {
  return (
    <div className="p-[20px] mx-auto my-[20px] w-[800px] rounded-[20px] bg-slate-200">
      {image}
      <h1 className="text-2xl">{title}</h1>
      <p>{description}</p>
      <p>Looking for the following talent:</p>
      <div>
        {talents.map((item) => (
          <button
            type="button"
            key={item}
            className="bg-pink-300 w-fit p-[5px] m-[5px] rounded-[5px]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
