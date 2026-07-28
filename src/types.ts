export type Region = "upper" | "lower" | "general";
export type ProtocolType = "root" | "plexus" | "nerve" | "general";
export type RiskLevel = "low" | "caution" | "high";
export type ResultState = "untested" | "normal" | "abnormal";
export type PlanTier = "required" | "discriminator" | "conditional";

export interface RootShare {
  root: string;
  emphasis: "primary" | "secondary";
}

export interface PathSegment {
  id: string;
  labelZh: string;
  labelEn: string;
  kind: "root" | "plexus" | "nerve" | "muscle";
}

export interface Muscle {
  id: string;
  region: Exclude<Region, "general">;
  nameZh: string;
  nameEn: string;
  roots: RootShare[];
  nerveId: string;
  nerveZh: string;
  nerveEn: string;
  actionZh: string;
  actionEn: string;
  path: PathSegment[];
  position: string;
  landmark: string;
  direction: string;
  needle: string;
  safety: string;
  risk: RiskLevel;
  alternativeIds: string[];
  whyUseful: string;
  specificity: 1 | 2 | 3 | 4 | 5;
  ease: 1 | 2 | 3 | 4 | 5;
  sourceIds: string[];
}

export interface ProtocolEntry {
  muscleId: string;
  reason: string;
  condition?: string;
}

export interface Protocol {
  id: string;
  region: Region;
  type: ProtocolType;
  labelZh: string;
  labelEn: string;
  lesionNodeId?: string;
  shortCode: string;
  summary: string;
  required: ProtocolEntry[];
  discriminators: ProtocolEntry[];
  conditional: ProtocolEntry[];
  compareIds: string[];
  diagnosticRule: string;
  caveats: string[];
  sourceIds: string[];
}

export interface Source {
  id: string;
  title: string;
  organization: string;
  url: string;
  note: string;
}

export interface MuscleResult {
  tested: boolean;
  result: ResultState;
}

export type ResultMap = Record<string, MuscleResult>;
