import type { Muscle, PathSegment, RootShare } from "../types";

type MuscleInput = Omit<Muscle, "path"> & {
  route: PathSegment[];
};

export const segment = (
  kind: PathSegment["kind"],
  id: string,
  labelZh: string,
  labelEn: string
): PathSegment => ({ kind, id, labelZh, labelEn });

export const root = (label: string): PathSegment =>
  segment("root", `root-${label.toLowerCase()}`, label, `${label} root`);

export const plexus = (
  id: string,
  labelZh: string,
  labelEn: string
): PathSegment => segment("plexus", id, labelZh, labelEn);

export const nerve = (
  id: string,
  labelZh: string,
  labelEn: string
): PathSegment => segment("nerve", id, labelZh, labelEn);

export const rootShares = (
  primary: string[],
  secondary: string[] = []
): RootShare[] => [
  ...primary.map((item) => ({
    root: item,
    emphasis: "primary" as const
  })),
  ...secondary.map((item) => ({
    root: item,
    emphasis: "secondary" as const
  }))
];

export const createMuscle = (input: MuscleInput): Muscle => {
  const { route, ...muscle } = input;
  return {
    ...muscle,
    sourceIds: Array.from(new Set(muscle.sourceIds)),
    path: [
      ...route,
      segment("muscle", `muscle-${muscle.id}`, muscle.nameZh, muscle.nameEn)
    ]
  };
};

export const commonSources = [
  "source-pdf",
  "needle-systematic",
  "needle-accuracy"
];
