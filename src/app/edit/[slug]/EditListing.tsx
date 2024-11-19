"use client";

import { Textarea } from "@/components/ui/textarea";

import { revalidateIndividualListing, updateListing } from "./actions";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/app/profile/view/(components)/fileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { revalidatePathAction } from "@/app/profile/view/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function EditListing({
  listing,
  organizations,
  allSkills,
}: {
  listing: {
    description: string;
    id: string;
    name: string;
    thumbnail: string | null;
    organizationId: string;
    address: string | null;
    skills: any;
    latitude: string | null;
    longitude: string | null;
  };
  organizations:
    | {
        email: string | null;
        id: string;
        name: string;
        bio: string | null;
        createdAt: Date;
        thumbnail: unknown;
        creator: string;
        images: unknown;
        address: string | null;
        phoneNumber: string | null;
        latitude: string | null;
        longitude: string | null;
      }[]
    | null;
  allSkills: {
    name: string;
    id: string;
    iconUrl: string;
  }[];
}) {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({
    longitude: parseFloat(listing.longitude || "0"),
    latitude: parseFloat(listing.latitude || "0"),
  });
  const [validAddressSelected, setValidAddressSelected] = useState(true);
  const [acceptedSkills, setAcceptedSkills] = useState(listing.skills);
  const [skillOptions, setSkillOptions] = useState(() => {
    const listingSkillIds = new Set(
      listing.skills.map((skill: any) => {
        return skill.skills.id;
      })
    );
    return allSkills.filter((skill) => !listingSkillIds.has(skill.id));
  });
  const [currentSkill, setCurrentSkill] = useState("");

  const router = useRouter();

  const orgSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    description: z.string().min(1, "Description is required"),
    organizationId: z.string(),
  });

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: listing.name,
      description: listing.description,
      address: listing.address || "",
      organizationId: listing.organizationId,
    },
  });

  const handleSkillFilterRemove = (newSkill: any) => {
    setSkillOptions((prevState) => {
      return [...prevState, newSkill];
    });

    setAcceptedSkills((prevState: any) => [
      ...prevState.filter((skill: any) => skill.skills.id != newSkill.id),
    ]);
  };

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const address = form.watch("address");
  const [open, setOpen] = useState(false);
  const commandRef = useRef<HTMLInputElement>(null);

  // Auto-suggest address from Mapbox API
  useEffect(() => {
    const fetchSuggestions = async (query: string) => {
      const params = new URLSearchParams({
        access_token: process.env.NEXT_PUBLIC_GL_MAPBOX_ACCESS_TOKEN || "",
        autocomplete: "true",
        types: "address,place",
        limit: "5",
      });
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json/?${params.toString()}`
        );
        const data = await response.json();
        setAddressSuggestions(data.features);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const intervalId = setTimeout(() => {
      if (open && address) {
        fetchSuggestions(address);
      } else {
        setAddressSuggestions([]);
      }
    }, 1000);

    return () => clearTimeout(intervalId);
  }, [address, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(e.target as Node)
      ) {
        setOpen(false); // Close suggestions when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectAddress = (suggestion: any) => {
    form.setValue("address", suggestion.place_name);
    setValidAddressSelected(true);
    setCoordinates({
      longitude: suggestion.geometry.coordinates[0],
      latitude: suggestion.geometry.coordinates[1],
    });
    setAddressSuggestions([]);
    setOpen(false);
  };

  const handleSkillOptionSelect = (id: string) => {
    setCurrentSkill(id);
  };

  const handleSkillOptionSubmit = (id: string) => {
    const selectedSkill = allSkills.find((skill) => skill.id == id);

    if (!selectedSkill) {
      return;
    }

    setSkillOptions((prevState) => [
      ...prevState.filter((skill) => skill.id != id),
    ]);

    setAcceptedSkills((prevState: any) => [
      ...prevState,
      { skills: { ...selectedSkill } },
    ]);
    setCurrentSkill("");
  };

  async function onSubmit(values: z.infer<typeof orgSchema>) {
    if (!validAddressSelected) {
      form.setError("address", {
        type: "manual",
        message:
          "Please select an address from the dropdown of options, so that we know its a valid address.",
      });
      return;
    }
    try {
      if (files.length > 0) {
        const data: File = files[0];
        const formData = new FormData();
        formData.append("data", data);
        await updateListing({
          ...values,
          coordinates: coordinates,
          data: formData,
          listingID: listing.id,
          skills: acceptedSkills.map((skill: any) => skill.skills.id),
        });
      } else {
        await updateListing({
          ...values,
          coordinates: coordinates,
          listingID: listing.id,
          skills: acceptedSkills.map((skill: any) => skill.skills.id),
        });
      }

      revalidatePathAction();
      revalidateIndividualListing(listing.id);

      router.push("/explore");
    } catch (error) {
      console.error("Error during submission", error);
    }
  }
  return (
    <>
      <div className="bg-slate-200 py-12">
        <div className="w-1/2 m-auto bg-white p-8 rounded-lg shadow-md">
          <header className="text-3xl text-center font-semibold text-gray-800">
            Edit Your Listing
          </header>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FileUpload onChange={handleFileUpload} />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Listing Title" {...field} />
                    </FormControl>
                    <FormDescription>Choose your listing title</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl className="w-full">
                      <Textarea
                        placeholder="Enter your listing description"
                        className="resize-none w-full"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations &&
                            organizations.map((org) => (
                              <SelectItem value={org.id} key={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Organization that is behind carrying out this opportunity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-center gap-4 w-full">
                <FormItem>
                  <FormLabel>Add or Remove Skills From the Listing</FormLabel>
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
                <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
                  {acceptedSkills.map((skill: any) => (
                    <div key={skill.skills.id} className="hover:bg-slate-100">
                      <div className="p-2 hover:bg-slate-100 flex flex-row gap-2 items-center justify-center">
                        <img
                          className="w-[40px] h-[40px]"
                          src={skill.skills.iconUrl}
                        />
                        <h1>{skill.skills.name}</h1>
                        <Button
                          className="h-fit p-2 bg-white hover:bg-red-100"
                          onClick={() => handleSkillFilterRemove(skill.skills)}
                          variant="outline"
                          type="button"
                        >
                          X
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl className="w-full">
                      <Command className="mt-4">
                        <CommandInput
                          id="address-input"
                          placeholder="Enter an address"
                          {...form.register("address")}
                          onFocus={() => setOpen(true)}
                          onInput={(e) => {
                            form.setValue("address", (e.target as any).value);
                            setValidAddressSelected(false);
                          }}
                          value={address}
                          ref={commandRef}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {open && <p>No suggestions found.</p>}
                          </CommandEmpty>
                          <CommandGroup>
                            {addressSuggestions.map((suggestion, index) => (
                              <CommandItem
                                key={index}
                                onSelect={() =>
                                  handleSelectAddress(suggestion as any)
                                }
                                className="cursor-pointer"
                              >
                                {(suggestion as any).place_name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.address?.message}
                    </FormMessage>{" "}
                    {/* Render error message here */}
                  </FormItem>
                )}
              />
              <div className="flex justify-start gap-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
