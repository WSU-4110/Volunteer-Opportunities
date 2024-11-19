"use client";

import { useForm } from "react-hook-form";
import { createListingAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Organizations } from "@/database/schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { FileUpload } from "@/app/profile/view/(components)/fileUpload";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Skill = {
  name: string;
  id: string;
  iconUrl: string;
};

const CreateListing = ({
  organizations,
  allSkills,
}: {
  organizations: Organizations[] | null;
  allSkills: {
    name: string;
    id: string;
    iconUrl: string;
  }[];
}) => {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [validAddressSelected, setValidAddressSelected] = useState(false);
  const [acceptedSkills, setAcceptedSkills] = useState<typeof allSkills>([]);
  const [skillOptions, setSkillOptions] = useState(allSkills);
  const [currentSkill, setCurrentSkill] = useState("");

  const router = useRouter();
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    organizationId: z.string(),
    description: z.string().min(1, "description is required"),
    address: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organizationId: "",
      description: "",
      address: "",
    },
  });

  const address = form.watch("address");

  const [open, setOpen] = useState(false);
  const commandRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const orgId = form.watch("organizationId");

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    if (!validAddressSelected) {
      form.setError("address", {
        type: "manual",
        message:
          "Please select an address from the dropdown of options, so that we know its a valid address.",
      });
      return;
    }

    if (files.length > 0) {
      const data: File = files[0];
      const formData = new FormData();
      formData.append("data", data);
      await createListingAction({
        ...values,
        thumbnail: formData,
        skills: acceptedSkills.map((skill) => skill.id),
        coordinates: coordinates,
      });
    } else {
      await createListingAction({
        ...values,
        skills: acceptedSkills.map((skill) => skill.id),
        coordinates: coordinates,
      });
    }

    router.push("/explore");
  };

  const handleSelectAddress = (suggestion: any) => {
    form.setValue("address", suggestion.place_name);
    console.log(suggestion.geometry.coordinates[0]);
    console.log(suggestion.geometry.coordinates[1]);
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

    setAcceptedSkills((prevState) => [...prevState, { ...selectedSkill }]);
    setCurrentSkill("");
  };

  const handleSkillFilterRemove = (newSkill: Skill) => {
    setSkillOptions((prevState) => {
      return [...prevState, newSkill];
    });

    setAcceptedSkills((prevState) => [
      ...prevState.filter((skill) => skill.id != newSkill.id),
    ]);
  };

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

  return (
    <div className="bg-slate-200 py-12">
      <div className="w-1/2 m-auto bg-white p-8 rounded-lg shadow-md">
        <header className="text-3xl text-center font-semibold text-gray-800">
          Create a Listing
        </header>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmitHandler)();
            }}
            className="space-y-8"
          >
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <div key={skill.id} className="hover:bg-slate-100">
                    <div className="p-2 hover:bg-slate-100 flex flex-row gap-2 items-center justify-center">
                      <img className="w-[40px] h-[40px]" src={skill.iconUrl} />
                      <h1>{skill.name}</h1>
                      <Button
                        className="h-fit p-2 bg-white hover:bg-red-100"
                        onClick={() => handleSkillFilterRemove(skill)}
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
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateListing;
