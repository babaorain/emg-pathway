import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, LockKeyhole } from "lucide-react";
import { CompareDrawer } from "./components/CompareDrawer";
import { Header } from "./components/Header";
import { MuscleDetailDrawer } from "./components/MuscleDetailDrawer";
import { MuscleLibrary } from "./components/MuscleLibrary";
import { NextRecommendationBar } from "./components/NextRecommendationBar";
import { PathwayCanvas } from "./components/PathwayCanvas";
import { ProtocolPanel } from "./components/ProtocolPanel";
import { Sidebar } from "./components/Sidebar";
import { SourcesModal } from "./components/SourcesModal";
import { muscleById } from "./data/muscles";
import { protocolById, protocols } from "./data/protocols";
import {
  buildPlan,
  getNextRecommendation
} from "./logic/recommendations";
import type {
  MuscleResult,
  Region,
  ResultMap
} from "./types";

const storageKey = "emg-pathway-state-v1";

interface PersistedState {
  resultsByProtocol: Record<string, ResultMap>;
  customByProtocol: Record<string, string[]>;
}

const readPersistedState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return { resultsByProtocol: {}, customByProtocol: {} };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      resultsByProtocol: parsed.resultsByProtocol ?? {},
      customByProtocol: parsed.customByProtocol ?? {}
    };
  } catch {
    return { resultsByProtocol: {}, customByProtocol: {} };
  }
};

const defaultProtocolForRegion: Record<Region, string> = {
  upper: "c7-radiculopathy",
  lower: "l5-radiculopathy",
  general: "motor-neuron-disease"
};

