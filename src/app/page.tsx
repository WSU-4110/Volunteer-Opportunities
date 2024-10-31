"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Typewriter } from "react-simple-typewriter";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";

//page interface
export interface Page {
  getImageUrl(): string;
  printIntro(): any;
}

//basic page with only an image url to display and an intro message
class basicPage implements Page {
  imageUrl: string;

  public getImageUrl(): string {
    return this.imageUrl;
  }

  public printIntro(): any {
    return "Welcome to Volunteer Opportunites!";
  }
}

//decorator class
abstract class pageDecorator implements Page {
  pageToBeDecorated: Page;

  public pageDecorator(pageToBeDecorated: Page) {
    this.pageToBeDecorated = pageToBeDecorated;
  }

  public getImageUrl(): string {
    return this.pageToBeDecorated.getImageUrl();
  }
  public printIntro(): any {
    this.pageToBeDecorated.printIntro();
  }
}

//implement the typewriter feature
class typewriter extends pageDecorator {
  public typewriter(pageToBeDecorated: Page) {
    super(pageToBeDecorated);
  }

  public printIntro(): any {
    super.printIntro();
    printTypewriter();
  }

  public printTypeWriter(): any{
    <h1
              style={{
                paddingTop: "5rem",
                margin: "auto 0",
                fontWeight: "normal",
              }}
            >
              Volunteers are{" "}
              <span style={{ fontWeight: "bold" }}>
                <Typewriter
                  words={["Kind", "Selfless", "Thoughtful", "Priceless!"]}
                  loop={5}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
  }
}

//implement longer page description
class description extends pageDecorator {
  public description(pageToBeDecorated: Page) {
    super(pageToBeDecorated);
  }

  public printIntro(): any {
    super.printIntro();
    this.printPageDescription();
  }

  public printPageDescription(): string {
    return "At Volunteer Opportunites, we believe that every individual has the power to make a difference. Our platform serves as a comprehensive resource for those eager to contribute their time, skills, and passion to causes that matter. Whether you’re a seasoned volunteer or looking to embark on your first service experience, we have opportunities that cater to your interests and availability.";
  }
}

//Original code//
/*
export default function Home() {
  return (
    <div>
      <div className="relative">
        <div className="opacity-20">
          <img src="volunteer-image.jpg" className="w-full"></img>
        </div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="text-center text-[30pt]">
            <h1
              style={{
                paddingTop: "5rem",
                margin: "auto 0",
                fontWeight: "normal",
              }}
            >
              Volunteers are{" "}
              <span style={{ fontWeight: "bold" }}>
                <Typewriter
                  words={["Kind", "Selfless", "Thoughtful", "Priceless!"]}
                  loop={5}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </h1>
          </div>
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
        <div className="font-medium text-center text-[30pt] font-bold text-sky-500 pb-10">
          <h1>What do we do?</h1>
        </div>
        <div className="font-medium text-center text-[12pt] mx-20">
          At Volunteer Opportunites, we believe that every individual has the
          power to make a difference. Our platform serves as a comprehensive
          resource for those eager to contribute their time, skills, and passion
          to causes that matter. Whether you’re a seasoned volunteer or looking
          to embark on your first service experience, we have opportunities that
          cater to your interests and availability.
          <p>
            <br></br>
          </p>
          <div className="font-bold">Discover a World of Opportunities</div>
          Explore a diverse range of volunteer positions across various sectors,
          including education, health care, environmental conservation,
          community development, and social justice. Our listings are regularly
          updated to ensure you have access to the latest opportunities both
          locally and online. With just a few clicks, you can search for
          projects by skill set or specific causes, making it easy to find the
          perfect match for your unique talents and interests. Each opportunity
          provides detailed descriptions, allowing you to understand the scope
          of the work, the impact it has, and how your involvement can lead to
          meaningful change. From tutoring children to participating in
          community clean-ups, the possibilities are endless, empowering you to
          choose how you want to contribute.
          <p>
            <br></br>
          </p>
          <div className="font-bold">Connect with Like-Minded Individuals</div>
          Join a vibrant community of volunteers who share your passion for
          making a positive impact on the world. Our platform encourages
          connection and collaboration through messaging pages where you can
          meet others who are equally dedicated to service. Share experiences,
          exchange ideas, and inspire one another as you embark on your
          volunteering journey. Whether you want to work solo or as part of a
          larger team, you’ll find support and encouragement every step of the
          way. By building relationships with fellow volunteers, you not only
          enhance your own experience but also create a network of like-minded
          individuals committed to fostering positive change in their
          communities.
          <p>
            <br></br>
          </p>
          <div className="font-bold">Impact Your Community</div>
          Every act of kindness, no matter how small, contributes to a larger
          change that can profoundly affect individuals and communities. By
          volunteering, you’re not only supporting local organizations but also
          fostering a sense of community and connection that is increasingly
          vital in today’s world. Your efforts can help address critical issues
          such as poverty, education inequities, and environmental challenges,
          uplifting those in need and promoting a culture of giving and support.
          The impact of your volunteer work goes beyond the immediate benefits;
          it creates ripples that inspire others to get involved, cultivating a
          more engaged and compassionate society. Together, we can create a
          positive environment that nurtures growth, understanding, and mutual
          support.
        </div>
      </div>
      <div className="py-20 bg-sky-500">
        <div className="font-medium text-center text-5xl text-white pb-10">
          <h1>Who are we?</h1>
        </div>

        <Carousel
          className="bg-sky-500 text-center w-full select-none cursor-grab"
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnMouseEnter: true,
              stopOnInteraction: false,
              stopOnLastSnap: false,
            }),
          ]}
          opts={{ loop: true }}
        >
          <CarouselContent>
            <CarouselItem>
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
                      Computer Science Major at Wayne State University.
                      Passionate in web development and cybersecurity. Excited
                      to explore the industry to see what Computer Science has
                      to offer.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
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
                      Computer Science Major at Wayne State University.
                      Passionate in web development and cybersecurity. Excited
                      to explore the industry to see what Computer Science has
                      to offer.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
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
                      Third-year student at Wayne State University working
                      towards earning his bachelor’s degree in honors computer
                      science with a mathematics minor.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
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
                      Computer Science Major at Wayne State University.
                      Passionate in web development and cybersecurity. Excited
                      to explore the industry to see what Computer Science has
                      to offer.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
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
                      A quirky and goofy goober. Also a 3rd year Wayne State
                      Student studying Computer Science, Mathematics, and
                      Statistics. I enjoy long walks to the fridge and love to
                      sleep.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
*/
