
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import { expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";

import { afterEach, describe } from "node:test";

import {add, dot, scalar_mult, negate, pairwise_mult, reverse} from "./linalg"

afterEach(() => {
  cleanup();
});

describe("Alg", () => {
  const update = jest.fn();

  //Test 1
  test("Check adding", async () => {
    const a = [1, 2, 3]
    const b = [4, 5, 6]

    const c = [5, 7, 9]

    expect(add(a, b)).toEqual(c)
  });

  // Test 2
  test("Check pairwise multiplication", async () => {
    const a = [1, 2, 3]
    const b = [4, 5, 6]

    const c = [4, 10, 18]

    expect(pairwise_mult(a, b)).toEqual(c)
  })
  
  // Test 3
  test("Check dot product", async () => {
    const a = [1, 2, 3]
    const b = [4, 5, 6]

    const c = 32

    expect(dot(a, b)).toEqual(c)
  })

   // Test 4
   test("Check scalar multiplication", async () => {
    const a = 5
    const b = [4, 5, 6]

    const c = [20, 25, 30]

    expect(scalar_mult(a, b)).toEqual(c)
  })

  // Test 5
  test("Check negate", async () => {
    const a = [1, 2, 3]

    const c = [-1, -2, -3]

    expect(negate(a)).toEqual(c)
  })

  // Test 5
  test("Check reverse", async () => {
    const a = [1, 2, 3]

    const c = [3, 2, 1]

    expect(reverse(a)).toEqual(c)
  })
});
