import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { useState } from "react";
import Talents from "./talents";
import { describe } from "node:test";

afterEach(() => {
  cleanup();
});

describe("Talents component", () => {
  const removeSkill = jest.fn();
  const addSkill = jest.fn();

  //Test 1
  test("Rendering 0 Talents", async () => {
    render(
      <Talents
        addSkill={addSkill}
        removeSkill={removeSkill}
        skillsUserHas={[]}
        skillsUserDoesntHave={[]}
      />
    );

    const button = await screen.getByText("Add");

    expect(button).toBeInTheDocument();
  });
  //Test 2
  test("Rendering A Talent", async () => {
    render(
      <Talents
        addSkill={addSkill}
        removeSkill={removeSkill}
        skillsUserHas={[{ skillId: "1", skillName: "Skill 1", url: "" }]}
        skillsUserDoesntHave={[]}
      />
    );
    const skill1 = await screen.getByText("Skill 1");

    expect(skill1).toBeInTheDocument();
  });
  //Test 3
  test("Rendering Multiple Talents", async () => {
    render(
      <Talents
        addSkill={addSkill}
        removeSkill={removeSkill}
        skillsUserHas={[
          { skillId: "1", skillName: "Skill 1", url: "" },
          { skillId: "2", skillName: "Skill 2", url: "" },
          { skillId: "3", skillName: "Skill 3", url: "" },
        ]}
        skillsUserDoesntHave={[]}
      />
    );
    const skill1 = await screen.getByText("Skill 1");
    const skill2 = await screen.getByText("Skill 2");
    const skill3 = await screen.getByText("Skill 3");

    expect(skill1).toBeInTheDocument();
    expect(skill2).toBeInTheDocument();
    expect(skill3).toBeInTheDocument();
  });
});
