"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import useUserStatusStore from "@/stores/userStatusStore";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import {
  getOtherVolunteersAction,
  getOtherOrganizationsAction,
} from "./actions";
import { User, Organizations } from "@/database/schema";
import ClipLoader from "react-spinners/ClipLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaArrowRightLong } from "react-icons/fa6";
import { startNewUserToUserConversation } from "./actions";
import { useRouter } from "next/navigation";

const InitializeMessageComponent = ({
  authStatus,
  userStatus,
  setUserMessageId,
  userMessageId,
}: {
  userMessageId: any;
  setUserMessageId: (id: string) => void;
  authStatus: Session;
  userStatus: boolean;
}) => {
  const [orgTabClicked, setOrgTabClicked] = useState(userStatus);

  const [messagesOthers, setMessageOthers] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const changePersonSelection = (id: any) => {
    setMessageOthers((prevState: any) => {
      const updatedUsers = prevState.map((user: any) => {
        if (user.id == id) {
          return { ...user, selected: !user.selected };
        } else {
          return { ...user, selected: false };
        }
      });
      return updatedUsers;
    });
  };

  const getAllVolunteers = async () => {
    setLoading(true);
    const otherUsers = await getOtherVolunteersAction();

    if (otherUsers[0]) {
      const usersWithSelected = otherUsers[0].map((user) => ({
        ...user,
        selected: false,
      }));
      setMessageOthers(usersWithSelected);
    }

    setUserMessageId("");
    setLoading(false);
  };

  const getAllOrganizations = async () => {
    setLoading(true);
    const otherOrganizations = await getOtherOrganizationsAction();

    if (otherOrganizations[0]) {
      const organizationsWithSelected = otherOrganizations[0].map((org) => ({
        ...org,
        selected: false,
      }));
      setMessageOthers(organizationsWithSelected);
    }

    setUserMessageId("");
    setLoading(false);
  };

  useEffect(() => {
    if (orgTabClicked) {
      getAllOrganizations();
    } else {
      getAllVolunteers();
    }
  }, [userStatus, orgTabClicked]);

  const handleMessageClicked = () => {
    setUserMessageId(
      messagesOthers.find((user: any) => {
        return user.selected;
      })
    );
  };
  return (
    <MaxWidthWrapper>
      <div className="w-full m-auto mt-20">
        <div className="flex flex-col items-center gap-2 justify-center w-fit m-auto">
          <img
            src={authStatus.user.image || ""}
            alt={`${authStatus.user.name}'s image`}
            className="rounded-full"
            width={"100px"}
            height={"100px"}
          />
          <h1 className="text-center w-full font-bold text-xl">
            {authStatus.user.name}
          </h1>
        </div>

        <div className="flex flex-row justify-start items-center w-full">
          <div className="flex flex-col justify-start items-center mt-10 w-full">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-1/2 m-auto grid-cols-2">
                <TabsTrigger value="users" onClick={getAllVolunteers}>
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="organizations"
                  onClick={getAllOrganizations}
                >
                  Organizations
                </TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                {messagesOthers.map((otherUser: any) => {
                  return (
                    <div
                      className="grid grid-cols-3 gap-4 justify-start items-center mt-20"
                      key={otherUser.id}
                    >
                      <Card
                        className={`p-4 shadow-lg cursor-pointer ${otherUser.selected ? "bg-slate-400" : ""}`}
                        onClick={() => changePersonSelection(otherUser.id)}
                      >
                        <div className="flex flex-col gap-4 items-center justify-center w-full">
                          <div className="flex flex-col w-full justify-between gap-4 text-center">
                            <div className="flex flex-col gap-1 justify-start items-center">
                              <img
                                src={otherUser.image}
                                width={"100px"}
                                height={"100px"}
                                className="mb-0 mt-0 m-auto"
                              />
                              <h1>{otherUser.name}</h1>
                            </div>
                            <div className="flex-1 text-center">
                              <h1>Activities this user has participated in:</h1>
                              <div className="flex flex-row m-4 overflow-y-scroll shadow-lg max-h-[200px]">
                                {otherUser.listings.map((listings: any) => {
                                  return (
                                    <Card
                                      className={`w-full p-5 bg-inherit border-none`}
                                      key={listings.listingId}
                                    >
                                      <div className="flex flex-row justify-between items-center gap-3">
                                        <img
                                          width={"100px"}
                                          height={"100px"}
                                          src={listings.listings.thumbnail}
                                          className="object-cover"
                                        />
                                        <div className="flex flex-col font-normal text-center justify-between items-center gap-3">
                                          <div>
                                            <h1 className="font-medium text-xl">
                                              {listings.listings.name}
                                            </h1>
                                            <br />
                                            <p>
                                              {listings.listings.description}
                                            </p>
                                          </div>
                                          <div className="flex flex-row justify-end items-center w-full">
                                            <h1 className="font-bold">
                                              {
                                                listings.listings.organizations
                                                  .name
                                              }
                                            </h1>
                                            <img
                                              src={
                                                listings.listings.organizations
                                                  .thumbnail.storageId
                                              }
                                              width={"70px"}
                                              height={"70px"}
                                              className="object-cover"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-underline">
                            <h1 className="font-bold">Talents</h1>
                            <ul className="flex flex-row gap-2 font-normal">
                              {otherUser.skills.map((skill: any) => {
                                return (
                                  <li key={skill.skillId}>
                                    - {skill.skills.name}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </TabsContent>
              <TabsContent value="organizations"></TabsContent>
            </Tabs>
            {messagesOthers.some((user: any) => {
              return user.selected;
            }) ? (
              <div className="w-fit m-auto mt-5">
                <Button onClick={handleMessageClicked}>
                  Start a Conversation
                </Button>
              </div>
            ) : null}
            <div className="w-full flex flex-row items-center justify-center mt-20">
              {loading ? <ClipLoader /> : null}
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const MessagesClient = ({ authStatus }: { authStatus: Session }) => {
  const { userStatus } = useUserStatusStore((state) => state);

  const [userMessageId, setUserMessageId] = useState<any>({});

  const formSchema = z.object({
    subject: z.string().min(2, {
      message: "Subject must be at least 2 characters.",
    }),
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startNewUserToUserConversation({
      ...values,
      senderId: authStatus.user.id,
      receiverId: userMessageId.id,
    });
    setUserMessageId({});
  }

  return (
    <>
      {!userMessageId.id ? (
        <InitializeMessageComponent
          userStatus={userStatus}
          userMessageId={userMessageId}
          authStatus={authStatus}
          setUserMessageId={setUserMessageId}
        />
      ) : (
        <MaxWidthWrapper>
          <div className="w-1/2 m-auto">
            <div className="flex flex-row items-center justify-center">
              <div className="flex flex-col items-center gap-2 justify-center w-fit m-auto">
                <img
                  src={authStatus.user.image || ""}
                  alt={`${authStatus.user.name}'s image`}
                  className="rounded-full"
                  width={"100px"}
                  height={"100px"}
                />
                <h1 className="text-center w-full font-bold text-xl">
                  {authStatus.user.name}
                </h1>
              </div>
              <FaArrowRightLong />
              <div className="flex flex-col items-center gap-2 justify-center w-fit m-auto">
                <img
                  src={userMessageId.image || ""}
                  alt={`${userMessageId.name}'s image`}
                  className="rounded-full"
                  width={"100px"}
                  height={"100px"}
                />
                <h1 className="text-center w-full font-bold text-xl">
                  {userMessageId.name}
                </h1>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Lets Make the World a Better Place Together"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be the subject that your conversation with
                        this other user will start with. This can be changed
                        later.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </MaxWidthWrapper>
      )}
    </>
  );
};

export default MessagesClient;
