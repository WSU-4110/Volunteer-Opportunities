"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import useUserStatusStore from "@/stores/userStatusStore";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import {
  getOtherVolunteersAction,
  getOtherOrganizationsAction,
  startNewUserToOrgConversation,
  startNewOrgToOrgConversation,
  startNewOrgToUserConversation,
} from "./actions";
import { User, Organizations } from "@/database/schema";
import ClipLoader from "react-spinners/ClipLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CustomCarouselPrevious,
  CustomCarouselNext,
  CustomCarousel,
} from "@/components/ui/carousel";
import Messaging from "./messaging";

const InitializeMessageComponent = ({
  authStatus,
  userStatus,
  setUserMessageId,
  userMessageId,
  otherOrganizations,
  userOrganizations,
  currentOrganizationSelected,
  increaseOrgSelected,
  decreaseOrgSelected,
  messagesLoading,
  setMessagesLoadingTrue,
  setMessagesLoadingFalse,
}: {
  userMessageId: any;
  setUserMessageId: (id: string) => void;
  authStatus: Session;
  userStatus: boolean;
  otherOrganizations: Organizations[];
  userOrganizations: Organizations[];
  currentOrganizationSelected: number;
  increaseOrgSelected: () => void;
  decreaseOrgSelected: () => void;
  messagesLoading: boolean;
  setMessagesLoadingTrue: () => void;
  setMessagesLoadingFalse: () => void;
}) => {
  const [messagesOthers, setMessageOthers] = useState<any>([]);
  const [organizationMessages, setOrganizationMessages] = useState<any>([]);

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

  const changeOrganizationSelection = (id: any) => {
    setOrganizationMessages((prevState: any) => {
      const updatedUsers = prevState.map((user: any) => {
        console.log(user);
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
    setUserMessageId("");
    const [otherUsers, error] = await getOtherVolunteersAction();

    if (otherUsers) {
      const usersWithSelected = otherUsers.map((user) => ({
        ...user,
        selected: false,
      }));

      setMessageOthers(usersWithSelected);
    }
  };

  const getAllOrganizations = async () => {
    const [otherOrganizations, error] = await getOtherOrganizationsAction();

    if (otherOrganizations) {
      const organizationsWithSelected = otherOrganizations.map((org) => ({
        ...org,
        selected: false,
      }));

      setOrganizationMessages(organizationsWithSelected);
    }
    setUserMessageId("");
  };

  const handleMessageClicked = (type: string) => {
    if (type == "organization") {
      setUserMessageId({
        ...organizationMessages.find((user: any) => {
          return user.selected;
        }),
        type: type,
      });
    } else if (type == "volunteer")
      setUserMessageId({
        ...messagesOthers.find((user: any) => {
          return user.selected;
        }),
        type: type,
      });
  };
  return (
    <MaxWidthWrapper>
      <div className="w-full m-auto my-20">
        {userStatus ? (
          <CustomCarousel className="w-1/2 xl:w-fit m-auto select-none">
            <CarouselContent>
              {userOrganizations.map((org, index) => (
                <CarouselItem key={org.id}>
                  <div className="flex flex-col items-center gap-2 justify-center w-fit m-auto ">
                    <img
                      src={(org.thumbnail as any).storageId || ""}
                      alt={`${org.name}'s image`}
                      className="rounded-full w-[100px] h-[100px]"
                    />
                    <h1 className="text-center w-full font-bold text-xl">
                      {org.name}
                    </h1>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CustomCarouselPrevious extraClick={decreaseOrgSelected} />
            <CustomCarouselNext extraClick={increaseOrgSelected} />
          </CustomCarousel>
        ) : (
          <div className="flex flex-col items-center gap-2 justify-center w-fit m-auto select-none">
            <img
              src={authStatus.user.image || ""}
              alt={`${authStatus.user.name}'s image`}
              className="rounded-full w-[100px] h-[100px]"
            />
            <h1 className="text-center w-full font-bold text-xl">
              {authStatus.user.name}
            </h1>
          </div>
        )}

        <div className="flex flex-row justify-start items-center w-full">
          <div className="flex flex-col justify-start items-center mt-10 w-full gap-10">
            <Messaging
              userStatus={userStatus}
              organizationId={userOrganizations[currentOrganizationSelected].id}
              userId={authStatus.user.id}
              loading={messagesLoading}
              setLoadingTrue={setMessagesLoadingTrue}
              setLoadingFalse={setMessagesLoadingFalse}
            />
            <h1 className="text-2xl w-full text-center font-bold">
              Start New Conversations With Other Users
            </h1>
            <Tabs
              className="w-full"
              onValueChange={(value) => {
                value == "users" ? getAllVolunteers() : getAllOrganizations();
              }}
            >
              <TabsList className="grid w-1/2 m-auto grid-cols-2">
                <TabsTrigger value="users">Volunteers</TabsTrigger>
                <TabsTrigger value="organizations">Organizations</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <div className="grid grid-cols-3 gap-4 mt-20">
                  <>
                    {messagesOthers.map((otherUser: any) => {
                      console.log(otherUser);
                      return (
                        <Card
                          className={`p-4 shadow-lg cursor-pointer ${otherUser.selected ? "bg-slate-400" : ""}`}
                          key={otherUser.id}
                          onClick={() => changePersonSelection(otherUser.id)}
                        >
                          <div className="flex flex-col gap-4 items-center justify-center w-full">
                            <div className="flex flex-col w-full justify-between gap-4 text-center">
                              <div className="flex flex-col gap-1 justify-start items-center">
                                <img
                                  src={otherUser.image}
                                  className="mb-0 mt-0 m-auto w-[100px] h-[100px]"
                                />
                                <h1>{otherUser.name}</h1>
                              </div>
                              <div className="flex-1 text-center">
                                <h1>
                                  Activities this user has participated in:
                                </h1>
                                <div className="flex flex-row m-4 overflow-y-scroll hidden-scrollbar shadow-lg max-h-[200px]">
                                  {otherUser.listings.map((listings: any) => {
                                    return (
                                      <div
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
                                              {
                                                listings.listings.organizations
                                                  .name
                                              }
                                              <img
                                                src={
                                                  listings.listings
                                                    .organizations.thumbnail
                                                    .storageId
                                                }
                                                width={"70px"}
                                                height={"70px"}
                                                className="object-cover"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="font-bold text-underline w-full text-center">
                              <h1 className="font-bold">Talents</h1>
                              <ul className="flex flex-row gap-2 font-normal justify-center items-center w-full">
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
                      );
                    })}
                  </>
                </div>
                {messagesOthers.some((user: any) => {
                  return user.selected;
                }) ? (
                  <div className="w-fit m-auto mt-5">
                    <Button onClick={() => handleMessageClicked("volunteer")}>
                      Start a Conversation
                    </Button>
                  </div>
                ) : null}
              </TabsContent>
              <TabsContent value="organizations">
                <div className="grid grid-cols-3 gap-4 mt-20">
                  {organizationMessages.map((otherUser: any) => {
                    return (
                      <Card
                        className={`p-4 shadow-lg cursor-pointer ${otherUser.selected ? "bg-slate-400" : ""}`}
                        key={otherUser.id}
                        onClick={() =>
                          changeOrganizationSelection(otherUser.id)
                        }
                      >
                        <div className="flex flex-col gap-4 items-center justify-center w-full">
                          <div className="flex flex-col w-full justify-between gap-4 text-center">
                            <div className="flex flex-col gap-1 justify-start items-center">
                              <img
                                src={otherUser.thumbnail.storageId}
                                className="mb-0 mt-0 m-auto w-[100px] h-[100px]"
                              />
                              <h1>{otherUser.name}</h1>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {organizationMessages.some((user: any) => {
                  return user.selected;
                }) ? (
                  <div className="w-fit m-auto mt-5">
                    <Button
                      onClick={() => handleMessageClicked("organization")}
                    >
                      Start a Conversation
                    </Button>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const MessagesClient = ({
  authStatus,
  otherOrganizations,
  userOrganizations,
}: {
  authStatus: Session;
  otherOrganizations: Organizations[];
  userOrganizations: Organizations[];
}) => {
  const { userStatus } = useUserStatusStore((state) => state);

  const [userMessageId, setUserMessageId] = useState<any>({});

  const [currentOrganizationSelected, setCurrentOrganizationSelected] =
    useState<number>(0);

  const [loading, setLoadingFunc] = useState(true);

  const setLoadingTrue = () => {
    setLoadingFunc(true);
  };

  const setLoadingFalse = () => {
    setLoadingFunc(false);
  };

  useEffect(() => {
    setLoadingTrue();
    setCurrentOrganizationSelected(0);
  }, [userStatus]);

  const increaseOrganizationSelection = () => {
    setCurrentOrganizationSelected((prevState) => prevState + 1);
  };

  const decreaseOrganizationSelection = () => {
    setCurrentOrganizationSelected((prevState) => prevState - 1);
  };
  const formSchema = z.object({
    subject: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (userStatus) {
      if (userMessageId.type == "organization") {
        startNewOrgToOrgConversation({
          ...values,
          senderId: userMessageId.id,
          receiverId: userOrganizations[currentOrganizationSelected].id,
        });
      } else {
        startNewOrgToUserConversation({
          ...values,
          senderId: userOrganizations[currentOrganizationSelected].id,
          receiverId: userMessageId.id,
        });
      }
    } else {
      if (userMessageId.type == "organization") {
        startNewUserToOrgConversation({
          ...values,
          senderId: authStatus.user.id,
          receiverId: userMessageId.id,
        });
      } else {
        startNewUserToUserConversation({
          ...values,
          senderId: authStatus.user.id,
          receiverId: userMessageId.id,
        });
      }
    }
    setUserMessageId({});
    setCurrentOrganizationSelected(0);
  }

  const clickBackButton = () => {
    setCurrentOrganizationSelected(0);
    setUserMessageId({});
  };

  return (
    <>
      {!userMessageId.id ? (
        <MaxWidthWrapper>
          <InitializeMessageComponent
            userStatus={userStatus}
            userMessageId={userMessageId}
            authStatus={authStatus}
            setUserMessageId={setUserMessageId}
            otherOrganizations={otherOrganizations}
            userOrganizations={userOrganizations}
            currentOrganizationSelected={currentOrganizationSelected}
            increaseOrgSelected={increaseOrganizationSelection}
            decreaseOrgSelected={decreaseOrganizationSelection}
            messagesLoading={loading}
            setMessagesLoadingTrue={setLoadingTrue}
            setMessagesLoadingFalse={setLoadingFalse}
          />
        </MaxWidthWrapper>
      ) : (
        <MaxWidthWrapper>
          <Button onClick={clickBackButton}>Go Back</Button>
          <div className="w-1/2 m-auto">
            <div className="flex flex-row items-center justify-center">
              {userStatus ? (
                <div className="flex flex-col items-center gap-2 justify-center w-1/2">
                  <img
                    src={
                      (
                        userOrganizations[currentOrganizationSelected]
                          .thumbnail as any
                      ).storageId || ""
                    }
                    alt={`${userOrganizations[currentOrganizationSelected].name}'s image`}
                    className="rounded-full w-[100px] h-[100px]"
                  />
                  <h1 className="text-center w-full font-bold text-xl">
                    {userOrganizations[currentOrganizationSelected].name}
                  </h1>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 justify-center w-1/2">
                  <img
                    src={authStatus.user.image || ""}
                    alt={`${authStatus.user.name}'s image`}
                    className="rounded-full w-[50px] h-[50px] xl:w-[100px] xl:h-[100px]"
                  />
                  <h1 className="text-center w-full font-bold text-xl">
                    {authStatus.user.name}
                  </h1>
                </div>
              )}

              <FaArrowRightLong />
              {userMessageId.type == "organization" ? (
                <div className="flex flex-col items-center gap-2 justify-center w-1/2">
                  <img
                    src={userMessageId.thumbnail.storageId || ""}
                    alt={`${userMessageId.name}'s image`}
                    className="rounded-full w-[50px] h-[50px] xl:w-[100px] xl:h-[100px]"
                  />
                  <h1 className="text-center w-full font-bold text-xl">
                    {userMessageId.name}
                  </h1>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 justify-center w-1/2">
                  <img
                    src={userMessageId.image || ""}
                    alt={`${userMessageId.name}'s image`}
                    className="rounded-full w-[50px] h-[50px] xl:w-[100px] xl:h-[100px]"
                  />
                  <h1 className="text-center w-full font-bold text-xl">
                    {userMessageId.name}
                  </h1>
                </div>
              )}
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
