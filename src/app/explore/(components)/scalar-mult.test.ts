import { cleanup } from "@testing-library/react";

import { expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";

import { afterEach, describe } from "node:test";

import { Vector } from "./linalg"

afterEach(() => {
  cleanup();
});

// Test Suite 4
describe("Scalar multiplication", async () => {
    test("Integers", async () => {
     const a = 5
     const b = new Vector([4, 5, 6])
 
     const c = new Vector([20, 25, 30])
 
     expect(b.scalar_mult(a)).toEqual(c)
   })
 
   test("Doubles", async () => {
     const a = 3.2
     const b = new Vector([4.6, 5.2, 6.6])
 
     const c = new Vector([3.2 * 4.6, 3.2 * 5.2, 3.2 * 6.6])
 
     expect(b.scalar_mult(a)).toEqual(c)
   });
 
   test("Integer and doubles", async () => {
     const a = 4
     const b = new Vector([1.1, 5.9, 4.45])
 
     const c = new Vector([4.4, 23.6, 17.8])
 
     expect(b.scalar_mult(a)).toEqual(c);
   })
 
   test("Double and integers", async () => {
     const a = 5.5
     const b = new Vector([1, 2, 9])
 
     const c = new Vector([5.5, 11, 49.5])
 
     expect(b.scalar_mult(a)).toEqual(c);
   })
 
   test("Commutativity", async () => {
     const a1 = 4.3
     const a2 = 5.9
     const b = new Vector([43.5, 64.4, 66.6])
 
     expect(b.scalar_mult(a1).scalar_mult(a2)).toEqual(b.scalar_mult(a2).scalar_mult(a1))
   })
 
   test("Empty vectors", async () => {
     const a = 5
     const b = new Vector([])
 
     const c = new Vector([])
 
     expect(b.scalar_mult(a)).toEqual(c)
   })
 
   test("Singleton vectors", async () => {
     const a = 6.6
     const b = new Vector([5.4])
 
     const c = new Vector([35.64])
 
     expect(b.scalar_mult(a)).toEqual(c)
   })
 })