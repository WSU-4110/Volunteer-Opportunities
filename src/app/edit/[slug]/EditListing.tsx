"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { revalidateListing, updateListingWithTalent } from "./actions";
import { revalidatePath } from "next/cache";

export default function EditListing({
  listing,
  talents,
}: {
  listing: {
    description: string;
    id: string;
    name: string;
    thumbnail: string | null;
    organizationId: string;
  };
  talents: string[];
}) {
  const formSchema = z.object({
    id: z.string(),
    name: z.string(),
    organizationId: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    talent: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: listing.id,
      name: listing.name,
      organizationId: listing.organizationId,
      description: listing.description,
      thumbnail: listing.thumbnail == null ? "" : listing.thumbnail,
      talent: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateListingWithTalent(
      values.id,
      values.name,
      values.description,
      values.thumbnail,
      values.organizationId,
      values.talent
    );

    revalidateListing(values.id);
  }

  return (
    <>
      <div className="w-[50%] mx-auto my-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Name of your listing</FormDescription>
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
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Organization that is behind carrying out this opportunity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe what you wish to accomplish with this volunteer
                    activity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Insert an image to give volunteers an idea of what they are
                    signing up for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="talent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Talent</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Talent you wish to add/remove to listing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
