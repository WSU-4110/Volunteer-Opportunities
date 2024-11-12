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

const CreateListing = ({
  organizations,
}: {
  organizations: Organizations[] | null;
}) => {
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    organizationId: z.string(),
    description: z.string().min(1, "description is required"),
    thumbnail: z.string().min(1, "organization image is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organizationId: "",
      description: "",
      thumbnail: "",
    },
  });

  const orgId = form.watch("organizationId");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createListingAction({ ...values });
  }

  return (
    <div className="m-auto w-1/2 my-10">
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
          <Button type="submit" disabled={orgId == ""}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateListing;
