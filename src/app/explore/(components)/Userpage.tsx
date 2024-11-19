"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MapMultipleLocations from "@/components/mapMultipleLocations";
import { Card } from "@/components/ui/card";
import { deleteIndividualListing, filterListings } from "../actions";
import { useRouter } from "next/navigation";
import useUserStatusStore from "@/stores/userStatusStore";
import { revalidateListingPaths } from "@/app/edit/[slug]/actions";
import { volunteerForSpecificOpportunity } from "../actions";

type Skill = {
  id: string;
  name: string;
  iconUrl: string;
  hidden?: boolean;
};

export default function Userpage({
  initialListings,
  skills,
  userId,
}: {
  initialListings: any;
  skills: Skill[];
  userId: string;
}) {
  const { userStatus, changeUserStatus } = useUserStatusStore((state) => state);

  const router = useRouter();
  const [skillOptions, setSkillOptions] = useState<Skill[]>(skills);
  const [filterSkills, setFilterSkills] = useState<Skill[]>([]);

  const [currentSkill, setCurrentSkill] = useState("");

  const [listings, setListings] = useState<any>(initialListings);
  const formSchema = z.object({
    title: z.string(),
    description: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    setListings(initialListings);
  }, [initialListings]);

  const handleSkillOptionSelect = (id: string) => {
    setCurrentSkill(id);
  };

  const handleSkillOptionSubmit = (id: string) => {
    const selectedSkill = skills.find((skill) => skill.id == id);

    if (!selectedSkill) {
      return;
    }

    setSkillOptions((prevState) => [
      ...prevState.filter((skill) => skill.id != id),
    ]);

    setFilterSkills((prevState) => [...prevState, { ...selectedSkill }]);
    setCurrentSkill("");
  };

  const handleSkillFilterRemove = (newSkill: Skill) => {
    setSkillOptions((prevState) => {
      return [...prevState, newSkill];
    });

    setFilterSkills((prevState) => [
      ...prevState.filter((skill) => skill.id != newSkill.id),
    ]);
  };

  const volunteerSpecificListing = async (listingId: string) => {
    await volunteerForSpecificOpportunity(listingId);
    revalidateListingPaths();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [newListings, newListingsError] = await filterListings({
      ...values,
      skills: filterSkills.map((skill) => skill.id),
    });

    if (newListings) {
      setListings([...newListings]);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit(form.getValues());
    }
  };

  const deleteSpecificListing = async (listingId: string) => {
    await deleteIndividualListing(listingId);
  };

  return (
    <>
      <div className="w-full mt-12">
        <h1 className="text-2xl text-center font-bold my-12">
          Explore Organizations Offering Volunteer Opportunities That Need Your
          Assistance in Completing Their Goals
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center justify-start gap-30">
              <div className="flex flex-col xl:flex-row justify-between items-start gap-5 w-[90%] m-auto">
                <div className="flex-1 flex flex-col justify-center items-center gap-2 w-full">
                  <div className="flex flex-col justify-center gap-4 w-full">
                    <FormItem>
                      <FormLabel>Filter Listings By Skills</FormLabel>
                      <Select
                        onValueChange={handleSkillOptionSelect}
                        value={currentSkill}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillOptions.map((skill) => (
                            <SelectItem value={skill.id} key={skill.id}>
                              {skill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                    <Button
                      onClick={() => handleSkillOptionSubmit(currentSkill)}
                      type="button"
                    >
                      Select
                    </Button>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
                    {filterSkills.map((skill) => (
                      <div key={skill.id} className="hover:bg-slate-100">
                        <div className="p-2 hover:bg-slate-100 flex flex-row gap-2 items-center justify-center">
                          <img
                            className="w-[40px] h-[40px]"
                            src={skill.iconUrl}
                          />
                          <h1>{skill.name}</h1>
                          <Button
                            className="h-fit p-2 bg-white hover:bg-red-100"
                            onClick={() => handleSkillFilterRemove(skill)}
                            variant="outline"
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filter Listings by Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Listing Title"
                            {...field}
                            onKeyDown={handleKeyDown}
                          />
                        </FormControl>
                        <FormDescription>
                          Choose your Listing Title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1 w-full">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filter Listings By Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Organization Name"
                            {...field}
                            onKeyDown={handleKeyDown}
                          />
                        </FormControl>
                        <FormDescription>
                          Choose your description
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full text-center mt-12">
                <Button type="submit" className="w-1/2">
                  Filter
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="mt-20 h-full">
          <div className="flex flex-col xl:flex-row justify-between h-full shadow-lg bg-slate-200 py-12 gap-10 w-full">
            <div className="xl:flex-3 p-20 bg-white shadow-lg rounded-xl xl:w-[1000px]">
              <h1 className="text-2xl font-bold text-center">Listings</h1>
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 flex-wrap max-h-[700px] overflow-y-auto mt-5 gap-4">
                  {listings?.map((listing: any) => {
                    return (
                      <Card
                        key={listing.listings.id}
                        className="p-4 flex flex-col gap-2"
                      >
                        <div className="flex flex-col justify-between h-full w-full">
                          <div>
                            <h1 className="font-bold text-center text-xl">
                              {listing.listings.name}
                            </h1>
                            <img
                              className="w-full md:w-2/3 md:mx-auto xl:w-full h-[300px] object-cover object-top"
                              src={listing.listings.thumbnail || ""}
                              alt={listing.listings.name}
                            />
                            <p>{listing.listings.description}</p>
                            <h1 className="font-bold text-xl mt-4">
                              Skills Needed:
                            </h1>
                            <div className="flex flex-row gap-2 ">
                              {listing.skills.length > 0 ? (
                                listing.skills.map((skill: any) => {
                                  return (
                                    <div
                                      className="p-2 hover:bg-slate-100 flex flex-col items-center justify-start cursor-pointer"
                                      key={skill.id}
                                    >
                                      <img
                                        className="w-[40px] h-[40px]"
                                        src={skill.iconUrl}
                                      />
                                      <h1>{skill.name}</h1>
                                    </div>
                                  );
                                })
                              ) : (
                                <h1>NONE</h1>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-row justify-between items-end mt-4">
                            <div
                              className="flex flex-col justify-center items-center cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/view/organization/${listing.organizations.id}`
                                )
                              }
                            >
                              <h1 className="font-bold">Created By:</h1>
                              <h1>{listing.organizations.name}</h1>
                              <img
                                src={listing.organizations.thumbnail.storageId}
                                className="w-[60px] h-[60px]"
                              ></img>
                            </div>
                            <div>
                              {userStatus &&
                              userId == listing.organizations.creator ? (
                                <div className="flex flex-col gap-4 items-center">
                                  <Button
                                    onClick={() =>
                                      router.push(
                                        `/edit/${listing.listings.id}`
                                      )
                                    }
                                    className="bg-blue-500 text-white hover:bg-blue-400 w-full"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      deleteSpecificListing(listing.listings.id)
                                    }
                                    variant="destructive"
                                    className="w-full"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              ) : !userStatus &&
                                userId != listing.organizations.creator ? (
                                <Button
                                  onClick={() =>
                                    volunteerSpecificListing(
                                      listing.listings.id
                                    )
                                  }
                                  disabled={listing.volunteers.some(
                                    (vol: any) => vol.id == userId
                                  )}
                                >
                                  {listing.volunteers.some(
                                    (vol: any) => vol.id == userId
                                  )
                                    ? "You have already volunteered for this"
                                    : "Volunteer for This Opportunity"}
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <h1 className="text-center font-bold w-full mt-6 text-xl">
                  NO LISTINGS
                </h1>
              )}
            </div>
            <div className="w-full xl:flex-1 p-4">
              <MapMultipleLocations listings={listings} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
