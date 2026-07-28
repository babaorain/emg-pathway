import { lowerMuscles } from "./lowerMuscles";
import { upperMuscles } from "./upperMuscles";

export const muscles = [...upperMuscles, ...lowerMuscles];

export const muscleById = new Map(
  muscles.map((muscle) => [muscle.id, muscle])
);

export const upperRoots = ["C5", "C6", "C7", "C8", "T1"];
export const lowerRoots = ["L2", "L3", "L4", "L5", "S1"];
