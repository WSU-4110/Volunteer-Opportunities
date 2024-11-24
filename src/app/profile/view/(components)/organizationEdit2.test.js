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
import { orgSchema } from "./organization";
import { describe } from "node:test";

// afterEach(() => {
//   cleanup();
// });

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
  test("Organization Edit Page Rendering all elements", async () => {
    const setEditProfile = jest.fn();
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
    const submit_button = await screen.findByTestId("submit");
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
  //Test 2
  test("Toggle Edit picture button working", async () => {
    const setEditProfile = jest.fn();
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
    act(() => {
      fireEvent.click(edit_button);
    });

    //     const image_upload = await screen.findByText("Upload file");

    expect(image_upload).toBeInTheDocument();
  });
  //Test 3
  test("Button Testing", async () => {
    const setEditProfile = jest.fn();
    render(
      <Organization
        organizations={organizations}
        listings={listings}
        editProfile={true}
        setEditProfile={setEditProfile}
      />
    );
    const cancel_button = await screen.findByTestId("cancel");

    expect(cancel_button).toBeInTheDocument();
    expect(cancel_button).not.toBeDisabled();
    expect(cancel_button).toBeVisible();
    fireEvent.click(cancel_button);

    expect(setEditProfile).toHaveBeenCalled();
  });

  //Test 4
  test("Schema Testing Success", async () => {
    const test = orgSchema.safeParse({
      name: "Test Org2",
      email: "test@test.com",
      address: "4576 Giinagay Way, Raleigh New South Wales 2455, Australia",
      phoneNumber: "13456778900",
      bio: "Testing 123",
    });

    expect(test.success).toBe(true);
  });
  //Test 5
  test("Schema Testing Email Fail", async () => {
    const test = orgSchema.safeParse({
      name: "Test Org2",
      email: "test@test",
      address: "4576 Giinagay Way, Raleigh New South Wales 2455, Australia",
      phoneNumber: "13456778900",
      bio: "Testing 123",
    });

    expect(test.success).toBe(false);
  });
  // Test 6
  test("Schema Testing Name Fail", async () => {
    const test = orgSchema.safeParse({
      name: "",
      email: "test@test.com",
      address: "4576 Giinagay Way, Raleigh New South Wales 2455, Australia",
      phoneNumber: "13456778900",
      bio: "Testing 123",
    });

    expect(test.success).toBe(false);
  });
  // Test 7
  test("Schema Testing Address Fail", async () => {
    const test = orgSchema.safeParse({
      name: "Test Org2",
      email: "test@test.com",
      address: "",
      phoneNumber: "13456778900",
      bio: "Testing 123",
    });

    expect(test.success).toBe(false);
  });
  // Test 8
  test("Schema Testing Phonenumber fail", async () => {
    const test = orgSchema.safeParse({
      name: "Test Org2",
      email: "test@test.com",
      address: "4576 Giinagay Way, Raleigh New South Wales 2455, Australia",
      phoneNumber: "",
      bio: "Testing 123",
    });

    expect(test.success).toBe(false);
  });
  // Test 9
  test("Schema Testing bio fail", async () => {
    const test = orgSchema.safeParse({
      name: "Test Org2",
      email: "test@test.com",
      address: "4576 Giinagay Way, Raleigh New South Wales 2455, Australia",
      phoneNumber: "13456778900",
      bio: "",
    });

    expect(test.success).toBe(false);
  });

  //Did not test Submit button because I believe it is being blocked by zod field checks
});
