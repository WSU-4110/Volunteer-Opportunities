"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

type ListingsProps =
  | {
      name: string;
      description: string;
      thumbnail: string | null;
      id: string;
      createdAt: Date;
      organizationId: string;
      skills: {
        skillId: string;
        listingId: string;
        skills: {
          name: string;
          id: string;
          iconUrl: string;
        };
      }[];
    }[]
  | null;

type Skill = {
  id: string;
  name: string;
  iconUrl: string;
  hidden?: boolean;
};

type SkillsProps = Skill[];

export default function Userpage({
  initialListings,
  skills,
}: {
  initialListings: ListingsProps;
  skills: Skill[];
}) {
  const [skillOptions, setSkillOptions] = useState<Skill[]>(
    skills.map((skill) => {
      return { ...skill, hidden: false };
    })
  );
  const [filterSkills, setFilterSkills] = useState<Skill[]>([]);

  const [currentSkill, setCurrentSkill] = useState("");

  const [listings, setListings] = useState(initialListings);
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

  async function onSubmit(values: z.infer<typeof formSchema>) {}

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
                          {skillOptions.map((skill) =>
                            !skill.hidden ? (
                              <SelectItem value={skill.id} key={skill.id}>
                                {skill.name}
                              </SelectItem>
                            ) : null
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                    <Button
                      type="submit"
                      onClick={() => handleSkillOptionSubmit(currentSkill)}
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
                          <Input placeholder="Listing Title" {...field} />
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
                          <Input placeholder="Organization Name" {...field} />
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
            <div className="xl:flex-3 p-20 bg-white shadow-lg rounded-xl">
              <h1 className="text-2xl font-bold text-center">Listings</h1>
              <div className="grid grid-cols-2 flex-wrap max-h-[1000px] overflow-y-auto mt-5 gap-4">
                {listings?.map((listing) => (
                  <Card key={listing.id} className="p-10">
                    <h1 className="font-bold text-center text-xl">
                      {listing.name}
                    </h1>
                    <img
                      className="w-full h-[200px] object-cover"
                      src={listing.thumbnail || ""}
                      alt={listing.name}
                    />
                  </Card>
                ))}
              </div>
            </div>
            <div className="w-full xl:flex-1 p-4">
              <MapMultipleLocations />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
