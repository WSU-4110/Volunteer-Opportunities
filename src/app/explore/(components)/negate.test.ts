import { cleanup } from "@testing-library/react";

import { expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";

import { afterEach, describe } from "node:test";

import { Vector } from "./linalg"

afterEach(() => {
  cleanup();
});

// Test Suite 5
describe("Negation", async () => {
    test("Integers", async () => {
      const a = new Vector([1, 2, 3])
  
      const c = new Vector([-1, -2, -3])
  
      expect(a.negate()).toEqual(c)
    })
  
    test("Doubles", async () => {
      const b = new Vector([4.6, 5.2, 6.6])
  
      const c = new Vector([-4.6, -5.2, -6.6])
  
      expect(b.negate()).toEqual(c)
    });
  
    test("Idempotent", async () => {
      const b = new Vector([43.5, 64.4, 66.6])
  
      expect(b.negate().negate()).toEqual(b)
    })
  
    test("Empty vectors", async () => {
      const b = new Vector([])
  
      const c = new Vector([])
  
      expect(b.negate()).toEqual(c)
    })
  
    test("Singleton vectors", async () => {
      const b = new Vector([5.4])
  
      const c = new Vector([-5.4])
  
      expect(b.negate()).toEqual(c)
    })
  
    test("Scalar multiplication correspondence", async () => {
      const b = new Vector([5.4])
  
      const c = b.scalar_mult(-1)
  
      expect(b.negate()).toEqual(c)
    })
  })