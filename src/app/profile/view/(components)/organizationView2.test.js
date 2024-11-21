import {
  act,
  render,
  screen,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import React from "react";
import Organization from "./organization";
import { describe } from "node:test";

afterEach(() => {
  cleanup();
});

describe("Organization Profile View/Edit Tests", () => {
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
    const setEditProfile = jest.fn();
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
    const setEditProfile = jest.fn();
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
    expect(edit_button).not.toBeDisabled();
    expect(edit_button).toBeVisible();

    await fireEvent.click(edit_button);
    expect(setEditProfile).toHaveBeenCalled();
  });
});
