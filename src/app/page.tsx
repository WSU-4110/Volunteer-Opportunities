import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="relative">
        <div className="opacity-20">
          <img src="volunteer-image.jpg" width="2000"></img>
        </div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="font-medium font-bold text-[30pt]">
            Welcome to Volunteer Opportunites
          </div>
          <div className="font-medium text-[12pt] text-center">
            “It's easy to make a buck. It's a lot tougher to make a difference.”
            <br></br>
            -Tom Brokaw
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="font-medium text-center text-[30pt] font-bold text-blue-400">
          <p>
            <br></br>
          </p>
          What do we do?
        </div>
        <div className="font-medium text-center text-[12pt] mx-20">
          <p>
            Discover a world of possibilities on our volunteer opportunity
            website, a vibrant hub connecting passionate individuals with
            meaningful projects in their communities. With an intuitive
            interface, users can easily search for opportunities based on their
            skills. Whether it’s mentoring youth, conserving the environment, or
            providing support to those in need, each listing features detailed
            descriptions ensuring you find the perfect match for your passion.
            Join us in making a difference, one hour at a time, and unlock the
            potential to create lasting change in the lives of others while
            enriching your own.
          </p>
          <p>
            <br></br>
            <br></br>
          </p>
          <p>
            <br></br>
            <br></br>
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="bg-blue-400">
          <div className="font-medium text-center text-[30pt] font-bold text-white">
            Who are we?
          </div>
          <div className="container mx-auto">
            <div className="flex items-stretch">
              <div className="py-4 size-32">
                <img src="profile-photo.png"></img>
              </div>
              <div className="py-12 text-[12pt]">
                <br></br>
                Computer Science Major at Wayne State University. Passionate in
                web development and cybersecurity. Excited to explore the
                industry to see what Computer Science has to offer.
              </div>
            </div>
            <br></br>
            <div className="font-bold">Sebastian Newberry</div>
            <br></br>
          </div>

          <div className="container mx-auto">
            <div className="flex items-stretch">
              <div className="py-4 size-32">
                <img src="profile-photo.png"></img>
              </div>
              <div className="py-12 text-[12pt]">
                <br></br>
                Computer Science Major at Wayne State University. Passionate in
                web development and cybersecurity. Excited to explore the
                industry to see what Computer Science has to offer.
              </div>
            </div>
            <br></br>
            <div className="font-bold">Ian Crowe-Sittig</div>
            <br></br>
          </div>

          <div className="container mx-auto">
            <div className="flex items-stretch">
              <div className="py-4 size-32">
                <img src="profile-photo.png"></img>
              </div>
              <div className="py-12 text-[12pt]">
                <br></br>
                Third-year student at Wayne State University working towards
                earning his bachelor’s degree in honors computer science with a
                mathematics minor.
              </div>
            </div>
            <br></br>
            <div className="font-bold">Jacob Ulbrich</div>
            <br></br>
          </div>

          <div className="container mx-auto">
            <div className="flex items-stretch">
              <div className="py-4 size-32">
                <img src="profile-photo.png"></img>
              </div>
              <div className="py-12 text-[12pt]">
                <br></br>
                Computer Science Major at Wayne State University. Passionate in
                web development and cybersecurity. Excited to explore the
                industry to see what Computer Science has to offer.
              </div>
            </div>
            <br></br>
            <div className="font-bold">Loc Phan</div>
            <br></br>
          </div>

          <div className="container mx-auto">
            <div className="flex items-stretch">
              <div className="py-4 size-32">
                <img src="profile-photo.png"></img>
              </div>
              <div className="py-12 text-[12pt]">
                <br></br>A quirky and goofy goober. Also a 3rd year Wayne State
                Student studying Computer Science, Mathematics, and Statistics.
                I enjoy long walks to the fridge and love to sleep.
              </div>
            </div>
            <br></br>
            <div className="font-bold">Parsa Nematollahe</div>
            <br></br>
          </div>
        </div>
      </div>
    </div>
  );
}
