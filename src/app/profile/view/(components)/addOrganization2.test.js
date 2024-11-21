import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";
import AddAnOranization from "./addOrganization";
import { orgSchema } from "./addOrganization";
import { describe } from "node:test";

afterEach(() => {
  cleanup();
});

describe("Organization Add", () => {
  const update = jest.fn();

  //Test 1
  test("Add Organization rendering all elements", async () => {
    render(<AddAnOranization addOrganization={update} />);

    const title = await screen.findByTestId("title");
    const image_upload = await screen.findByText("Upload file");
    const name = await screen.findByText("Organization Name");
    const email = await screen.findByText("Email Address");
    const bio = await screen.findByText("Biography");
    const address = await screen.findByText("Address");
    const phone = await screen.findByText("Phone");
    const cancel_button = await screen.findByText("Cancel");
    const submit_button = await screen.findByText("Submit");

    expect(title).toBeInTheDocument();
    expect(image_upload).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(bio).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(cancel_button).toBeInTheDocument();
    expect(submit_button).toBeInTheDocument();
  });

  //Test 2
  test("Add Organization Testing Cancel Button", async () => {
    render(<AddAnOranization addOrganization={update} />);

    const cancel_button = await screen.findByText("Cancel");

    expect(cancel_button).toBeInTheDocument();
    expect(cancel_button).not.toBeDisabled();
    expect(cancel_button).toBeVisible();

    await fireEvent.click(cancel_button);

    expect(update).toHaveBeenCalled();
  });
  //Test 3
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
  //Test 4
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
  //Test 5
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
  //Test 6
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
  //Test 7
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
  //Test 8
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

  // Did not test submit because it is being stopped by zod field checks
});
