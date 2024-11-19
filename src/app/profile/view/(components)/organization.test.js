import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Organization from "./organization";
import { describe } from "node:test";

afterEach(() => {
  cleanup();
});

describe("Organization Profile View/Edit Tests", () => {
  const setEditProfile = jest.fn();
  // Using
  const organizations = [
    {
      id: "1",
      name: "Test Org1",
      image: {
        storageId: "",
        key: "",
      },
      email: "test@test.com",
      latitude: "-30.483545",
      longitude: "153.007011",
      phoneNumber: "13456778900",
      address: "4576 Giinagay Way, Raleigh New South Wales 2455, Australia",
    },
    {
      id: "2",
      name: "Test Org2",
      image: {
        storageId: "",
        key: "",
      },
      bio: "Testing 123",
      email: "test@test.com",
      latitude: "-30.483545",
      longitude: "153.007011",
      phoneNumber: "13456778900",
      address: "4576 Giinagay Way, Raleigh New South Wales 2455, Australia",
    },
  ];
  const listings = [
    [
      [
        [
          {
            organizationId: "1",
            id: "11",
            name: "123456",
            description: "The org",
            thumbnail: "",
          },
        ],
      ],
      null,
    ],
    [[], null],
  ];
  //Test 1
  test("Organization Page Rendering all elements", async () => {
    render(
      <Organization
        organizations={organizations}
        listings={listings}
        editProfile={false}
        setEditProfile={setEditProfile}
      />
    );
    const select_button = await screen.findByText("Select");
    const name = await screen.findByText("Company Name:");
    const email = await screen.findByText("Email Address:");
    const bio = await screen.findByText("Biography:");
    const address = await screen.findByText("Address:");
    const phone = await screen.findByText("Phone:");
    const edit_button = await screen.findByText("Edit");

    expect(select_button).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(bio).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(edit_button).toBeInTheDocument();
  });

  //Test 2
  test("Organization Edit Button working", async () => {
    render(
      <Organization
        organizations={organizations}
        listings={listings}
        editProfile={false}
        setEditProfile={setEditProfile}
      />
    );

    const edit_button = await screen.findByText("Edit");
    expect(edit_button).toBeInTheDocument();

    await fireEvent.click(edit_button);
    expect(setEditProfile).toHaveBeenCalled();
  });

  //Test 3
  test("Organization Edit Page Rendering all elements", async () => {
    render(
      <Organization
        organizations={organizations}
        listings={listings}
        editProfile={true}
        setEditProfile={setEditProfile}
      />
    );

    const name = await screen.findByText("Organization Name");
    const email = await screen.findByText("Email Address");
    const bio = await screen.findByText("Biography");
    const address = await screen.findByText("Address");
    const phone = await screen.findByText("Phone");
    const edit_button = await screen.findByText("Edit");
    const submit_button = await screen.findByText("Submit");
    const cancel_button = await screen.findByText("Cancel");

    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(bio).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(edit_button).toBeInTheDocument();
    expect(submit_button).toBeInTheDocument();
    expect(cancel_button).toBeInTheDocument();
  });
  //Test 4
  test("Toggle Edit picture button working", async () => {
    render(
      <Organization
        organizations={organizations}
        listings={listings}
        editProfile={true}
        setEditProfile={setEditProfile}
      />
    );
    const edit_button = await screen.findByText("Edit");
    expect(edit_button).toBeInTheDocument();
    fireEvent.click(edit_button);

    const image_upload = await screen.findByText("Upload file");

    expect(image_upload).toBeInTheDocument();
  });
  //Test 5
  test("Button Testing", async () => {
    render(
      <Organization
        organizations={organizations}
        listings={listings}
        editProfile={true}
        setEditProfile={setEditProfile}
      />
    );

    const submit_button = await screen.findByText("Submit");
    expect(submit_button).toBeInTheDocument();
    fireEvent.click(submit_button);
    expect(setEditProfile).toHaveBeenCalled();
  });

  //Test 6
  test("Button Testing 2", async () => {
    render(
      <Organization
        organizations={organizations}
        listings={listings}
        editProfile={true}
        setEditProfile={setEditProfile}
      />
    );

    const cancel_button = await screen.findByText("Submit");
    expect(cancel_button).toBeInTheDocument();
    fireEvent.click(cancel_button);
    expect(setEditProfile).toHaveBeenCalled();
  });
});
