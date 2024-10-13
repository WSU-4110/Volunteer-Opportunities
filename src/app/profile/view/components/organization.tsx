"use client";
import React from "react";
import { useForm } from "react-hook-form";
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
import { revalidatePathAction } from "@/app/profile/view/actions";
import { FileUpload } from "./fileUpload";

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
  const orgSchema = z.object({
    name: z.string(),
  });

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: props.organizations[props.org.pos].name,
    },
  });
  async function onSubmit(values: z.infer<typeof orgSchema>) {
    console.log("submit");
    try {
      const data: File = await files[0];

      console.log("Submit");
      console.log(data);
      const form: FormData = new FormData();
      form.append("data", data);

      await updateOrganization({
        picture: props.organizations[props.org.pos].image.storageId,
        name: values.name,
        id: props.org.id,
        data: form,
      });

      revalidatePathAction();
      props.setEditProfile(false);
    } catch (error) {}
  }

  // Use state for image upload
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div>
      <div className="w-full m-auto mt-10">
        <img
          src={props.organizations[props.org.pos].image.storageId}
          alt="Organization Profile Picture"
          className="m-auto rounded-xl"
        />
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
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>Change your organization name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <table>
            <tbody>
              <tr>
                <td>
                  <Button type="submit">Submit</Button>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      props.setEditProfile(false);
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
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
                          <SelectValue placeholder="id" />
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
