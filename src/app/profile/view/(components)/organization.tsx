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

import { Card } from "@/components/ui/card";

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
// exported schema for testing
export const orgSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  bio: z.string().min(1, "Bio is required"),
});

const EditOrgPage = ({ ...props }: any) => {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({
    longitude: parseFloat(props.organizations[props.org.pos].longitude) || 0,
    latitude: parseFloat(props.organizations[props.org.pos].latitude) || 0,
  });
  const [validAddressSelected, setValidAddressSelected] = useState(true);

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
    try {
      const form: FormData = new FormData();

      if (files.length > 0) {
        const data: File = await files[0];
        form.append("data", data);
      }
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
      });

      revalidatePathAction();
      props.setEditProfile(false);
    } catch (error) {}
  }

  // Use state for image upload
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const [editImage, setEditImage] = useState<boolean>(false);
  return (
    <div>
      <div>
        {editImage ? (
          <div>
            <div className="h-[320px]">
              <FileUpload onChange={handleFileUpload} />
            </div>
            <Button
              onClick={() => {
                setFiles([]);
                setEditImage(false);
              }}
              type="button"
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div>
            <img
              src={props.organizations[props.org.pos].image.storageId}
              alt="Organization Profile Picture"
              className="m-auto rounded-xl"
              width="250px"
              height="250px"
            />
            <Button
              onClick={() => {
                setEditImage(true);
              }}
              type="button"
            >
              Edit
            </Button>
          </div>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <Button type="submit" data-testid="submit">
              Submit
            </Button>
            <Button
              onClick={() => props.setEditProfile(false)}
              type="button"
              variant="destructive"
              data-testid="cancel"
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
    <div>
      <div className="w-full m-auto mt-10">
        <img
          src={props.organizations[props.org.pos].image.storageId}
          alt="Organization Profile Picture"
          className="m-auto rounded-xl"
          width="250px"
          height="250px"
        />
      </div>

      <table>
        <tbody>
          <tr>
            <td className="p-2">
              <Label className="align-text-top" htmlFor="name">
                Company Name:&nbsp;
              </Label>
            </td>
            <td className="p-2">
              <p id="name" className="align-text-top">
                {props.organizations[props.org.pos].name}
              </p>
            </td>
          </tr>

          <tr>
            <td className="p-2">
              <Label className="align-text-top" htmlFor="email">
                Email Address:&nbsp;
              </Label>
            </td>
            <td className="p-2">
              <p id="email" className="align-text-top">
                {props.organizations[props.org.pos].email}
              </p>
            </td>
          </tr>

          <tr>
            <td className="p-2">
              <Label className="align-text-top" htmlFor="bio">
                Biography:&nbsp;
              </Label>
            </td>
            <td className="p-2">
              <p id="bio" className="align-text-top">
                {props.organizations[props.org.pos].bio}
              </p>
            </td>
          </tr>

          <tr>
            <td className="p-2">
              <Label className="align-text-top" htmlFor="address">
                Address:&nbsp;
              </Label>
            </td>
            <td className="p-2">
              <p id="address" className="align-text-top">
                {props.organizations[props.org.pos].address}
              </p>
            </td>
          </tr>

          <tr>
            <td className="p-2">
              <Label className="align-text-top" htmlFor="phone">
                Phone:&nbsp;
              </Label>
            </td>
            <td className="p-2">
              <p id="phone" className="align-text-top">
                {"+" +
                  props.organizations[props.org.pos].phoneNumber.slice(0, 1) +
                  " (" +
                  props.organizations[props.org.pos].phoneNumber.slice(1, 4) +
                  ") " +
                  props.organizations[props.org.pos].phoneNumber.slice(4, 7) +
                  "-" +
                  props.organizations[props.org.pos].phoneNumber.slice(7, 11)}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      {props.listings[props.org.pos][0].length > 0 ? (
        <>
          <Label htmlFor="listing" data-testid="listings">
            Listings:
          </Label>
          <div id="listing">
            {/* This is not a real error the key listing.id will always unique to that listing */}
            {props.listings[props.org.pos][0].map((opportunity: any) => (
              <div key={opportunity.id}>
                <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-4">
                    <img
                      src={opportunity.thumbnail || ""}
                      alt={opportunity.name}
                      className="rounded-md object-cover w-[70px] h-[70px]"
                    />
                    <div className="flex flex-col">
                      <h3 className="font-bold text-gray-800">
                        {opportunity.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {opportunity.description}
                      </p>
                    </div>
                  </div>
                </Card>
                <br />
              </div>
            ))}
          </div>
        </>
      ) : null}

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
        props.setEditProfile(false);
        revalidatePathAction();
        break;
      }
    }
  }

  return (
    <div className="w-1/2 m-auto mt-20 bg-white p-8 rounded-lg shadow-md">
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
