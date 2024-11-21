import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { useState } from "react";
import Talent from "./talent";
import { describe } from "node:test";

afterEach(() => {
  cleanup();
});

describe("Talent component", () => {
  //Test 1

  test("Talent rendering", async () => {
    const removeSkill = jest.fn();
    render(
      <div>
        <Talent
          skillName={"Test Skill"}
          skillId={"01"}
          skillUrl={""}
          removeSkill={removeSkill}
        />
      </div>
    );
    const skill = await screen.getByText("Test Skill");
    const button = await screen.getByTestId("button");

    expect(button).toBeInTheDocument();

    expect(skill).toBeInTheDocument();
  });

  //Test 2
  test("Deleting Talent", async () => {
    const removeSkill = jest.fn();
    render(
      <div>
        <Talent
          skillName={"Test Skill"}
          skillId={"01"}
          skillUrl={""}
          removeSkill={removeSkill}
        />
      </div>
    );
    const button = await screen.getByTestId("button");

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toBeVisible();
    fireEvent.click(button);

    expect(removeSkill).toHaveBeenCalled();
  });
});
