import { cleanup } from "@testing-library/react";

import { expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";

import { afterEach, describe } from "node:test";

import { Vector } from "./linalg"

afterEach(() => {
  cleanup();
});

// Test Suite 2
describe("Pairwise multiplication", async () => {
    test("Integers", async () => {
      const a = new Vector([1, 2, 3])
      const b = new Vector([4, 5, 6])
  
      const c = new Vector([4, 10, 18])
  
      expect(a.pairwise_mult(b)).toEqual(c)
    })
  
    test("Doubles", async () => {
      const a = new Vector([3.2, 2.6, 3.9])
      const b = new Vector([4.6, 5.2, 6.6])
  
      const c = new Vector([3.2 * 4.6, 2.6 * 5.2, 3.9 * 6.6])
  
      expect(a.pairwise_mult(b)).toEqual(c)
    });
    
    test("Incompatible lengths", async () => {
      const a = new Vector([8, 9])
      const b = new Vector([4, 9.9, 4])
  
      expect(() => a.pairwise_mult(b)).toThrowError()
    })
  
    test("Integers and doubles", async () => {
      const a = new Vector([6, 3, 4])
      const b = new Vector([1.1, 5.9, 4.45])
  
      const c = new Vector([6 * 1.1, 3 * 5.9, 4 * 4.45])
  
      expect(a.pairwise_mult(b)).toEqual(c);
    })
  
    test("Commutativity", async () => {
      const a = new Vector([65.8, 32.3, 38.6])
      const b = new Vector([43.5, 645.4, 6.6])
  
      expect(a.pairwise_mult(b)).toEqual(b.pairwise_mult(a))
    })
  
    test("Empty vectors", async () => {
      const a = new Vector([])
      const b = new Vector([])
  
      const c = new Vector([])
  
      expect(a.pairwise_mult(b)).toEqual(c)
    })
  
    test("Singleton vectors", async () => {
      const a = new Vector([6.6])
      const b = new Vector([5.4])
  
      const c = new Vector([35.64])
  
      expect(a.pairwise_mult(b)).toEqual(c)
    })
  })