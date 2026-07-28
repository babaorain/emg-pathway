import type { Protocol, ProtocolEntry } from "../types";

const entry = (
  muscleId: string,
  reason: string,
  condition?: string
): ProtocolEntry => ({ muscleId, reason, condition });

const rootRule =
  "支持神經根病變需同一 root 所支配、但來自不同周邊神經的至少兩塊 limb muscles 出現一致的神經原性異常；paraspinal 可支持 proximal localization，但不可單獨決定層級。";

const rootCaveats = [
  "理想的 cervical／lumbosacral radiculopathy screen 為六塊肌肉，包含 paraspinal；本工具將其中最具鑑別力且容易進針者前置。",
  "純感覺性、純脫髓鞘或非常早期的 root lesion 可能有正常 needle EMG。",
  "急性 limb denervation 常需約 3–4 週才完整出現；paraspinal 可能較早，但高齡無症狀者也可異常。"
];

const peripheralRule =
  "以病灶遠端肌異常、病灶近端同神經肌保留，加上至少一塊相同 root 但不同周邊神經的控制肌，形成可定位的軸索損傷型態。";

const plexusRule =
  "以跨至少兩條 terminal nerves、符合相同 trunk／cord 的肌肉異常建立型態；純 plexus lesion 應保留 cervical paraspinals。";

