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
import HomePageTypewriter from "@/components/typewriter";
import "./font.css";

export default function Home() {
  return (
    <div>
      <div className="relative">
        <div className="w-full">
          <HomePageTypewriter />
        </div>
      </div>
      <div className="py-20">
        <div className="font-bold text-center text-[30pt] text-sky-500 pb-10">
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
                      width={"200px"}
                      height={"200px"}
                      src="Sebastian-Profile.png"
                      alt={"Sebastian Newberry"}
                    />
                    <h1 className="font-bold">Sebastian Newberry</h1>
                  </div>
                  <div className="text-lg flex-1">
                    <p>
                      Driven and adaptable Computer Science student with a
                      comprehensive understanding of software development,
                      algorithms, and system architecture. Proficient in
                      languages such as Python, Java, and C++, with practical
                      experience in building scalable applications and working
                      with databases. Highly skilled in troubleshooting and
                      optimizing code, as well as collaborating in diverse team
                      settings. Demonstrates a strong ability to learn new
                      technologies quickly and apply them to solve real-world
                      problems. Known for a proactive approach to
                      problem-solving, strong organizational abilities, and
                      effective communication both in group projects and
                      individual assignments.
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
                      width={"200px"}
                      height={"200px"}
                      src="Ian-Profile.png"
                      alt={"Ian Crowe-Sittig"}
                    />
                    <h1 className="font-bold">Ian Crowe-Sittig</h1>
                  </div>
                  <div className="text-lg flex-1">
                    <p>
                      Motivated and detail-oriented Computer Science student
                      with hands-on experience in programming, software
                      development, and problem-solving. Proficient in languages
                      such as Java, Python, and C++, with a solid understanding
                      of algorithms, data structures, and object-oriented
                      design. Strong collaborator and quick learner, eager to
                      apply academic knowledge to real-world projects and
                      contribute to innovative software solutions.
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
                      width={"200px"}
                      height={"200px"}
                      src="Jacob-Profile.png"
                      alt={"Jacob Ulbrich"}
                    />
                    <h1 className="font-bold">Jacob Ulbrich</h1>
                  </div>
                  <div className="text-lg flex-1">
                    <p>
                      Third-year student at Wayne State University working
                      towards earning his bachelor’s degree in honors computer
                      science with a mathematics minor. Hopes to use his
                      mathematics minor as well as an interest in statistics to
                      pursue a career in data analytics. He enjoys voluteer work
                      and helping others learn about the many opportunities
                      computer science has to offer.
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
                      width={"200px"}
                      height={"200px"}
                      src="Loc-Profile.png"
                      alt={"Loc Phan"}
                    />
                    <h1 className="font-bold">Loc Phan</h1>
                  </div>
                  <div className="text-lg flex-1">
                    <p>
                      Driven Computer Science student with a passion for
                      technology and coding. Experienced in developing software
                      solutions, troubleshooting, and optimizing systems.
                      Skilled in languages like Python, Java, and C++, with a
                      strong foundation in algorithms, databases, and software
                      engineering principles. Adept at working in collaborative
                      environments, with a keen interest in applying academic
                      learning to real-world challenges and contributing to
                      impactful tech projects
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
                      width={"200px"}
                      height={"200px"}
                      src="Parsa-Profile.png"
                      alt={"Parsa Nematollahe"}
                    />
                    <h1 className="font-bold">Parsa Nematollahe</h1>
                  </div>
                  <div className="text-lg flex-1">
                    <p>
                      Enthusiastic Computer Science student with a solid grasp
                      of core programming concepts, software engineering, and
                      computer systems. Skilled in programming languages such as
                      Python, Java, and C++, with experience in building both
                      front-end and back-end applications. Adept at
                      problem-solving, debugging, and optimizing code, with a
                      focus on writing efficient and maintainable solutions.
                      Experienced in collaborative projects and agile
                      development processes, and eager to continue learning
                      emerging technologies. Strong analytical thinker with
                      excellent communication and time-management skills, able
                      to balance academic responsibilities with extracurricular
                      involvement.
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
