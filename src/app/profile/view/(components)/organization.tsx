"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

//From https://ui.shadcn.com/docs/components/form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateOrganization } from "../actions";
import {
  revalidatePathAction,
  revalidateOrganizationViewerPage,
} from "@/app/profile/view/actions";
import { FileUpload } from "./fileUpload";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";

type input = {
  organizations: {
    id: string;
    name: string;
    image: unknown;
  }[];

  listings: any;
  editProfile: boolean;
  setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

type choice = {
  id: string;
  pos: number;
};

const formSchema = z.object({
  id: z.string(),
});

const EditOrgPage = ({ ...props }: any) => {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({
    longitude: parseFloat(props.organizations[props.org.pos].longitude) || 0,
    latitude: parseFloat(props.organizations[props.org.pos].latitude) || 0,
  });
  const [validAddressSelected, setValidAddressSelected] = useState(true);
  const orgSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
    bio: z.string().min(1, "Bio is required"),
  });

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: props.organizations[props.org.pos].name,
      email: props.organizations[props.org.pos].email,
      address: props.organizations[props.org.pos].address,
      phoneNumber: props.organizations[props.org.pos].phoneNumber,
      bio: props.organizations[props.org.pos].bio,
    },
  });

  const address = form.watch("address");
  const phoneNumber = form.watch("phoneNumber");
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
  async function onSubmit(values: z.infer<typeof orgSchema>) {
    //console.log("submit");
    try {
      const form: FormData = new FormData();
      console.log(files);
      if (files.length > 0) {
        const data: File = await files[0];
        form.append("data", data);
      }
      console.log("Submit");
      console.log(coordinates);

      console.log(
        await updateOrganization({
          picture: props.organizations[props.org.pos].image.storageId,
          name: values.name,
          id: props.org.id,
          data: form,
          coordinates: coordinates,
          bio: values.bio,
          phoneNumber: values.phoneNumber,
          email: values.email,
          address: values.address,
        })
      );

      revalidatePathAction();
      props.setEditProfile(false);
    } catch (error) {}
  }

  // Use state for image upload
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    //console.log(files);
  };
  console.log(coordinates);
  return (
    <div>
      <div className="w-1/2 m-auto mt-20">
        <div className="w-full m-auto mt-10">
          <img
            src={props.organizations[props.org.pos].image.storageId}
            alt="Organization Profile Picture"
            className="m-auto rounded-xl"
            width="400px"
            height="400px"
          />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FileUpload onChange={handleFileUpload} />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="Organization Name" {...field} />
                </FormControl>
                <FormDescription>Choose your organization name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormDescription>
                  Link an email address to your organization
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Biography</FormLabel>
                <FormControl className="w-full">
                  <Textarea
                    placeholder="Enter your organization biography here"
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
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={(value) => form.setValue("phoneNumber", value)}
                    containerClass="w-full text-sm"
                    inputClass="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-start gap-4">
            <Button type="submit">Submit</Button>
            <Button
              onClick={() => props.setEditProfile(false)}
              type="button"
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ViewOrgPage = (props: any) => {
  return (
    <div className="w-1/2 m-auto mt-20">
      <div className="w-full m-auto mt-10">
        <img
          src={props.organizations[props.org.pos].image.storageId}
          alt="Organization Profile Picture"
          className="m-auto rounded-xl"
          width="400px"
          height="400px"
        />
      </div>
      <br />
      <Label className={cn("flex h-10")} htmlFor="name">
        Company Name:
      </Label>
      <p id="name">{props.organizations[props.org.pos].name}</p>
      <br />
      <Label htmlFor="listings">Listings:</Label>
      <div id="listings">
        {props.listings[props.org.pos][0].map(
          (listing: { id: string; name: string; description: string }) => (
            <div key={listing.id}>
              <p>{listing.name}</p>
              <p>{listing.description}</p>
            </div>
          )
        )}
      </div>

      <Button
        onClick={() => {
          props.setEditProfile(true);
        }}
        type="button"
      >
        Edit
      </Button>
    </div>
  );
};

export default function Organization(props: input) {
  //From https://ui.shadcn.com/docs/components/form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props.organizations[0].id,
    },
  });
  const [org, setOrg] = useState<choice>({
    id: props.organizations[0].id,
    pos: 0,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    for (let i = 0; i < props.organizations.length; i++) {
      if (props.organizations[i].id == values.id) {
        setOrg({ id: values.id, pos: i });
        revalidatePathAction();
        break;
      }
    }
  }

  return (
    <div className="w-1/2 m-auto mt-20">
      <header className="text-2xl text-center font-bold">
        Organization Page
      </header>
      <>
        {props.organizations.length > 1 && props.organizations != undefined ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {props.organizations.map(
                          (org: { id: string; name: string }) => (
                            <SelectItem value={org.id} key={org.id} id={org.id}>
                              {org.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Select</Button>
            </form>
          </Form>
        ) : (
          <></>
        )}
        <>
          {props.editProfile ? (
            <EditOrgPage
              setEditProfile={props.setEditProfile}
              org={org}
              organizations={props.organizations}
              listings={props.listings}
            />
          ) : (
            <ViewOrgPage
              setEditProfile={props.setEditProfile}
              org={org}
              organizations={props.organizations}
              listings={props.listings}
            />
          )}
        </>
      </>
    </div>
  );
}
