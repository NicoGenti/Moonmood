import { describe, expect, it } from "@jest/globals";

import { toMoodScore } from "@/types/mood";

describe("toMoodScore", () => {
  it("accepts values between 0 and 10 inclusive", () => {
    expect(toMoodScore(0)).toBe(0);
    expect(toMoodScore(5)).toBe(5);
    expect(toMoodScore(10)).toBe(10);
  });

  it("throws for values outside range", () => {
    expect(() => toMoodScore(-1)).toThrow("Invalid mood score: -1");
    expect(() => toMoodScore(11)).toThrow("Invalid mood score: 11");
  });
});
