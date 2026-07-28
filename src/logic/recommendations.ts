import { muscleById } from "../data/muscles";
import type {
  Muscle,
  PlanTier,
  Protocol,
  ProtocolEntry,
  ResultMap
} from "../types";

export interface PlannedMuscle {
  tier: PlanTier;
  entry: ProtocolEntry;
  muscle: Muscle;
}

export interface NextRecommendation {
  planned: PlannedMuscle;
  reason: string;
}

export const buildPlan = (protocol: Protocol): PlannedMuscle[] => {
  const tiers: Array<[PlanTier, ProtocolEntry[]]> = [
    ["required", protocol.required],
    ["discriminator", protocol.discriminators],
    ["conditional", protocol.conditional]
  ];

  return tiers.flatMap(([tier, entries]) =>
    entries.flatMap((protocolEntry) => {
      const muscle = muscleById.get(protocolEntry.muscleId);
      return muscle ? [{ tier, entry: protocolEntry, muscle }] : [];
    })
  );
};

export const emptyResult = () => ({
  tested: false,
  result: "untested" as const
});

export const getNextRecommendation = (
  protocol: Protocol,
  results: ResultMap
): NextRecommendation | null => {
  const plan = buildPlan(protocol);
  const untestedRequired = plan.find(
    ({ tier, muscle }) =>
      tier === "required" && !(results[muscle.id]?.tested ?? false)
  );

  if (untestedRequired) {
    return {
      planned: untestedRequired,
      reason: "先完成必查肌肉，建立最小可判讀的定位骨架。"
    };
  }

  const testedPlan = plan.filter(
    ({ muscle }) => results[muscle.id]?.tested ?? false
  );
  const abnormalCount = testedPlan.filter(
    ({ muscle }) => results[muscle.id]?.result === "abnormal"
  ).length;
  const normalCount = testedPlan.filter(
    ({ muscle }) => results[muscle.id]?.result === "normal"
  ).length;

  const nextDiscriminator = plan.find(
    ({ tier, muscle }) =>
      tier === "discriminator" && !(results[muscle.id]?.tested ?? false)
  );

  if (nextDiscriminator) {
    return {
      planned: nextDiscriminator,
      reason:
        abnormalCount > 0
          ? "已有異常肌肉；加入不同周邊神經或不同病灶層級的控制肌，提高定位特異度。"
          : "目前必查肌肉未見明確異常；加入最具鑑別力的控制肌降低偽陰性。"
    };
  }

  const nextConditional = plan.find(
    ({ tier, muscle }) =>
      tier === "conditional" && !(results[muscle.id]?.tested ?? false)
  );

  if (nextConditional) {
    return {
      planned: nextConditional,
      reason:
        abnormalCount > normalCount
          ? `沿異常路徑追加取樣：${nextConditional.entry.condition ?? "確認病灶範圍"}。`
          : `目前結果仍未形成一致型態：${nextConditional.entry.condition ?? "擴張篩檢"}。`
    };
  }

  return null;
};

export const planCompletion = (protocol: Protocol, results: ResultMap) => {
  const plan = buildPlan(protocol);
  const required = plan.filter(({ tier }) => tier === "required");
  const testedRequired = required.filter(
    ({ muscle }) => results[muscle.id]?.tested ?? false
  );
  const testedAll = plan.filter(
    ({ muscle }) => results[muscle.id]?.tested ?? false
  );

  return {
    requiredDone: testedRequired.length,
    requiredTotal: required.length,
    allDone: testedAll.length,
    allTotal: plan.length
  };
};