export const protocols: Protocol[] = [
  {
    id: "c5-radiculopathy",
    region: "upper",
    type: "root",
    labelZh: "C5 神經根病變",
    labelEn: "C5 radiculopathy",
    lesionNodeId: "root-c5",
    shortCode: "C5 root",
    summary: "用 axillary、suprascapular 與 musculocutaneous 三條路徑確認 C5，並以 proximal branch 與 paraspinal 區分上幹病變。",
    required: [
      entry("deltoid", "易取樣的 C5 axillary 代表肌。"),
      entry("infraspinatus", "跨至 suprascapular nerve，避免只看 axillary 分布。"),
      entry("biceps-brachii", "加入 musculocutaneous route。"),
      entry("cervical-paraspinals", "支持 root 在 brachial plexus 前的定位。")
    ],
    discriminators: [
      entry("rhomboid-major", "dorsal scapular proximal branch；上幹病變多保留。"),
      entry("brachioradialis", "C5–6 radial control，確認跨 terminal nerve。")
    ],
    conditional: [
      entry("supraspinatus", "若 infraspinatus 異常或肩胛上神經仍在鑑別。", "infraspinatus 異常"),
      entry("teres-minor", "若 deltoid 異常，確認第二塊 axillary muscle。", "deltoid 異常")
    ],
    compareIds: ["upper-trunk-plexopathy", "axillary-neuropathy"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-cervical", "pmr-brachial"]
  },
  {
    id: "c6-radiculopathy",
    region: "upper",
    type: "root",
    labelZh: "C6 神經根病變",
    labelEn: "C6 radiculopathy",
    lesionNodeId: "root-c6",
    shortCode: "C6 root",
    summary: "以 musculocutaneous、radial、median 三條路徑跨神經取樣，優先低風險肌肉。",
    required: [
      entry("biceps-brachii", "主要 C5–6 musculocutaneous muscle。"),
      entry("brachioradialis", "C6 radial control。"),
      entry("fcr", "C6–7 median route，增加跨神經特異度。"),
      entry("cervical-paraspinals", "支持 root localization。")
    ],
    discriminators: [
      entry("pronator-teres", "median C6–7；與 radial lesion 區分。"),
      entry("ecrl", "radial muscle，且位於 PIN 分叉前。")
    ],
    conditional: [
      entry("infraspinatus", "若上幹病變仍在鑑別，加入 suprascapular route。", "biceps 與 brachioradialis 皆異常"),
      entry("supinator", "對 C5–6 vs proximal radial 特異，但為深層高風險選項。", "radial pattern 不一致")
    ],
    compareIds: ["upper-trunk-plexopathy", "radial-axilla"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-brachial"]
  },
  {
    id: "c7-radiculopathy",
    region: "upper",
    type: "root",
    labelZh: "C7 神經根病變",
    labelEn: "C7 radiculopathy",
    lesionNodeId: "root-c7",
    shortCode: "C7 root",
    summary: "用 radial 與 median muscles 建立跨神經型態，triceps 作 proximal anchor、EDC 作 distal anchor。",
    required: [
      entry("triceps-brachii", "高實用性 proximal C7 radial muscle。"),
      entry("pronator-teres", "跨至 median nerve。"),
      entry("extensor-digitorum", "distal radial/PIN C7–8 muscle。"),
      entry("cervical-paraspinals", "支持 pre-plexus localization。")
    ],
    discriminators: [
      entry("fcr", "容易進針的 median C6–7 control。"),
      entry("biceps-brachii", "C5–6 相鄰 root control；C7 單根病變應相對保留。")
    ],
    conditional: [
      entry("latissimus-dorsi", "posterior cord proximal branch，若 radial neuropathy 仍在鑑別。", "triceps 與 EDC 皆異常"),
      entry("ecrl", "PIN 近端 radial muscle，用於精細定位。", "EDC 異常但 triceps 正常")
    ],
    compareIds: ["radial-spiral-groove", "middle-trunk-plexopathy"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-cervical", "pmr-radial"]
  },
  {
    id: "c8-radiculopathy",
    region: "upper",
    type: "root",
    labelZh: "C8 神經根病變",
    labelEn: "C8 radiculopathy",
    lesionNodeId: "root-c8",
    shortCode: "C8 root",
    summary: "以 radial/PIN、median/AIN 與 ulnar 三條 terminal routes，避免把單一尺神經病變誤判為 C8。",
    required: [
      entry("extensor-indicis", "偏 C8 的 PIN muscle。"),
      entry("fpl", "偏 C8 的 AIN muscle。"),
      entry("fdp-45", "ulnar C8 proximal forearm muscle。"),
      entry("cervical-paraspinals", "支持 root localization。")
    ],
    discriminators: [
      entry("fdi", "C8–T1 ulnar intrinsic；與 proximal C8 肌建立長軸。"),
      entry("apb", "non-ulnar lower-trunk control。")
    ],
    conditional: [
      entry("fcu", "若 ulnar pattern 明顯，加入肘近端控制肌。", "FDI 或 FDP 異常"),
      entry("pronator-quadratus", "若 AIN 型態需確認，但為深層高風險肌。", "FPL 異常")
    ],
    compareIds: ["lower-trunk-plexopathy", "ulnar-elbow"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-brachial", "pmr-ulnar-wrist"]
  },
  {
    id: "t1-radiculopathy",
    region: "upper",
    type: "root",
    labelZh: "T1 神經根病變",
    labelEn: "T1 radiculopathy",
    lesionNodeId: "root-t1",
    shortCode: "T1 root",
    summary: "以 ulnar 與 median 手內在肌跨神經比較，並用 proximal lower-trunk muscle 補強。",
    required: [
      entry("fdi", "偏 T1 的 ulnar intrinsic。"),
      entry("apb", "偏 T1 的 median intrinsic。"),
      entry("adm", "第二塊 ulnar intrinsic，確認手內在肌型態。"),
      entry("cervical-paraspinals", "支持 pre-plexus localization。")
    ],
    discriminators: [
      entry("fpl", "較偏 C8 的 median/AIN control。"),
      entry("pectoralis-major-sternal", "medial cord proximal branch；高風險、熟悉解剖時選用。")
    ],
    conditional: [
      entry("fdp-45", "若尺神經病變仍在鑑別，加入 proximal ulnar muscle。", "FDI 與 ADM 異常"),
      entry("fcu", "確認病變是否延伸至肘部近端。", "手內在肌皆異常")
    ],
    compareIds: ["lower-trunk-plexopathy", "ulnar-wrist"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-brachial", "pmr-ulnar-wrist"]
  },
  {
    id: "upper-trunk-plexopathy",
    region: "upper",
    type: "plexus",
    labelZh: "上幹神經叢病變",
    labelEn: "Upper-trunk plexopathy",
    lesionNodeId: "upper-trunk",
    shortCode: "Upper trunk",
    summary: "跨 suprascapular、musculocutaneous、axillary 與 radial routes，並確認 paraspinal／dorsal scapular 的相對保留。",
    required: [
      entry("infraspinatus", "suprascapular branch 代表肌。"),
      entry("biceps-brachii", "musculocutaneous route。"),
      entry("deltoid", "axillary route。"),
      entry("brachioradialis", "radial C5–6 route。")
    ],
    discriminators: [
      entry("cervical-paraspinals", "純上幹病變應相對保留。"),
      entry("rhomboid-major", "dorsal scapular 分支多在 trunk 前，應相對保留。")
    ],
    conditional: [
      entry("supraspinatus", "若 suprascapular involvement 需第二點確認。", "infraspinatus 異常"),
      entry("triceps-brachii", "檢查中幹／C7 是否延伸受累。", "臨床弱點超出 C5–6")
    ],
    compareIds: ["c5-radiculopathy", "c6-radiculopathy"],
    diagnosticRule: plexusRule,
    caveats: ["純 plexus lesion 通常保留 paraspinal；若 paraspinal 明顯異常，重新考慮 root 或多重病灶。"],
    sourceIds: ["pmr-brachial", "source-pdf"]
  },
  {
    id: "middle-trunk-plexopathy",
    region: "upper",
    type: "plexus",
    labelZh: "中幹神經叢病變",
    labelEn: "Middle-trunk plexopathy",
    lesionNodeId: "middle-trunk",
    shortCode: "Middle trunk",
    summary: "以 median 與 radial 的 C7 肌建立 trunk pattern，再用 paraspinal 與相鄰 trunks 控制。",
    required: [
      entry("triceps-brachii", "radial C7 proximal muscle。"),
      entry("pronator-teres", "median C6–7 muscle。"),
      entry("fcr", "第二塊 median C6–7 muscle。"),
      entry("extensor-digitorum", "distal radial/PIN muscle。")
    ],
    discriminators: [
      entry("cervical-paraspinals", "純 middle trunk lesion 應保留。"),
      entry("biceps-brachii", "upper-trunk control。")
    ],
    conditional: [
      entry("fdi", "lower-trunk control。", "需確認病變範圍"),
      entry("latissimus-dorsi", "posterior cord proximal branch 補強。", "radial distribution 不一致")
    ],
    compareIds: ["c7-radiculopathy", "posterior-cord-lesion"],
    diagnosticRule: plexusRule,
    caveats: ["Middle-trunk lesion 少見；需結合臨床與完整 EDX 排除 C7 root。"],
    sourceIds: ["pmr-brachial"]
  },
  {
    id: "lower-trunk-plexopathy",
    region: "upper",
    type: "plexus",
    labelZh: "下幹神經叢病變",
    labelEn: "Lower-trunk plexopathy",
    lesionNodeId: "lower-trunk",
    shortCode: "Lower trunk",
    summary: "跨 ulnar、median/AIN 與 PIN 的 C8–T1 muscles，確認 cervical paraspinal 保留。",
    required: [
      entry("fdi", "ulnar intrinsic。"),
      entry("apb", "median intrinsic。"),
      entry("fpl", "AIN C8 muscle。"),
      entry("extensor-indicis", "PIN C8 muscle。")
    ],
    discriminators: [
      entry("cervical-paraspinals", "純 lower trunk lesion 應保留。"),
      entry("fcu", "proximal ulnar muscle，確認範圍。")
    ],
    conditional: [
      entry("pectoralis-major-sternal", "medial cord proximal branch；熟悉胸壁解剖時使用。", "需確認 medial cord involvement"),
      entry("fdp-45", "ulnar forearm control。", "手內在肌異常")
    ],
    compareIds: ["c8-radiculopathy", "t1-radiculopathy", "ulnar-wrist"],
    diagnosticRule: plexusRule,
    caveats: ["若只有 ulnar muscles 異常，不足以診斷 lower trunk plexopathy。"],
    sourceIds: ["pmr-brachial", "pmr-ulnar-wrist"]
  },
  {
    id: "lateral-cord-lesion",
    region: "upper",
    type: "plexus",
    labelZh: "外側束病變",
    labelEn: "Lateral-cord lesion",
    lesionNodeId: "lateral-cord",
    shortCode: "Lateral cord",
    summary: "以 musculocutaneous 與 proximal median muscles 建立外側束型態。",
    required: [
      entry("biceps-brachii", "musculocutaneous route。"),
      entry("brachialis", "第二個 musculocutaneous 分支層級。"),
      entry("pronator-teres", "proximal median contribution。"),
      entry("fcr", "median C6–7 route。")
    ],
    discriminators: [
      entry("deltoid", "posterior cord control。"),
      entry("fdi", "medial cord control。")
    ],
    conditional: [
      entry("pectoralis-major-clavicular", "外側胸神經 proximal branch；高風險選項。", "需要 cord-level 補強")
    ],
    compareIds: ["upper-trunk-plexopathy", "musculocutaneous-neuropathy"],
    diagnosticRule: plexusRule,
    caveats: ["Median nerve 同時接受 medial cord contribution；distal median 肌的解讀需保守。"],
    sourceIds: ["pmr-brachial"]
  },
  {
    id: "posterior-cord-lesion",
    region: "upper",
    type: "plexus",
    labelZh: "後束病變",
    labelEn: "Posterior-cord lesion",
    lesionNodeId: "posterior-cord",
    shortCode: "Posterior cord",
    summary: "跨 thoracodorsal、axillary 與 radial nerves 建立後束型態。",
    required: [
      entry("deltoid", "axillary route。"),
      entry("triceps-brachii", "proximal radial route。"),
      entry("brachioradialis", "mid-radial route。"),
      entry("extensor-digitorum", "PIN route。")
    ],
    discriminators: [
      entry("latissimus-dorsi", "thoracodorsal proximal branch。"),
      entry("biceps-brachii", "lateral cord control。")
    ],
    conditional: [
      entry("teres-minor", "第二塊 axillary muscle。", "deltoid 異常"),
      entry("fdi", "medial cord control。", "需確認病變範圍")
    ],
    compareIds: ["radial-axilla", "middle-trunk-plexopathy"],
    diagnosticRule: plexusRule,
    caveats: ["若 deltoid 與 latissimus 均保留而僅 radial muscles 異常，優先考慮 radial mononeuropathy。"],
    sourceIds: ["pmr-brachial", "pmr-radial"]
  },
  {
    id: "medial-cord-lesion",
    region: "upper",
    type: "plexus",
    labelZh: "內側束病變",
    labelEn: "Medial-cord lesion",
    lesionNodeId: "medial-cord",
    shortCode: "Medial cord",
    summary: "跨 median 與 ulnar 的 C8–T1 muscles，並加入 lateral/posterior cord controls。",
    required: [
      entry("fdi", "ulnar intrinsic。"),
      entry("apb", "median intrinsic。"),
      entry("fpl", "AIN/median muscle。"),
      entry("fcu", "proximal ulnar muscle。")
    ],
    discriminators: [
      entry("biceps-brachii", "lateral cord control。"),
      entry("triceps-brachii", "posterior cord control。")
    ],
    conditional: [
      entry("pectoralis-major-sternal", "medial pectoral proximal branch；高風險選項。", "需要 proximal cord confirmation")
    ],
    compareIds: ["lower-trunk-plexopathy", "ulnar-elbow"],
    diagnosticRule: plexusRule,
    caveats: ["Lower-trunk 與 medial-cord patterns 高度重疊，需依 proximal branches 與 sensory studies 完整定位；本工具不含 NCS。"],
    sourceIds: ["pmr-brachial"]
  },
  {
    id: "suprascapular-neuropathy",
    region: "upper",
    type: "nerve",
    labelZh: "肩胛上神經病變",
    labelEn: "Suprascapular neuropathy",
    lesionNodeId: "suprascapular",
    shortCode: "Suprascapular n.",
    summary: "以 supraspinatus／infraspinatus 分支前後定位，並以同 root 非肩胛上神經肌排除 C5–6 root／upper trunk。",
    required: [
      entry("infraspinatus", "spinoglenoid notch 遠端肌。"),
      entry("supraspinatus", "suprascapular notch 遠端、spinoglenoid 近端肌。"),
      entry("deltoid", "C5–6 axillary control。")
    ],
    discriminators: [
      entry("biceps-brachii", "C5–6 musculocutaneous control。"),
      entry("cervical-paraspinals", "root control。")
    ],
    conditional: [
      entry("rhomboid-major", "上幹／root 仍在鑑別時加入。", "deltoid 或 biceps 異常")
    ],
    compareIds: ["c5-radiculopathy", "upper-trunk-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["僅 infraspinatus 異常支持較 distal spinoglenoid lesion；兩者皆異常支持較 proximal lesion。"],
    sourceIds: ["pmr-brachial", "source-pdf"]
  },
  {
    id: "axillary-neuropathy",
    region: "upper",
    type: "nerve",
    labelZh: "腋神經病變",
    labelEn: "Axillary neuropathy",
    lesionNodeId: "axillary",
    shortCode: "Axillary n.",
    summary: "確認 deltoid／teres minor 一致性，並以 C5–6 非 axillary 肌排除 root／upper trunk。",
    required: [
      entry("deltoid", "主要低風險 target。"),
      entry("teres-minor", "第二個 axillary muscle。"),
      entry("infraspinatus", "同 root 的 suprascapular control。")
    ],
    discriminators: [
      entry("biceps-brachii", "同 root 的 musculocutaneous control。"),
      entry("cervical-paraspinals", "root control。")
    ],
    conditional: [
      entry("rhomboid-major", "若 C5 root 仍在鑑別。", "非 axillary 肌也異常")
    ],
    compareIds: ["c5-radiculopathy", "upper-trunk-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["Teres minor 較難精準進針，必要時使用超音波。"],
    sourceIds: ["pmr-brachial", "source-pdf"]
  },
  {
    id: "musculocutaneous-neuropathy",
    region: "upper",
    type: "nerve",
    labelZh: "肌皮神經病變",
    labelEn: "Musculocutaneous neuropathy",
    lesionNodeId: "musculocutaneous",
    shortCode: "Musculocutaneous n.",
    summary: "以 biceps 與 brachialis 確認，並以同 C5–6 的 radial/axillary 肌作控制。",
    required: [
      entry("biceps-brachii", "proximal musculocutaneous muscle。"),
      entry("brachialis", "distal musculocutaneous branch。"),
      entry("brachioradialis", "同 root radial control。")
    ],
    discriminators: [
      entry("deltoid", "同 root axillary control。"),
      entry("cervical-paraspinals", "root control。")
    ],
    conditional: [
      entry("infraspinatus", "upper trunk control。", "其他 C5–6 muscles 也異常")
    ],
    compareIds: ["c6-radiculopathy", "lateral-cord-lesion"],
    diagnosticRule: peripheralRule,
    caveats: ["Brachialis 可能有少量 radial contribution，需與 biceps 及 controls 一併解讀。"],
    sourceIds: ["pmr-brachial"]
  },
  {
    id: "radial-axilla",
    region: "upper",
    type: "nerve",
    labelZh: "腋窩層級橈神經病變",
    labelEn: "Radial neuropathy at the axilla",
    lesionNodeId: "radial",
    shortCode: "Radial n. — axilla",
    summary: "由 triceps 至 PIN 肌建立完整 radial 長軸，並以 non-radial C6–8 muscles 控制。",
    required: [
      entry("triceps-brachii", "axilla lesion 應可受累。"),
      entry("brachioradialis", "mid-radial muscle。"),
      entry("ecrl", "PIN 近端 wrist extensor。"),
      entry("extensor-digitorum", "distal PIN muscle。")
    ],
    discriminators: [
      entry("pronator-teres", "C6–7 median control。"),
      entry("fdi", "C8–T1 ulnar control。")
    ],
    conditional: [
      entry("latissimus-dorsi", "posterior cord proximal branch，若 posterior cord lesion 在鑑別。", "deltoid 或其他 posterior cord 症狀"),
      entry("deltoid", "axillary/posterior cord control。", "需排除 posterior cord")
    ],
    compareIds: ["posterior-cord-lesion", "c7-radiculopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["若 triceps 保留而 distal radial muscles 異常，病灶更符合 spiral groove 或更遠端。"],
    sourceIds: ["pmr-radial"]
  },
  {
    id: "radial-spiral-groove",
    region: "upper",
    type: "nerve",
    labelZh: "螺旋溝橈神經病變",
    labelEn: "Radial neuropathy at the spiral groove",
    lesionNodeId: "radial",
    shortCode: "Radial n. — groove",
    summary: "確認 triceps 保留、brachioradialis/ECR/EDC 受累，並加入 non-radial C7 control。",
    required: [
      entry("triceps-brachii", "病灶近端控制；spiral groove lesion 應保留。"),
      entry("brachioradialis", "常在病灶遠端受累。"),
      entry("ecrl", "病灶遠端、PIN 近端。"),
      entry("extensor-digitorum", "distal radial/PIN muscle。")
    ],
    discriminators: [
      entry("pronator-teres", "C7 median control，若異常需考慮 root。"),
      entry("cervical-paraspinals", "root control。")
    ],
    conditional: [
      entry("extensor-indicis", "若需確認 distal PIN axonal involvement。", "EDC 異常"),
      entry("biceps-brachii", "C5–6 non-radial control。", "brachioradialis 單獨異常")
    ],
    compareIds: ["c7-radiculopathy", "pin-neuropathy"],
    diagnosticRule: peripheralRule,
    caveats: ["Radial fascicular lesions 可能造成非典型肌肉保留／受累。"],
    sourceIds: ["pmr-radial"]
  },
  {
    id: "pin-neuropathy",
    region: "upper",
    type: "nerve",
    labelZh: "骨間後神經病變",
    labelEn: "Posterior interosseous neuropathy",
    lesionNodeId: "pin",
    shortCode: "PIN",
    summary: "以 PIN muscles 異常、ECRL/BR/triceps 保留建立純運動遠端 radial pattern。",
    required: [
      entry("extensor-digitorum", "常用 PIN target。"),
      entry("extensor-indicis", "distal PIN target。"),
      entry("ecrl", "PIN 近端 radial control。")
    ],
    discriminators: [
      entry("brachioradialis", "更 proximal radial control。"),
      entry("pronator-teres", "C7 median control。")
    ],
    conditional: [
      entry("ecrb", "定位 deep radial/PIN 交界。", "ECRL 正常而 EDC 異常"),
      entry("supinator", "若需要評估 arcade of Frohse，但屬高風險深層肌。", "病灶高低仍不確定")
    ],
    compareIds: ["radial-spiral-groove", "c8-radiculopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["PIN 是純運動分支；本工具刻意不納入 NCS，但臨床定位仍應使用完整 EDX。"],
    sourceIds: ["pmr-radial"]
  },
  {
    id: "median-proximal",
    region: "upper",
    type: "nerve",
    labelZh: "近端正中神經病變",
    labelEn: "Proximal median neuropathy",
    lesionNodeId: "median",
    shortCode: "Median n. — proximal",
    summary: "從 pronator/FCR 到 AIN/APB 建立 median 長軸，並用 radial/ulnar muscles 排除 root／plexus。",
    required: [
      entry("pronator-teres", "最 proximal 常用 median muscle，但分支變異需注意。"),
      entry("fcr", "proximal median muscle。"),
      entry("fpl", "AIN branch muscle。"),
      entry("apb", "distal recurrent median muscle。")
    ],
    discriminators: [
      entry("extensor-digitorum", "C7–8 radial control。"),
      entry("fdi", "C8–T1 ulnar control。")
    ],
    conditional: [
      entry("pronator-quadratus", "確認 AIN involvement；建議超音波。", "FPL 異常"),
      entry("cervical-paraspinals", "若 root 仍在鑑別。", "non-median control 亦異常")
    ],
    compareIds: ["c7-radiculopathy", "c8-radiculopathy", "ain-neuropathy"],
    diagnosticRule: peripheralRule,
    caveats: ["Pronator teres 分支位置具變異，單一 PT 結果不能獨立決定病灶高低。"],
    sourceIds: ["pmr-median"]
  },
  {
    id: "ain-neuropathy",
    region: "upper",
    type: "nerve",
    labelZh: "骨間前神經病變",
    labelEn: "Anterior interosseous neuropathy",
    lesionNodeId: "ain",
    shortCode: "AIN",
    summary: "用 FPL/PQ 建立 AIN 型態，並確認 proximal median 與 non-median C8 muscles 保留。",
    required: [
      entry("fpl", "容易度較高的 AIN target。"),
      entry("pronator-quadratus", "distal AIN target；建議超音波。"),
      entry("pronator-teres", "AIN 分支近端 median control。")
    ],
    discriminators: [
      entry("fdi", "C8–T1 ulnar control。"),
      entry("extensor-indicis", "C8 PIN control。")
    ],
    conditional: [
      entry("apb", "distal main median control。", "需排除更廣泛 median lesion")
    ],
    compareIds: ["median-proximal", "c8-radiculopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["AIN syndrome 亦可能是 focal neuritis；needle pattern 必須與臨床病程整合。"],
    sourceIds: ["pmr-median"]
  },
  {
    id: "ulnar-elbow",
    region: "upper",
    type: "nerve",
    labelZh: "肘部尺神經病變",
    labelEn: "Ulnar neuropathy at the elbow",
    lesionNodeId: "ulnar",
    shortCode: "Ulnar n. — elbow",
    summary: "比較手內在肌與 FCU/FDP，並加入 non-ulnar C8–T1 controls。",
    required: [
      entry("fdi", "敏感的 ulnar intrinsic。"),
      entry("adm", "第二塊 ulnar intrinsic。"),
      entry("fcu", "肘部或更 proximal ulnar muscle。"),
      entry("fdp-45", "forearm ulnar muscle。")
    ],
    discriminators: [
      entry("apb", "median C8–T1 control。"),
      entry("extensor-indicis", "PIN C8 control。")
    ],
    conditional: [
      entry("cervical-paraspinals", "若 C8/T1 root 仍在鑑別。", "non-ulnar control 異常"),
      entry("fpl", "lower trunk/median control。", "APB 亦異常")
    ],
    compareIds: ["c8-radiculopathy", "lower-trunk-plexopathy", "ulnar-wrist"],
    diagnosticRule: peripheralRule,
    caveats: ["單靠 needle EMG 無法可靠評估純脫髓鞘型 UNE；本 protocol 針對 motor axon loss。"],
    sourceIds: ["pmr-ulnar-elbow", "pmr-ulnar-wrist"]
  },
  {
    id: "ulnar-wrist",
    region: "upper",
    type: "nerve",
    labelZh: "腕部尺神經病變",
    labelEn: "Ulnar neuropathy at the wrist",
    lesionNodeId: "ulnar-deep",
    shortCode: "Ulnar n. — wrist",
    summary: "以 FDI/ADM 的深支型態定位，並確認 FCU/FDP 近端保留與 APB control。",
    required: [
      entry("fdi", "deep ulnar branch target。"),
      entry("adm", "比較 Guyon canal 分支型態。"),
      entry("fdp-45", "腕部近端 ulnar control。"),
      entry("fcu", "更 proximal ulnar control。")
    ],
    discriminators: [
      entry("apb", "median intrinsic control。"),
      entry("extensor-indicis", "C8 PIN control。")
    ],
    conditional: [
      entry("cervical-paraspinals", "若 C8/T1 root 仍在鑑別。", "non-ulnar control 異常"),
      entry("fpl", "lower trunk/median C8 control。", "APB 亦異常")
    ],
    compareIds: ["ulnar-elbow", "c8-radiculopathy", "lower-trunk-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["FDI 異常而 ADM 保留可支持部分 deep-branch pattern；需結合完整 EDX 與解剖變異。"],
    sourceIds: ["pmr-ulnar-wrist"]
  },
  {
    id: "long-thoracic-neuropathy",
    region: "upper",
    type: "nerve",
    labelZh: "長胸神經病變",
    labelEn: "Long thoracic neuropathy",
    lesionNodeId: "long-thoracic",
    shortCode: "Long thoracic n.",
    summary: "前鋸肌為主要 target；以 C5–7 其他路徑與 paraspinal 排除 root／upper trunk。",
    required: [
      entry("serratus-anterior", "主要 target；屬胸壁高風險肌。"),
      entry("deltoid", "C5–6 axillary control。"),
      entry("triceps-brachii", "C7 radial control。")
    ],
    discriminators: [
      entry("cervical-paraspinals", "root control。"),
      entry("rhomboid-major", "dorsal scapular/scapular winging control。")
    ],
    conditional: [
      entry("infraspinatus", "upper trunk control。", "其他 C5–7 muscles 異常")
    ],
    compareIds: ["c5-radiculopathy", "upper-trunk-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["Serratus anterior 有氣胸風險，建議超音波或由熟悉胸壁 needle EMG 者操作。"],
    sourceIds: ["pmr-brachial", "emg-pneumo"]
  },
  {
    id: "l2-radiculopathy",
    region: "lower",
    type: "root",
    labelZh: "L2 神經根病變",
    labelEn: "L2 radiculopathy",
    lesionNodeId: "root-l2",
    shortCode: "L2 root",
    summary: "跨 direct lumbar plexus、femoral 與 obturator routes；深層 iliopsoas 建議超音波。",
    required: [
      entry("rectus-femoris", "易取樣的 L2–4 femoral muscle。"),
      entry("adductor-longus", "non-femoral L2–4 control。"),
      entry("iliopsoas", "proximal L1–3 muscle；高風險。"),
      entry("lumbar-paraspinals", "支持 root localization。")
    ],
    discriminators: [
      entry("vastus-medialis", "偏 L3–4 control。"),
      entry("tibialis-anterior", "L4–5 相鄰 root control。")
    ],
    conditional: [
      entry("vastus-lateralis", "若 femoral distribution 需第二肌確認。", "rectus femoris 異常")
    ],
    compareIds: ["lumbar-plexopathy", "femoral-neuropathy"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-lsplexus"]
  },
  {
    id: "l3-radiculopathy",
    region: "lower",
    type: "root",
    labelZh: "L3 神經根病變",
    labelEn: "L3 radiculopathy",
    lesionNodeId: "root-l3",
    shortCode: "L3 root",
    summary: "以 femoral 與 obturator muscles 跨神經確認 L3，加入 paraspinal。",
    required: [
      entry("rectus-femoris", "femoral L2–4 muscle。"),
      entry("vastus-medialis", "femoral L3–4 muscle。"),
      entry("adductor-longus", "obturator L2–4 control。"),
      entry("lumbar-paraspinals", "root control。")
    ],
    discriminators: [
      entry("iliopsoas", "proximal L2–3；建議超音波。"),
      entry("tibialis-anterior", "L4–5 相鄰 root control。")
    ],
    conditional: [
      entry("vastus-lateralis", "第二塊容易進針 quadriceps。", "quadriceps 結果不一致")
    ],
    compareIds: ["femoral-neuropathy", "obturator-neuropathy"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic"]
  },
  {
    id: "l4-radiculopathy",
    region: "lower",
    type: "root",
    labelZh: "L4 神經根病變",
    labelEn: "L4 radiculopathy",
    lesionNodeId: "root-l4",
    shortCode: "L4 root",
    summary: "用 femoral、deep fibular 與 obturator 三條 routes 跨神經確認 L4。",
    required: [
      entry("vastus-medialis", "偏 L3–4 femoral muscle。"),
      entry("tibialis-anterior", "L4–5 deep fibular muscle。"),
      entry("adductor-longus", "L2–4 obturator control。"),
      entry("lumbar-paraspinals", "支持 root localization。")
    ],
    discriminators: [
      entry("rectus-femoris", "第二個 femoral level。"),
      entry("tensor-fasciae-latae", "偏 L5 proximal control。")
    ],
    conditional: [
      entry("tibialis-posterior", "L4–5 tibial control；深層高風險。", "TA 異常但 femoral muscles 正常")
    ],
    compareIds: ["femoral-neuropathy", "l5-radiculopathy"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic"]
  },
  {
    id: "l5-radiculopathy",
    region: "lower",
    type: "root",
    labelZh: "L5 神經根病變",
    labelEn: "L5 radiculopathy",
    lesionNodeId: "root-l5",
    shortCode: "L5 root",
    summary: "以 deep fibular、superficial fibular、tibial 與 superior gluteal routes 建立高特異度 L5 型態。",
    required: [
      entry("tibialis-anterior", "低風險 deep fibular L4–5 target。"),
      entry("tensor-fasciae-latae", "proximal non-sciatic L5 control。"),
      entry("tibialis-posterior", "non-fibular L5 control；深層高風險。"),
      entry("lumbar-paraspinals", "支持 root localization。")
    ],
    discriminators: [
      entry("fibularis-longus", "superficial fibular route。"),
      entry("extensor-hallucis-longus", "偏 L5 deep fibular muscle。")
    ],
    conditional: [
      entry("gluteus-medius", "第二塊 superior gluteal proximal L5 muscle。", "TFL 異常"),
      entry("biceps-femoris-short", "fibular division 在腓骨頭近端的控制；建議超音波。", "需區分 sciatic 與 common fibular")
    ],
    compareIds: ["common-fibular-neuropathy", "sciatic-neuropathy"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-lsplexus"]
  },
  {
    id: "s1-radiculopathy",
    region: "lower",
    type: "root",
    labelZh: "S1 神經根病變",
    labelEn: "S1 radiculopathy",
    lesionNodeId: "root-s1",
    shortCode: "S1 root",
    summary: "跨 tibial、superficial fibular、inferior gluteal 與 sciatic proximal routes。",
    required: [
      entry("medial-gastrocnemius", "低風險 tibial S1 target。"),
      entry("gluteus-maximus", "proximal non-sciatic S1 control。"),
      entry("fibularis-longus", "superficial fibular L5–S1 route。"),
      entry("lumbar-paraspinals", "支持 root localization。")
    ],
    discriminators: [
      entry("biceps-femoris-long", "proximal sciatic tibial-division muscle。"),
      entry("soleus", "第二塊 tibial S1–2 muscle。")
    ],
    conditional: [
      entry("semitendinosus", "若 proximal sciatic pattern 需確認。", "biceps long head 異常"),
      entry("abductor-hallucis", "若需評估 distal tibial involvement。", "gastrocnemius 異常")
    ],
    compareIds: ["sciatic-neuropathy", "tibial-neuropathy"],
    diagnosticRule: rootRule,
    caveats: rootCaveats,
    sourceIds: ["pmr-radic", "pmr-lsplexus"]
  },
  {
    id: "lumbar-plexopathy",
    region: "lower",
    type: "plexus",
    labelZh: "腰神經叢病變",
    labelEn: "Lumbar plexopathy",
    lesionNodeId: "lumbar-plexus",
    shortCode: "Lumbar plexus",
    summary: "跨 femoral、obturator 與 direct lumbar plexus muscles，確認 lumbar paraspinal 相對保留。",
    required: [
      entry("rectus-femoris", "femoral route。"),
      entry("vastus-medialis", "第二個 femoral level。"),
      entry("adductor-longus", "obturator route。"),
      entry("iliopsoas", "direct lumbar plexus/proximal target。")
    ],
    discriminators: [
      entry("lumbar-paraspinals", "純 plexopathy 應相對保留。"),
      entry("tibialis-anterior", "lumbosacral trunk control。")
    ],
    conditional: [
      entry("vastus-lateralis", "確認 femoral axon loss。", "quadriceps 結果不一致")
    ],
    compareIds: ["l3-radiculopathy", "femoral-neuropathy"],
    diagnosticRule: plexusRule,
    caveats: ["Paraspinal 異常提示 root 或 radiculoplexus process，而非純 plexus lesion。"],
    sourceIds: ["pmr-lsplexus", "pmr-radic"]
  },
  {
    id: "lumbosacral-plexopathy",
    region: "lower",
    type: "plexus",
    labelZh: "腰薦神經叢病變",
    labelEn: "Lumbosacral plexopathy",
    lesionNodeId: "lumbosacral-plexus",
    shortCode: "Lumbosacral plexus",
    summary: "跨 superior/inferior gluteal、sciatic、fibular 與 tibial routes，並確認 paraspinal。",
    required: [
      entry("tensor-fasciae-latae", "superior gluteal route。"),
      entry("gluteus-maximus", "inferior gluteal route。"),
      entry("tibialis-anterior", "deep fibular route。"),
      entry("medial-gastrocnemius", "tibial route。")
    ],
    discriminators: [
      entry("adductor-longus", "upper plexus／obturator control。"),
      entry("lumbar-paraspinals", "純 plexopathy 應相對保留。")
    ],
    conditional: [
      entry("biceps-femoris-short", "fibular division proximal target。", "TA 異常"),
      entry("biceps-femoris-long", "tibial division proximal target。", "gastrocnemius 異常")
    ],
    compareIds: ["l5-radiculopathy", "sciatic-neuropathy"],
    diagnosticRule: plexusRule,
    caveats: ["Radiculoplexus neuropathy 可同時出現 paraspinal 異常；需依病程與完整 EDX 區分。"],
    sourceIds: ["pmr-lsplexus"]
  },
  {
    id: "femoral-neuropathy",
    region: "lower",
    type: "nerve",
    labelZh: "股神經病變",
    labelEn: "Femoral neuropathy",
    lesionNodeId: "femoral",
    shortCode: "Femoral n.",
    summary: "比較 iliopsoas 與多塊 quadriceps，並以 obturator、L4–5 與 paraspinal controls 排除 root／plexus。",
    required: [
      entry("rectus-femoris", "proximal femoral muscle。"),
      entry("vastus-medialis", "distal femoral muscle。"),
      entry("vastus-lateralis", "第二個 quadriceps sample。"),
      entry("iliopsoas", "inguinal ligament proximal control；建議超音波。")
    ],
    discriminators: [
      entry("adductor-longus", "同 L2–4 的 obturator control。"),
      entry("lumbar-paraspinals", "root control。")
    ],
    conditional: [
      entry("tibialis-anterior", "L4–5 non-femoral control。", "需排除 L4 root")
    ],
    compareIds: ["l3-radiculopathy", "l4-radiculopathy", "lumbar-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["Iliacus 與 psoas innervation 不完全相同；深層取樣建議影像導引。"],
    sourceIds: ["pmr-radic", "pmr-lsplexus"]
  },
  {
    id: "obturator-neuropathy",
    region: "lower",
    type: "nerve",
    labelZh: "閉孔神經病變",
    labelEn: "Obturator neuropathy",
    lesionNodeId: "obturator",
    shortCode: "Obturator n.",
    summary: "以長收肌為主要 target，使用 femoral、distal L4–5 與 paraspinal controls。",
    required: [
      entry("adductor-longus", "容易取樣的 obturator target。"),
      entry("rectus-femoris", "同 L2–4 femoral control。"),
      entry("vastus-medialis", "第二個 femoral control。")
    ],
    discriminators: [
      entry("lumbar-paraspinals", "root control。"),
      entry("tibialis-anterior", "distal L4–5 control。")
    ],
    conditional: [
      entry("iliopsoas", "upper lumbar plexus control；高風險。", "femoral controls 亦異常")
    ],
    compareIds: ["l3-radiculopathy", "lumbar-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["單一 adductor longus 異常不足以定位閉孔神經；需更多臨床與 EDX 證據。"],
    sourceIds: ["pmr-lsplexus"]
  },
  {
    id: "sciatic-neuropathy",
    region: "lower",
    type: "nerve",
    labelZh: "坐骨神經病變",
    labelEn: "Sciatic neuropathy",
    lesionNodeId: "tibial-division-sciatic",
    shortCode: "Sciatic n.",
    summary: "同時取樣 fibular 與 tibial divisions 的 proximal/distal 肌，加入 gluteal、adductor 與 paraspinal controls。",
    required: [
      entry("biceps-femoris-short", "fibular division、腓骨頭近端 control；建議超音波。"),
      entry("tibialis-anterior", "distal fibular division。"),
      entry("biceps-femoris-long", "proximal tibial division。"),
      entry("medial-gastrocnemius", "distal tibial division。")
    ],
    discriminators: [
      entry("tensor-fasciae-latae", "proximal non-sciatic L5 control。"),
      entry("gluteus-maximus", "proximal non-sciatic S1 control。")
    ],
    conditional: [
      entry("adductor-longus", "non-sciatic upper plexus control。", "需排除 plexopathy"),
      entry("lumbar-paraspinals", "root control。", "需排除 radiculopathy")
    ],
    compareIds: ["l5-radiculopathy", "common-fibular-neuropathy", "lumbosacral-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["Sciatic neuropathy 常以 fibular division 受累較重；不應只依 TA 異常定位。"],
    sourceIds: ["pmr-lsplexus"]
  },
  {
    id: "common-fibular-neuropathy",
    region: "lower",
    type: "nerve",
    labelZh: "腓骨頭層級腓總神經病變",
    labelEn: "Common fibular neuropathy at the fibular head",
    lesionNodeId: "superficial-fibular",
    shortCode: "Common fibular n.",
    summary: "同時取樣 deep 與 superficial fibular muscles，使用 biceps short head、TP/TFL 與 paraspinal 決定病灶高低。",
    required: [
      entry("tibialis-anterior", "deep fibular target。"),
      entry("fibularis-longus", "superficial fibular target。"),
      entry("biceps-femoris-short", "腓骨頭近端 fibular-division control；建議超音波。"),
      entry("tibialis-posterior", "同 L5 non-fibular control；深層高風險。")
    ],
    discriminators: [
      entry("tensor-fasciae-latae", "proximal non-sciatic L5 control。"),
      entry("lumbar-paraspinals", "root control。")
    ],
    conditional: [
      entry("extensor-hallucis-longus", "第二塊 deep fibular target。", "TA 異常"),
      entry("gluteus-medius", "第二塊 proximal L5 control。", "TFL 異常")
    ],
    compareIds: ["l5-radiculopathy", "sciatic-neuropathy"],
    diagnosticRule: peripheralRule,
    caveats: ["若 biceps short head 亦異常，病灶可能位於 sciatic nerve 或更近端。"],
    sourceIds: ["pmr-lsplexus", "needle-accuracy"]
  },
  {
    id: "tibial-neuropathy",
    region: "lower",
    type: "nerve",
    labelZh: "脛神經病變",
    labelEn: "Tibial neuropathy",
    lesionNodeId: "tibial",
    shortCode: "Tibial n.",
    summary: "由 hamstring 至 calf、deep flexor 與 foot intrinsic 建立 tibial 長軸，並以 fibular/gluteal controls 排除 S1 root 或 sciatic。",
    required: [
      entry("medial-gastrocnemius", "易取樣的 proximal calf target。"),
      entry("soleus", "第二個 proximal tibial target。"),
      entry("flexor-digitorum-longus", "deep distal tibial target；建議超音波。"),
      entry("abductor-hallucis", "medial plantar distal target。")
    ],
    discriminators: [
      entry("biceps-femoris-long", "sciatic tibial-division proximal control。"),
      entry("fibularis-longus", "S1 non-tibial control。")
    ],
    conditional: [
      entry("gluteus-maximus", "non-sciatic S1 control。", "需排除 S1 root"),
      entry("lumbar-paraspinals", "root control。", "proximal controls 亦異常")
    ],
    compareIds: ["s1-radiculopathy", "sciatic-neuropathy"],
    diagnosticRule: peripheralRule,
    caveats: ["足內在肌在無症狀者亦可能有異常，不宜單獨定位 tarsal tunnel。"],
    sourceIds: ["pmr-lsplexus", "pmr-poly"]
  },
  {
    id: "superior-gluteal-neuropathy",
    region: "lower",
    type: "nerve",
    labelZh: "上臀神經病變",
    labelEn: "Superior gluteal neuropathy",
    lesionNodeId: "superior-gluteal",
    shortCode: "Superior gluteal n.",
    summary: "以 TFL 與 gluteus medius 確認，使用其他 L5 routes 與 paraspinal 排除 root／plexus。",
    required: [
      entry("tensor-fasciae-latae", "易取樣 target。"),
      entry("gluteus-medius", "第二個 superior gluteal target。"),
      entry("tibialis-anterior", "L5 deep fibular control。")
    ],
    discriminators: [
      entry("tibialis-posterior", "L5 tibial control；深層高風險。"),
      entry("lumbar-paraspinals", "root control。")
    ],
    conditional: [
      entry("gluteus-maximus", "inferior gluteal control。", "需排除 plexopathy")
    ],
    compareIds: ["l5-radiculopathy", "lumbosacral-plexopathy"],
    diagnosticRule: peripheralRule,
    caveats: ["Gluteus medius 可能較深；肥胖或解剖不清時使用超音波。"],
    sourceIds: ["pmr-lsplexus"]
  },
  {
    id: "motor-neuron-disease",
    region: "general",
    type: "general",
    labelZh: "運動神經元疾病篩檢",
    labelEn: "Motor neuron disease screen",
    shortCode: "MND screen",
    summary: "以最少肌肉探索 cervical、lumbosacral 與 thoracic/bulbar regions；發現三區神經原性改變後可停止擴張。",
    required: [
      entry("deltoid", "cervical proximal muscle。"),
      entry("fdi", "cervical distal muscle，與 deltoid 不同 root/nerve。"),
      entry("vastus-lateralis", "lumbosacral proximal muscle。"),
      entry("tibialis-anterior", "lumbosacral distal muscle。")
    ],
    discriminators: [
      entry("cervical-paraspinals", "axial cervical region。"),
      entry("lumbar-paraspinals", "axial lumbosacral region。")
    ],
    conditional: [
      entry("triceps-brachii", "若上肢需要第二條 neurogenic route。", "cervical region 初篩正常但臨床可疑"),
      entry("medial-gastrocnemius", "若下肢需要 S1 route。", "lumbosacral 初篩正常但臨床可疑")
    ],
    compareIds: ["myopathy-screen", "polyneuropathy-screen"],
    diagnosticRule:
      "先從最明顯受累肢體開始，每一肢體區域至少取樣一塊 proximal 與一塊 distal、且不同 root 與 nerve 的肌肉；再依結果擴張至 thoracic 與 bulbar muscles。",
    caveats: [
      "完整 ALS/MND 評估通常需 thoracic（T6–T10 paraspinal 或腹肌）與 bulbar muscle；本版依使用者範圍僅含 cervical/lumbar paraspinals，會在畫面明確提示轉入完整 protocol。",
      "MND 診斷必須排除可治療 mimics；needle-only 模式並不構成完整 EDX。"
    ],
    sourceIds: ["als-review"]
  },
  {
    id: "myopathy-screen",
    region: "general",
    type: "general",
    labelZh: "肌病變篩檢",
    labelEn: "Myopathy screen",
    shortCode: "Myopathy",
    summary: "以臨床弱肌為優先，至少含 proximal、distal 與 paraspinal；保留未扎過的對側肌供 biopsy。",
    required: [
      entry("deltoid", "upper-limb proximal muscle。"),
      entry("biceps-brachii", "容易評估 recruitment 的 proximal muscle。"),
      entry("vastus-lateralis", "lower-limb proximal muscle。"),
      entry("tibialis-anterior", "distal control。")
    ],
    discriminators: [
      entry("cervical-paraspinals", "axial involvement。"),
      entry("lumbar-paraspinals", "axial involvement。")
    ],
    conditional: [
      entry("fdi", "若疑 distal myopathy 或需 neurogenic control。", "distal weakness"),
      entry("gluteus-medius", "若 pelvic-girdle weakness 明顯。", "hip abduction weakness")
    ],
    compareIds: ["motor-neuron-disease", "polyneuropathy-screen"],
    diagnosticRule:
      "優先取樣臨床弱但未嚴重萎縮的肌肉，尋找 short-duration、low-amplitude、early-recruiting MUAP；必要時加入 spontaneous activity 最可能出現的 proximal／paraspinal muscle。",
    caveats: [
      "若可能進行 muscle biopsy，避免在預定 biopsy 側／肌肉先做 needle EMG。",
      "部分肌病（例如 steroid myopathy）可有正常 EMG；結果需結合 CK、影像、基因或病理。"
    ],
    sourceIds: ["myopathy-review", "needle-systematic"]
  },
  {
    id: "polyneuropathy-screen",
    region: "general",
    type: "general",
    labelZh: "多發性周邊神經病變針極篩檢",
    labelEn: "Polyneuropathy needle screen",
    shortCode: "Polyneuropathy",
    summary: "以 distal lower limb 為主，加入 proximal、paraspinal 與 upper-limb distal muscle 判斷長度依賴型態。",
    required: [
      entry("tibialis-anterior", "distal lower-limb deep fibular muscle。"),
      entry("medial-gastrocnemius", "distal lower-limb tibial muscle。"),
      entry("fdi", "upper-limb distal comparison。"),
      entry("vastus-lateralis", "proximal lower-limb control。")
    ],
    discriminators: [
      entry("lumbar-paraspinals", "排除伴隨 radiculopathy。"),
      entry("abductor-hallucis", "foot intrinsic；需保守解讀。")
    ],
    conditional: [
      entry("edb", "加入更遠端 deep fibular muscle，確認 length-dependent gradient。", "任一 distal leg muscle 異常"),
      entry("deltoid", "若上肢 distal muscle 異常，加入 proximal upper-limb control。", "FDI 異常")
    ],
    compareIds: ["motor-neuron-disease", "myopathy-screen"],
    diagnosticRule:
      "needle pattern 應呈 length-dependent、distal greater than proximal、跨多條周邊神經；單側或 myotomal pattern 應改查 focal neuropathy／radiculopathy。",
    caveats: [
      "完整 polyneuropathy 評估通常需要 NCS；本模式只提供 needle sampling，不能單獨分類 demyelinating vs axonal neuropathy。",
      "Foot intrinsic muscles 在高齡無症狀者也可能有 spontaneous activity。"
    ],
    sourceIds: ["pmr-poly"]
  }
];

export const protocolById = new Map(
  protocols.map((protocol) => [protocol.id, protocol])
);
