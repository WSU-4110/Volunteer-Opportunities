import { cleanup } from "@testing-library/react";

import { expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";

import { afterEach, describe } from "node:test";

import { Vector } from "./linalg"

afterEach(() => {
  cleanup();
});

// Test Suite 6
describe("Reverse", async () => {
    test("Integers", async () => {
      const a = new Vector([1, 2, 3])
  
      const c = new Vector([3, 2, 1])
  
      expect(a.reverse()).toEqual(c)
    })
  
    test("Doubles", async () => {
      const b = new Vector([4.6, 5.2, 6.6])
  
      const c = new Vector([6.6, 5.2, 4.6])
  
      expect(b.reverse()).toEqual(c)
    });
  
    test("Doubles", async () => {
      const a = new Vector([5.5, 3.68, 3.5])
  
      const c = new Vector([3.5, 3.68, 5.5])
  
      expect(a.reverse()).toEqual(c)
    })
  
    test("Longer", async () => {
      const a = new Vector([5.5, 3.68, 3.5, 5, 20, 6, 8])
  
      const c = new Vector([8, 6, 20, 5, 3.5, 3.68, 5.5])
  
      expect(a.reverse()).toEqual(c)
    })
  
    test("Idempotent", async () => {
      const b = new Vector([43.5, 64.4, 66.6])
  
      expect(b.reverse().reverse()).toEqual(b)
    })
  
    test("Empty vectors", async () => {
      const b = new Vector([])
  
      const c = new Vector([])
  
      expect(b.reverse()).toEqual(c)
    })
  
    test("Singleton vectors", async () => {
      const b = new Vector([5.4])
  
      const c = new Vector([5.4])
  
      expect(b.reverse()).toEqual(c)
    })
  });