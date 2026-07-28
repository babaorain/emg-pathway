import { describe, expect, it } from "vitest";
import { protocolById } from "../data/protocols";
import type { ResultMap } from "../types";
import {
  buildPlan,
  getNextRecommendation,
  planCompletion
} from "./recommendations";

describe("recommendation engine", () => {
  const c7 = protocolById.get("c7-radiculopathy")!;

  it("starts with the first required muscle", () => {
    expect(getNextRecommendation(c7, {})?.planned.muscle.id).toBe(
      "triceps-brachii"
    );
  });

  it("moves to a discriminator after required muscles are tested", () => {
    const results = c7.required.reduce<ResultMap>((map, protocolEntry) => {
      map[protocolEntry.muscleId] = { tested: true, result: "abnormal" };
      return map;
    }, {});

    expect(getNextRecommendation(c7, results)?.planned.tier).toBe(
      "discriminator"
    );
  });

  it("reports required completion independently from optional muscles", () => {
    const plan = buildPlan(c7);
    const first = plan[0];
    const results: ResultMap = {
      [first.muscle.id]: { tested: true, result: "normal" }
    };
    expect(planCompletion(c7, results)).toMatchObject({
      requiredDone: 1,
      requiredTotal: c7.required.length
    });
  });
});