export default function App() {
  const [region, setRegion] = useState<Region>("upper");
  const [selectedProtocolId, setSelectedProtocolId] = useState(
    defaultProtocolForRegion.upper
  );
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>(
    "triceps-brachii"
  );
  const [persisted, setPersisted] = useState<PersistedState>(
    readPersistedState
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareId, setCompareId] = useState<string | null>(
    "radial-spiral-groove"
  );
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);

  const selectedProtocol =
    protocolById.get(selectedProtocolId) ??
    protocolById.get(defaultProtocolForRegion[region])!;

  const regionProtocols = useMemo(
    () => protocols.filter((protocol) => protocol.region === region),
    [region]
  );
  const results = persisted.resultsByProtocol[selectedProtocol.id] ?? {};
  const customMuscleIds = useMemo(
    () => persisted.customByProtocol[selectedProtocol.id] ?? [],
    [persisted.customByProtocol, selectedProtocol.id]
  );
  const selectedMuscle = selectedMuscleId
    ? muscleById.get(selectedMuscleId) ?? null
    : null;
  const plannedIds = useMemo(
    () =>
      new Set([
        ...buildPlan(selectedProtocol).map(({ muscle }) => muscle.id),
        ...customMuscleIds
      ]),
    [customMuscleIds, selectedProtocol]
  );
  const nextRecommendation = getNextRecommendation(
    selectedProtocol,
    results
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(persisted));
  }, [persisted]);

  useEffect(() => {
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, []);

  const selectProtocol = (id: string) => {
    const protocol = protocolById.get(id);
    if (!protocol) return;
    setSelectedProtocolId(id);
    const firstMuscleId = protocol.required[0]?.muscleId ?? null;
    setSelectedMuscleId(firstMuscleId);
    setCompareId(protocol.compareIds[0] ?? null);
    setDrawerOpen(false);
  };

  const changeRegion = (nextRegion: Region) => {
    setRegion(nextRegion);
    selectProtocol(defaultProtocolForRegion[nextRegion]);
  };

  const selectMuscle = (id: string) => {
    setSelectedMuscleId(id);
    setDrawerOpen(true);
  };

  const changeResult = (muscleId: string, next: MuscleResult) => {
    setPersisted((current) => ({
      ...current,
      resultsByProtocol: {
        ...current.resultsByProtocol,
        [selectedProtocol.id]: {
          ...(current.resultsByProtocol[selectedProtocol.id] ?? {}),
          [muscleId]: next
        }
      }
    }));
  };

  const resetProtocol = () => {
    setPersisted((current) => ({
      ...current,
      resultsByProtocol: {
        ...current.resultsByProtocol,
        [selectedProtocol.id]: {}
      }
    }));
  };

  const addCustomMuscle = (muscleId: string) => {
    setPersisted((current) => {
      const existing = current.customByProtocol[selectedProtocol.id] ?? [];
      if (existing.includes(muscleId)) return current;
      return {
        ...current,
        customByProtocol: {
          ...current.customByProtocol,
          [selectedProtocol.id]: [...existing, muscleId]
        }
      };
    });
  };

  const removeCustomMuscle = (muscleId: string) => {
    setPersisted((current) => ({
      ...current,
      customByProtocol: {
        ...current.customByProtocol,
        [selectedProtocol.id]: (
          current.customByProtocol[selectedProtocol.id] ?? []
        ).filter((id) => id !== muscleId)
      }
    }));
  };

  const selectGraphNode = (nodeId: string) => {
    const exact = regionProtocols.find(
      (protocol) => protocol.lesionNodeId === nodeId
    );
    if (exact) selectProtocol(exact.id);
  };

  return (
    <div className="app-shell">
      <Header
        region={region}
        online={online}
        onRegionChange={changeRegion}
        onPrint={() => window.print()}
        onOpenSources={() => setSourcesOpen(true)}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      <div className="clinical-strip">
        <AlertTriangle size={15} />
        <span>
          醫師專用決策支援：進針位置、方向與針長須依體型、解剖變異及超音波所見調整。
        </span>
        <button onClick={() => setSourcesOpen(true)}>查看限制</button>
      </div>

      <div className="app-body">
        <Sidebar
          region={region}
          protocols={regionProtocols}
          selectedProtocolId={selectedProtocol.id}
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onSelect={selectProtocol}
        />

        <main className="app-main">
          <div className="workspace-grid">
            <div className="workspace-primary">
              <PathwayCanvas
                protocol={selectedProtocol}
                selectedMuscleId={selectedMuscleId}
                onSelectMuscle={selectMuscle}
                onSelectNode={selectGraphNode}
              />
              <MuscleLibrary
                region={region}
                selectedMuscleId={selectedMuscleId}
                onSelectMuscle={selectMuscle}
              />
            </div>

            <ProtocolPanel
              protocol={selectedProtocol}
              results={results}
              customMuscleIds={customMuscleIds}
              onChangeResult={changeResult}
              onSelectMuscle={selectMuscle}
              onRemoveCustom={removeCustomMuscle}
              onReset={resetProtocol}
              onCompare={() => setCompareOpen(true)}
            />
          </div>

          <NextRecommendationBar
            recommendation={nextRecommendation}
            onSelect={selectMuscle}
          />

          <footer className="app-footer">
            <span>
              <LockKeyhole size={14} />
              本機狀態只保存在此瀏覽器；請勿輸入病人識別資料。
            </span>
            <button onClick={() => setSourcesOpen(true)}>
              內容校正與引用來源
            </button>
          </footer>
        </main>
      </div>

      <MuscleDetailDrawer
        muscle={selectedMuscle}
        open={drawerOpen}
        inCurrentPlan={
          selectedMuscle ? plannedIds.has(selectedMuscle.id) : false
        }
        onClose={() => setDrawerOpen(false)}
        onAddToPlan={addCustomMuscle}
        onSelectAlternative={selectMuscle}
      />

      <CompareDrawer
        protocol={selectedProtocol}
        compareId={compareId}
        open={compareOpen}
        onChangeCompare={setCompareId}
        onClose={() => setCompareOpen(false)}
        onSelectMuscle={selectMuscle}
      />

      <SourcesModal
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
      />
    </div>
  );
}
