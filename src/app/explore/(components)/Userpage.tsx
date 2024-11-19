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
import {
  revalidateIndividualListing,
  revalidateListingPaths,
} from "@/app/edit/[slug]/actions";
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
    revalidateIndividualListing(listingId);
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
          Explore Volunteer Opportunities
        </h1>
        <div className="w-full xl:flex-1 p-4">
          <MapMultipleLocations listings={listings} />
        </div>
      </div>
    </>
  );
}
