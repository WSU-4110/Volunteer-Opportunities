import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { useState } from "react";
import Viewer from "./viewer";
import { describe } from "node:test";

afterEach(() => {
  cleanup();
});

describe("Volunteer Profile View", () => {
  const setAddOrg = jest.fn();
  const setEditProfile = jest.fn();

  //Test 1
  test("Viewer Page Rendering all elements", async () => {
    const props = {
      name: "Person",
      picture: "",
      bio: "My Bio",
      userS: [],
      organizations: [],
    };
    render(
      <Viewer
        values={props}
        setEditProfile={setEditProfile}
        addOrganization={setAddOrg}
      />
    );

    const name = await screen.getByText("Person");
    const bio = await screen.getByText("Person");
    const image = await screen.getByTestId("image");
    const addOrg = await screen.getByTestId("buttonAddOrg");
    const edit = await screen.getByTestId("buttonEdit");

    expect(name).toBeInTheDocument();

    expect(bio).toBeInTheDocument();
    expect(image).toBeInTheDocument();

    expect(addOrg).toBeInTheDocument();
    expect(edit).toBeInTheDocument();
  });

  //Test 2
  test("Viewer Page Button Test", async () => {
    const props = {
      name: "Person",
      picture: "",
      bio: "My Bio",
      userS: [],
      organizations: [],
    };
    render(
      <Viewer
        values={props}
        setEditProfile={setEditProfile}
        addOrganization={setAddOrg}
      />
    );
    const addOrg = await screen.getByTestId("buttonAddOrg");
    const edit = await screen.getByTestId("buttonEdit");

    expect(addOrg).toBeInTheDocument();

    fireEvent.click(addOrg);

    expect(setAddOrg).toHaveBeenCalled();

    expect(edit).toBeInTheDocument();

    fireEvent.click(edit);

    expect(setEditProfile).toHaveBeenCalled();
  });
  //Test 3
  test("Viewer Page Organization Test", async () => {
    const props = {
      name: "Person",
      picture: "",
      bio: "My Bio",
      userS: [],
      organizations: [
        { id: "1", name: "Org1", image: { storageId: "" } },
        { id: "2", name: "Org2", image: { storageId: "" } },
      ],
    };
    render(
      <Viewer
        values={props}
        setEditProfile={setEditProfile}
        addOrganization={setAddOrg}
      />
    );
    const org1 = await screen.getByText("Org1");
    const org2 = await screen.getByText("Org2");

    expect(org1).toBeInTheDocument();
    expect(org2).toBeInTheDocument();
  });

  //Test 4
  test("Viewer Page Skills Test", async () => {
    const props = {
      name: "Person",
      picture: "",
      bio: "My Bio",
      userS: [
        { skillId: "1", skillName: "Skill1", url: "" },
        { skillId: "2", skillName: "Skill2", url: "" },
        { skillId: "3", skillName: "Skill3", url: "" },
      ],
      organizations: [],
    };
    render(
      <Viewer
        values={props}
        setEditProfile={setEditProfile}
        addOrganization={setAddOrg}
      />
    );
    const skill1 = await screen.getByText("Skill1");
    const skill2 = await screen.getByText("Skill2");
    const skill3 = await screen.getByText("Skill3");

    expect(skill1).toBeInTheDocument();
    expect(skill2).toBeInTheDocument();
    expect(skill3).toBeInTheDocument();
  });
});
