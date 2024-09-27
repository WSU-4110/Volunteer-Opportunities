import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative">
      <div className="opacity-50">
        <img src="volunteer-image.jpg" width="2000"></img>
      </div>
      <div className="font-mono absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        Center Text
      </div>
    </div>
  );
}
