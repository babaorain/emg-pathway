import type { Region } from "../types";

export interface TopologyNode {
  id: string;
  labelZh: string;
  labelEn: string;
  kind: "root" | "plexus" | "nerve";
  x: number;
  y: number;
  width?: number;
}

export interface TopologyEdge {
  source: string;
  target: string;
}

export interface CompressionPoint {
  id: string;
  number: number;
  nerveId: string;
  nerveZh: string;
  siteZh: string;
  siteEn: string;
  location: string;
  pattern: string;
  x: number;
  y: number;
  sourceIds: string[];
}

export interface RegionTopology {
  width: number;
  height: number;
  columns: Array<{
    labelZh: string;
    labelEn: string;
    start: number;
    end: number;
  }>;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  compressionPoints: CompressionPoint[];
}

const node = (
  id: string,
  labelZh: string,
  labelEn: string,
  kind: TopologyNode["kind"],
  x: number,
  y: number,
  width?: number
): TopologyNode => ({ id, labelZh, labelEn, kind, x, y, width });

const edge = (source: string, target: string): TopologyEdge => ({
  source,
  target
});

const upper: RegionTopology = {
  width: 1240,
  height: 560,
  columns: [
    { labelZh: "神經根", labelEn: "Roots", start: 0, end: 145 },
    { labelZh: "幹", labelEn: "Trunks", start: 145, end: 325 },
    { labelZh: "束", labelEn: "Cords", start: 325, end: 500 },
    {
      labelZh: "主要周邊神經",
      labelEn: "Terminal nerves",
      start: 500,
      end: 715
    },
    {
      labelZh: "遠端分支／卡壓點",
      labelEn: "Branches / entrapments",
      start: 715,
      end: 945
    },
    { labelZh: "本方案選肌", labelEn: "Protocol muscles", start: 945, end: 1240 }
  ],
  nodes: [
    node("root-c5", "C5", "C5 root", "root", 68, 92, 82),
    node("root-c6", "C6", "C6 root", "root", 68, 184, 82),
    node("root-c7", "C7", "C7 root", "root", 68, 276, 82),
    node("root-c8", "C8", "C8 root", "root", 68, 368, 82),
    node("root-t1", "T1", "T1 root", "root", 68, 460, 82),
    node("upper-trunk", "上幹", "Upper trunk", "plexus", 232, 138),
    node("middle-trunk", "中幹", "Middle trunk", "plexus", 232, 276),
    node("lower-trunk", "下幹", "Lower trunk", "plexus", 232, 414),
    node("lateral-cord", "外側束", "Lateral cord", "plexus", 410, 160),
    node("posterior-cord", "後束", "Posterior cord", "plexus", 410, 276),
    node("medial-cord", "內側束", "Medial cord", "plexus", 410, 402),
    node(
      "dorsal-rami-cervical",
      "頸神經後支",
      "Cervical dorsal rami",
      "nerve",
      608,
      52,
      146
    ),
    node(
      "dorsal-scapular",
      "肩胛背神經",
      "Dorsal scapular",
      "nerve",
      608,
      101,
      146
    ),
    node(
      "suprascapular",
      "肩胛上神經",
      "Suprascapular",
      "nerve",
      608,
      150,
      146
    ),
    node(
      "long-thoracic",
      "長胸神經",
      "Long thoracic",
      "nerve",
      608,
      199,
      146
    ),
    node(
      "musculocutaneous",
      "肌皮神經",
      "Musculocutaneous",
      "nerve",
      608,
      248,
      146
    ),
    node("axillary", "腋神經", "Axillary", "nerve", 608, 297, 146),
    node("radial", "橈神經", "Radial", "nerve", 608, 346, 146),
    node("median", "正中神經", "Median", "nerve", 608, 414, 146),
    node("ulnar", "尺神經", "Ulnar", "nerve", 608, 482, 146),
    node("pin", "後骨間神經", "PIN", "nerve", 820, 326, 138),
    node(
      "median-recurrent",
      "正中返支",
      "Recurrent median",
      "nerve",
      820,
      394,
      138
    ),
    node("ain", "前骨間神經", "AIN", "nerve", 820, 438, 138),
    node("ulnar-deep", "尺神經深支", "Deep ulnar", "nerve", 820, 482, 138)
  ],
  edges: [
    edge("root-c5", "upper-trunk"),
    edge("root-c6", "upper-trunk"),
    edge("root-c7", "middle-trunk"),
    edge("root-c8", "lower-trunk"),
    edge("root-t1", "lower-trunk"),
    edge("root-c5", "dorsal-scapular"),
    edge("upper-trunk", "suprascapular"),
    edge("root-c5", "long-thoracic"),
    edge("root-c6", "long-thoracic"),
    edge("root-c7", "long-thoracic"),
    edge("upper-trunk", "lateral-cord"),
    edge("upper-trunk", "posterior-cord"),
    edge("middle-trunk", "lateral-cord"),
    edge("middle-trunk", "posterior-cord"),
    edge("lower-trunk", "posterior-cord"),
    edge("lower-trunk", "medial-cord"),
    edge("lateral-cord", "musculocutaneous"),
    edge("posterior-cord", "axillary"),
    edge("posterior-cord", "radial"),
    edge("lateral-cord", "median"),
    edge("medial-cord", "median"),
    edge("medial-cord", "ulnar"),
    edge("radial", "pin"),
    edge("median", "median-recurrent"),
    edge("median", "ain"),
    edge("ulnar", "ulnar-deep")
  ],
  compressionPoints: [
    {
      id: "thoracic-outlet",
      number: 1,
      nerveId: "lower-trunk",
      nerveZh: "下幹／C8-T1",
      siteZh: "胸廓出口",
      siteEn: "Thoracic outlet",
      location: "第一肋骨、鎖骨與斜角肌間的神經血管通道。",
      pattern: "下幹或內側束型態；須與 C8-T1 radiculopathy、ulnar neuropathy 鑑別。",
      x: 174,
      y: 414,
      sourceIds: ["source-pdf", "pmr-brachial"]
    },
    {
      id: "suprascapular-notch",
      number: 2,
      nerveId: "suprascapular",
      nerveZh: "肩胛上神經",
      siteZh: "肩胛上切跡",
      siteEn: "Suprascapular notch",
      location: "肩胛上神經穿過 superior transverse scapular ligament 下方。",
      pattern: "棘上肌與棘下肌皆可能異常。",
      x: 500,
      y: 150,
      sourceIds: ["source-pdf", "pmr-brachial"]
    },
    {
      id: "spinoglenoid-notch",
      number: 3,
      nerveId: "suprascapular",
      nerveZh: "肩胛上神經",
      siteZh: "肩胛盂棘切跡",
      siteEn: "Spinoglenoid notch",
      location: "肩胛上神經通往棘下肌的遠端段。",
      pattern: "棘下肌異常而棘上肌相對保留。",
      x: 906,
      y: 150,
      sourceIds: ["source-pdf", "pmr-brachial"]
    },
    {
      id: "quadrilateral-space",
      number: 4,
      nerveId: "axillary",
      nerveZh: "腋神經",
      siteZh: "四邊孔",
      siteEn: "Quadrilateral space",
      location: "小圓肌、大圓肌、肱三頭肌長頭與肱骨間。",
      pattern: "三角肌與小圓肌異常；棘下肌可作近端鑑別。",
      x: 760,
      y: 297,
      sourceIds: ["source-pdf", "pmr-brachial"]
    },
    {
      id: "radial-axilla",
      number: 5,
      nerveId: "radial",
      nerveZh: "橈神經",
      siteZh: "腋窩",
      siteEn: "Axilla",
      location: "腋窩處可能受拐杖或長時間壓迫。",
      pattern: "橈神經全分布可能受影響，包含肱三頭肌。",
      x: 688,
      y: 346,
      sourceIds: ["source-pdf", "pmr-radial"]
    },
    {
      id: "spiral-groove",
      number: 6,
      nerveId: "radial",
      nerveZh: "橈神經",
      siteZh: "肱骨螺旋溝",
      siteEn: "Spiral groove",
      location: "肱骨中段後外側，常見外部壓迫或骨折相關病灶。",
      pattern: "肱三頭肌通常保留，腕／指伸肌可異常。",
      x: 785,
      y: 346,
      sourceIds: ["source-pdf", "pmr-radial"]
    },
    {
      id: "arcade-frohse",
      number: 7,
      nerveId: "pin",
      nerveZh: "後骨間神經",
      siteZh: "Frohse 弓",
      siteEn: "Arcade of Frohse",
      location: "PIN 進入旋後肌近端的纖維弓。",
      pattern: "指伸肌異常；肱橈肌、ECRL 與感覺支通常保留。",
      x: 734,
      y: 326,
      sourceIds: ["source-pdf", "pmr-radial"]
    },
    {
      id: "pronator-teres",
      number: 8,
      nerveId: "median",
      nerveZh: "正中神經",
      siteZh: "旋前圓肌／FDS 弓",
      siteEn: "Pronator teres / FDS arch",
      location: "肘前區 lacertus、旋前圓肌兩頭或 FDS 近端弓。",
      pattern: "近端 median 肌群型態；掌皮支症狀可與腕隧道區分。",
      x: 706,
      y: 414,
      sourceIds: ["source-pdf", "pmr-median"]
    },
    {
      id: "carpal-tunnel",
      number: 9,
      nerveId: "median-recurrent",
      nerveZh: "正中神經",
      siteZh: "腕隧道",
      siteEn: "Carpal tunnel",
      location: "屈肌支持帶下方的正中神經通道。",
      pattern: "魚際肌可能異常；前臂 median 肌應保留。",
      x: 914,
      y: 394,
      sourceIds: ["source-pdf", "pmr-carpal"]
    },
    {
      id: "cubital-tunnel",
      number: 10,
      nerveId: "ulnar",
      nerveZh: "尺神經",
      siteZh: "肘後溝／肘隧道",
      siteEn: "Retrocondylar groove / cubital tunnel",
      location: "內上髁後方至 FCU 兩頭之間的 humeroulnar arcade。",
      pattern: "手內在肌常異常；FCU、FDP 4-5 可能依病灶位置而保留。",
      x: 716,
      y: 482,
      sourceIds: ["source-pdf", "pmr-ulnar-elbow"]
    },
    {
      id: "guyon-canal",
      number: 11,
      nerveId: "ulnar-deep",
      nerveZh: "尺神經",
      siteZh: "Guyon 管",
      siteEn: "Guyon canal",
      location: "豌豆骨與鉤骨鉤之間的尺側腕通道。",
      pattern: "FCU、FDP 4-5 保留；FDI 與 ADM 是否同時異常可再分區。",
      x: 918,
      y: 482,
      sourceIds: ["source-pdf", "pmr-ulnar-wrist"]
    }
  ]
};

