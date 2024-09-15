"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const Navbar = ({
  className,
  authStatus,
  signOut,
}: {
  className?: string;
  authStatus?: Session | undefined;
  signOut: () => void;
}) => {
  const [active, setActive] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState<Boolean>(false);

  const handleBurgerToggle = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex w-[100%] flex-row justify-between items-center m-auto px-4 2xl:px-36 py-5 sticky z-[40] shadow-lg">
        <Link className="text-2xl cursor-pointer min-w-[100px]" href="/">
          <div className="flex flex-col justify-center items-center">
            <img
              src="/Favicon.png"
              alt="Volunteer Opportunities Logo"
              width={"100px"}
              height={"100px"}
            />
            <h1>Volunteer Opportunities</h1>
          </div>
        </Link>
        {authStatus?.user ? (
          <>
            <div className="flex md:hidden relative z-[50] ">
              <Sheet onOpenChange={handleBurgerToggle}>
                <SheetTrigger>
                  <div className="flex flex-col justify-between w-6 h-4 cursor-pointer">
                    <div
                      className={`w-full h-0.5 bg-black transition-transform transform origin-center ${
                        isOpen
                          ? "rotate-45 translate-y-[7px]"
                          : "rotate-0 translate-y-0"
                      }`}
                    ></div>
                    <div
                      className={`w-full h-0.5 bg-black transition-opacity ${
                        isOpen ? "opacity-0" : "opacity-100"
                      }`}
                    ></div>
                    <div
                      className={`w-full h-0.5 bg-black transition-transform transform origin-center ${
                        isOpen
                          ? "-rotate-45 -translate-y-[7px]"
                          : "rotate-0 translate-y-0"
                      }`}
                    ></div>
                  </div>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="h-full">
                    <SheetTitle>
                      <div className="flex flex-col justify-center items-center">
                        <img
                          src="/Favicon.png"
                          alt="Volunteer Opportunities Logo"
                          width={"100px"}
                          height={"100px"}
                        />
                        <h1>Volunteer Opportunities</h1>
                      </div>
                    </SheetTitle>
                    <SheetDescription className="h-full">
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex justify-start flex-col gap-5 mt-5">
                          <div className="flex flex-col gap-5">
                            <h1 className="font-medium text-xl text-black">
                              Explore
                            </h1>
                            <div className="ml-5 mb-5 flex flex-col gap-3">
                              <Link
                                href={"/explore/volunteers"}
                                className="block"
                              >
                                Search for your volunteering needs
                              </Link>
                            </div>
                          </div>
                          <div className="flex justify-start flex-col gap-5">
                            <div className="flex flex-col gap-5">
                              <h1 className="font-medium text-xl text-black">
                                Message
                              </h1>
                              <div className="ml-5 mb-5 flex flex-col gap-3">
                                <Link href={"/feed"} className="block">
                                  Message other organizations who need help
                                </Link>
                                <Link href="/volunteers/message">
                                  Message other volunteers who seek to improve
                                  their skills
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-start flex-col gap-5">
                            <div className="flex flex-col gap-5">
                              <h1 className="font-medium text-xl text-black">
                                Profile
                              </h1>
                              <div className="ml-5 mb-5 flex flex-col gap-3">
                                <Link href={"/profile/view"} className="block">
                                  View Profile
                                </Link>
                                <Link href={"/profile/edit"} className="block">
                                  Edit Profile
                                </Link>
                                <Link
                                  href={"/profiles/search"}
                                  className="block"
                                >
                                  Search for Other Profiles
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col w-full p-4 gap-3">
                          <ProductItem
                            title={authStatus?.user.name || ""}
                            description={authStatus?.user.email || ""}
                            src={
                              authStatus?.user.image || "/blank_profile_pic.png"
                            }
                          ></ProductItem>
                          <Button
                            onClick={() => signOut()}
                            className="w-full"
                            variant={"destructive"}
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
            <div className={cn("hidden md:block ", className)}>
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Explore">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/explore/businesses">
                      Search for your volunteering needs
                    </HoveredLink>
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Message">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/organizations/message">
                      Message other organizations who need help
                    </HoveredLink>
                    <HoveredLink href="/volunteers/message">
                      Message other volunteers who seek to improve their skills
                    </HoveredLink>
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Profile">
                  <div className="flex flex-col space-y-4 text-sm">
                    <ProductItem
                      title={authStatus?.user.name || ""}
                      description={authStatus?.user.email || ""}
                      src={authStatus?.user.image || "/blank_profile_pic.png"}
                    ></ProductItem>
                    <HoveredLink href="/profile/edit ">
                      Edit Profile
                    </HoveredLink>
                    <HoveredLink href="/profile/view">View Profile</HoveredLink>
                    <HoveredLink href="/profiles/search">
                      Search for other Profiles
                    </HoveredLink>
                    <Button
                      onClick={async () => await signOut()}
                      variant={"destructive"}
                    >
                      Sign Out
                    </Button>
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </>
        ) : (
          <>
            <div className="flex md:hidden ">
              <Sheet onOpenChange={handleBurgerToggle}>
                <SheetTrigger>
                  <div className="flex flex-col justify-between w-6 h-4 cursor-pointer">
                    <div
                      className={`w-full h-0.5 bg-gray-700 transition-transform transform origin-center ${
                        isOpen
                          ? "rotate-45 translate-y-[7px]"
                          : "rotate-0 translate-y-0"
                      }`}
                    ></div>
                    <div
                      className={`w-full h-0.5 bg-gray-700 transition-opacity ${
                        isOpen ? "opacity-0" : "opacity-100"
                      }`}
                    ></div>
                    <div
                      className={`w-full h-0.5 bg-gray-700 transition-transform transform origin-center ${
                        isOpen
                          ? "-rotate-45 -translate-y-[7px]"
                          : "rotate-0 translate-y-0"
                      }`}
                    ></div>
                  </div>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex flex-col">
                        <img src="/Favicon.png" width="100px" height="100px" />
                      </div>
                    </SheetTitle>
                    <SheetDescription>
                      <div className="flex justify-start flex-col gap-5 mt-5">
                        <div className="flex justify-start flex-col gap-5">
                          <div className="flex flex-col gap-5">
                            <h1 className="font-medium text-xl text-black">
                              Login/Register
                            </h1>
                            <div className="ml-5 mb-5 flex flex-col gap-3">
                              <Link href={"/sign-in"} className="block">
                                Sign In
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
            <div className={cn("hidden md:block relative z-500", className)}>
              <Menu setActive={setActive}>
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Login/Register"
                >
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/api/auth/signin">Sign In</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
