"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./fileUpload";
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
import { Input } from "@/components/ui/input";
import ClipLoader from "react-spinners/ClipLoader";
import {
  addOrganization,
  revalidatePathAction,
  revalidateOrganizationViewerPage,
} from "@/app/profile/view/actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";

export default function AddAnOrganization(props: any) {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({ longitude: 0, latitude: 0 });
  const [validAddressSelected, setValidAddressSelected] = useState(false);
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
      name: "",
      email: "",
      address: "",
      phoneNumber: "",
      bio: "",
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

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
    if (!validAddressSelected) {
      form.setError("address", {
        type: "manual",
        message:
          "Please select an address from the dropdown of options, so that we know its a valid address.",
      });
      return;
    }
    try {
      const data: File = files[0];
      const formData = new FormData();
      formData.append("data", data);

      const [organization] = await addOrganization({
        name: values.name,
        data: formData,
        coordinates: coordinates,
        bio: values.bio,
        phoneNumber: values.phoneNumber,
        email: values.email,
        address: values.address,
      });

      revalidatePathAction();
      if (organization) {
        revalidateOrganizationViewerPage(organization[0].id);
      }
      props.addOrganization(false);
    } catch (error) {
      console.error("Error during submission", error);
    }
  }

  return (
    <div className="bg-slate-200 py-12">
      <div className="w-1/2 m-auto mt-20 bg-white p-8 rounded-lg shadow-md">
        <header className="text-3xl text-center font-semibold text-gray-800">
          Add an Organization
        </header>
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
                  <FormDescription>
                    Choose your organization name
                  </FormDescription>
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
                onClick={() => props.addOrganization(false)}
                type="button"
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
