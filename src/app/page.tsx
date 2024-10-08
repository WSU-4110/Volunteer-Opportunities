import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div>
      <div className="relative">
        <div className="opacity-20">
          <img src="volunteer-image.jpg" className="w-full"></img>
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
      <div className="py-20">
        <div className="font-medium text-center text-[30pt] font-bold text-blue-400 pb-10">
          <h1>What do we do?</h1>
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
        </div>
      </div>
      <div className="py-20 bg-blue-400">
        <div className="font-medium text-center text-5xl text-white pb-10">
          <h1>Who are we?</h1>
        </div>
        <div className="flex flex-col gap-8 items-center justify-start">
          <div className="container mx-auto">
            <div className="flex flex-row items-center jusify-center gap-5">
              <div className="flex flex-col justify-center items-center flex-1">
                <img
                  width={"150px"}
                  height={"150px"}
                  src="profile-photo.png"
                  alt={"Sebastian Newberry"}
                />
                <h1 className="font-bold">Sebastian Newberry</h1>
              </div>
              <div className="text-lg flex-1">
                <p>
                  Computer Science Major at Wayne State University. Passionate
                  in web development and cybersecurity. Excited to explore the
                  industry to see what Computer Science has to offer.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto">
            <div className="flex flex-row items-center jusify-center gap-5">
              <div className="flex flex-col justify-center items-center flex-1">
                <img
                  width={"150px"}
                  height={"150px"}
                  src="profile-photo.png"
                  alt={"Ian Crowe-Sittig"}
                />
                <h1 className="font-bold">Ian Crowe-Sittig</h1>
              </div>
              <div className="text-lg flex-1">
                <p>
                  Computer Science Major at Wayne State University. Passionate
                  in web development and cybersecurity. Excited to explore the
                  industry to see what Computer Science has to offer.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto">
            <div className="flex flex-row items-center jusify-center gap-5">
              <div className="flex flex-col justify-center items-center flex-1">
                <img
                  width={"150px"}
                  height={"150px"}
                  src="profile-photo.png"
                  alt={"Jacob Ulbrich"}
                />
                <h1 className="font-bold">Jacob Ulbrich</h1>
              </div>
              <div className="text-lg flex-1">
                <p>
                  Third-year student at Wayne State University working towards
                  earning his bachelor’s degree in honors computer science with
                  a mathematics minor.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto">
            <div className="flex flex-row items-center jusify-center gap-5">
              <div className="flex flex-col justify-center items-center flex-1">
                <img
                  width={"150px"}
                  height={"150px"}
                  src="profile-photo.png"
                  alt={"Loc Phan"}
                />
                <h1 className="font-bold">Loc Phan</h1>
              </div>
              <div className="text-lg flex-1">
                <p>
                  Computer Science Major at Wayne State University. Passionate
                  in web development and cybersecurity. Excited to explore the
                  industry to see what Computer Science has to offer.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto">
            <div className="flex flex-row items-center jusify-center gap-5">
              <div className="flex flex-col justify-center items-center flex-1">
                <img
                  width={"150px"}
                  height={"150px"}
                  src="profile-photo.png"
                  alt={"Parsa Nematollahe"}
                />
                <h1 className="font-bold">Parsa Nematollahe</h1>
              </div>
              <div className="text-lg flex-1">
                <p>
                  A quirky and goofy goober. Also a 3rd year Wayne State Student
                  studying Computer Science, Mathematics, and Statistics. I
                  enjoy long walks to the fridge and love to sleep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Carousel className="bg-blue-400 text-center">
        <CarouselContent>
          <CarouselItem>
            <p>Test Carousel 1</p>
          </CarouselItem>
          <CarouselItem>
            <p>Test Carousel 2</p>
          </CarouselItem>
          <CarouselItem>
            <p>Test Carousel 3</p>
          </CarouselItem>
          <CarouselItem>
            <p>Test Carousel 4</p>
          </CarouselItem>
          <CarouselItem>
            <p>Test Carousel 5</p>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