const lower: RegionTopology = {
  width: 1240,
  height: 560,
  columns: [
    { labelZh: "神經根", labelEn: "Roots", start: 0, end: 135 },
    { labelZh: "神經叢", labelEn: "Plexus", start: 135, end: 305 },
    {
      labelZh: "近端周邊神經",
      labelEn: "Proximal nerves",
      start: 305,
      end: 525
    },
    { labelZh: "坐骨分部", labelEn: "Sciatic divisions", start: 525, end: 700 },
    {
      labelZh: "遠端分支／卡壓點",
      labelEn: "Branches / entrapments",
      start: 700,
      end: 945
    },
    { labelZh: "本方案選肌", labelEn: "Protocol muscles", start: 945, end: 1240 }
  ],
  nodes: [
    node("root-l2", "L2", "L2 root", "root", 62, 82, 76),
    node("root-l3", "L3", "L3 root", "root", 62, 176, 76),
    node("root-l4", "L4", "L4 root", "root", 62, 270, 76),
    node("root-l5", "L5", "L5 root", "root", 62, 364, 76),
    node("root-s1", "S1", "S1 root", "root", 62, 458, 76),
    node("lumbar-plexus", "腰神經叢", "Lumbar plexus", "plexus", 218, 164),
    node(
      "lumbosacral-plexus",
      "腰薦神經叢",
      "Lumbosacral plexus",
      "plexus",
      218,
      384,
      142
    ),
    node(
      "dorsal-rami-lumbar",
      "腰薦神經後支",
      "Lumbosacral dorsal rami",
      "nerve",
      412,
      52,
      154
    ),
    node(
      "lumbar-plexus-branches",
      "腰叢直接分支",
      "Direct lumbar branches",
      "nerve",
      412,
      105,
      154
    ),
    node("femoral", "股神經", "Femoral", "nerve", 412, 158, 154),
    node("obturator", "閉孔神經", "Obturator", "nerve", 412, 211, 154),
    node(
      "superior-gluteal",
      "上臀神經",
      "Superior gluteal",
      "nerve",
      412,
      294,
      154
    ),
    node(
      "inferior-gluteal",
      "下臀神經",
      "Inferior gluteal",
      "nerve",
      412,
      347,
      154
    ),
    node("sciatic", "坐骨神經", "Sciatic", "nerve", 412, 418, 154),
    node(
      "common-fibular-division",
      "腓總分部",
      "Common fibular division",
      "nerve",
      612,
      376,
      150
    ),
    node(
      "tibial-division-sciatic",
      "脛分部",
      "Tibial division",
      "nerve",
      612,
      455,
      150
    ),
    node(
      "deep-fibular",
      "深腓神經",
      "Deep fibular",
      "nerve",
      816,
      340,
      148
    ),
    node(
      "superficial-fibular",
      "淺腓神經",
      "Superficial fibular",
      "nerve",
      816,
      394,
      148
    ),
    node("tibial", "脛神經", "Tibial", "nerve", 816, 455, 148),
    node(
      "medial-plantar",
      "內側足底神經",
      "Medial plantar",
      "nerve",
      816,
      510,
      148
    )
  ],
  edges: [
    edge("root-l2", "lumbar-plexus"),
    edge("root-l3", "lumbar-plexus"),
    edge("root-l4", "lumbar-plexus"),
    edge("root-l4", "lumbosacral-plexus"),
    edge("root-l5", "lumbosacral-plexus"),
    edge("root-s1", "lumbosacral-plexus"),
    edge("lumbar-plexus", "lumbar-plexus-branches"),
    edge("lumbar-plexus", "femoral"),
    edge("lumbar-plexus", "obturator"),
    edge("lumbosacral-plexus", "superior-gluteal"),
    edge("lumbosacral-plexus", "inferior-gluteal"),
    edge("lumbosacral-plexus", "sciatic"),
    edge("sciatic", "common-fibular-division"),
    edge("sciatic", "tibial-division-sciatic"),
    edge("common-fibular-division", "deep-fibular"),
    edge("common-fibular-division", "superficial-fibular"),
    edge("tibial-division-sciatic", "tibial"),
    edge("tibial", "medial-plantar")
  ],
  compressionPoints: [
    {
      id: "inguinal-femoral",
      number: 1,
      nerveId: "femoral",
      nerveZh: "股神經",
      siteZh: "鼠蹊韌帶",
      siteEn: "Inguinal ligament",
      location: "股神經離開骨盆、通過鼠蹊韌帶深面處。",
      pattern: "股四頭肌與髂肌型態；長收肌可作閉孔神經對照。",
      x: 516,
      y: 158,
      sourceIds: ["source-pdf", "pmr-lsplexus"]
    },
    {
      id: "obturator-canal",
      number: 2,
      nerveId: "obturator",
      nerveZh: "閉孔神經",
      siteZh: "閉孔管",
      siteEn: "Obturator canal",
      location: "閉孔神經穿出骨盆進入大腿內側的狹窄通道。",
      pattern: "髖內收肌異常；股神經與近端 root 肌可保留。",
      x: 516,
      y: 211,
      sourceIds: ["source-pdf", "pmr-lsplexus"]
    },
    {
      id: "deep-gluteal",
      number: 3,
      nerveId: "sciatic",
      nerveZh: "坐骨神經",
      siteZh: "深臀區／梨狀肌下",
      siteEn: "Deep gluteal region",
      location: "坐骨神經由骨盆進入臀部、接近梨狀肌下緣處。",
      pattern: "腓總分部常較脛分部明顯；臀神經肌可協助判斷是否更近端。",
      x: 516,
      y: 418,
      sourceIds: ["source-pdf", "pmr-lsplexus"]
    },
    {
      id: "fibular-neck",
      number: 4,
      nerveId: "common-fibular-division",
      nerveZh: "腓總神經",
      siteZh: "腓骨頭／腓骨頸",
      siteEn: "Fibular head / neck",
      location: "腓總神經繞過腓骨頸、進入 fibro-osseous tunnel。",
      pattern: "TA、fibularis longus 可異常；股二頭肌短頭與 tibialis posterior 用於近端鑑別。",
      x: 704,
      y: 376,
      sourceIds: ["source-pdf", "pmr-distal-lower"]
    },
    {
      id: "anterior-tarsal",
      number: 5,
      nerveId: "deep-fibular",
      nerveZh: "深腓神經",
      siteZh: "前跗管",
      siteEn: "Anterior tarsal tunnel",
      location: "深腓神經由伸肌支持帶下方通過前踝。",
      pattern: "EDB／EHB 可異常，近端 TA 通常保留。",
      x: 926,
      y: 340,
      sourceIds: ["source-pdf", "pmr-distal-lower"]
    },
    {
      id: "soleal-sling",
      number: 6,
      nerveId: "tibial",
      nerveZh: "脛神經",
      siteZh: "比目魚肌弓",
      siteEn: "Soleal sling",
      location: "脛神經進入小腿後深層 compartment 的近端纖維弓。",
      pattern: "遠端脛神經肌群異常；hamstring 可作 proximal sciatic 對照。",
      x: 704,
      y: 455,
      sourceIds: ["source-pdf", "pmr-distal-lower"]
    },
    {
      id: "tarsal-tunnel",
      number: 7,
      nerveId: "medial-plantar",
      nerveZh: "脛神經／足底分支",
      siteZh: "跗管",
      siteEn: "Tarsal tunnel",
      location: "內踝後下方、屈肌支持帶深面的 fibro-osseous tunnel。",
      pattern: "足內在肌可能異常；小腿脛神經肌應保留。",
      x: 926,
      y: 510,
      sourceIds: ["source-pdf", "pmr-tarsal"]
    }
  ]
};

export const topologyByRegion: Record<Exclude<Region, "general">, RegionTopology> = {
  upper,
  lower
};

export const topologyNerveAlias: Record<string, string> = {
  "deep-radial": "pin",
  "lateral-pectoral": "lateral-cord",
  "medial-pectoral": "medial-cord",
  thoracodorsal: "posterior-cord",
  "common-fibular-division": "common-fibular-division",
  "tibial-division-sciatic": "tibial-division-sciatic"
};
