import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";
import AddAnOranization from "./addOrganization";

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

    await fireEvent.click(cancel_button);

    expect(update).toHaveBeenCalled();
  });
});
