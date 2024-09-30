import { ReactNode } from "react";

// li {
//     background-color: lightblue;
//     width : fit-content;
//     padding : 5px;
//     margin : 5px;
//     border-radius: 5px;
//     float: left;
// }

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
        <ul>
          {talents.map((item) => (
            <li className="bg-pink-300 w-fit p-[5px] m-[5px] rounded-[5px]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
