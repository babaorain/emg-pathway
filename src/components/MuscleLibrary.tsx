import { useDeferredValue, useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { muscles } from "../data/muscles";
import type { Region, RiskLevel } from "../types";

interface MuscleLibraryProps {
  region: Region;
  selectedMuscleId: string | null;
  onSelectMuscle: (id: string) => void;
}

const riskLabels: Record<RiskLevel, string> = {
  low: "一般",
  caution: "注意",
  high: "高風險"
};

export function MuscleLibrary({
  region,
  selectedMuscleId,
  onSelectMuscle
}: MuscleLibraryProps) {
  const [query, setQuery] = useState("");
  const [rootFilter, setRootFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const regionMuscles = useMemo(
    () =>
      muscles.filter((muscle) =>
        region === "general" ? true : muscle.region === region
      ),
    [region]
  );

  const roots = useMemo(
    () =>
      Array.from(
        new Set(
          regionMuscles.flatMap((muscle) =>
            muscle.roots.map((item) => item.root)
          )
        )
      ).sort(),
    [regionMuscles]
  );

  const visible = useMemo(
    () =>
      regionMuscles
        .filter((muscle) => {
          const text = [
            muscle.nameZh,
            muscle.nameEn,
            muscle.nerveZh,
            muscle.nerveEn,
            muscle.actionZh,
            muscle.actionEn,
            ...muscle.roots.map((item) => item.root)
          ]
            .join(" ")
            .toLowerCase();
          const rootMatches =
            rootFilter === "all" ||
            muscle.roots.some((item) => item.root === rootFilter);
          const riskMatches =
            riskFilter === "all" || muscle.risk === riskFilter;
          return (
            text.includes(deferredQuery) && rootMatches && riskMatches
          );
        })
        .sort(
          (a, b) =>
            b.specificity - a.specificity ||
            b.ease - a.ease ||
            a.nameEn.localeCompare(b.nameEn)
        ),
    [deferredQuery, regionMuscles, riskFilter, rootFilter]
  );

  return (
    <section className="muscle-library" aria-labelledby="muscle-library-title">
      <div className="library-heading">
        <div>
          <h2 id="muscle-library-title">肌肉搜尋與篩選</h2>
          <p>依神經根、周邊神經、動作與進針風險快速反查。</p>
        </div>
        <span>{visible.length} muscles</span>
      </div>

      <div className="library-toolbar">
        <label className="library-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋中文、英文、nerve 或 action"
          />
        </label>
        <label>
          <SlidersHorizontal size={15} />
          <select
            aria-label="依神經根篩選"
            value={rootFilter}
            onChange={(event) => setRootFilter(event.target.value)}
          >
            <option value="all">全部神經根</option>
            {roots.map((root) => (
              <option value={root} key={root}>
                {root}
              </option>
            ))}
          </select>
        </label>
        <label>
          <AlertTriangle size={15} />
          <select
            aria-label="依進針風險篩選"
            value={riskFilter}
            onChange={(event) =>
              setRiskFilter(event.target.value as RiskLevel | "all")
            }
          >
            <option value="all">全部風險</option>
            <option value="low">一般</option>
            <option value="caution">注意</option>
            <option value="high">高風險</option>
          </select>
        </label>
      </div>

      <div className="muscle-table-wrap">
        <table className="muscle-table">
          <thead>
            <tr>
              <th>肌肉 Muscle</th>
              <th>神經根 Root</th>
              <th>周邊神經 Nerve</th>
              <th>主要動作 Action</th>
              <th>鑑別力</th>
              <th>進針</th>
              <th aria-label="查看詳細資訊" />
            </tr>
          </thead>
          <tbody>
            {visible.map((muscle) => (
              <tr
                key={muscle.id}
                className={
                  selectedMuscleId === muscle.id ? "selected" : undefined
                }
                onClick={() => onSelectMuscle(muscle.id)}
              >
                <td>
                  <strong>{muscle.nameZh}</strong>
                  <small>{muscle.nameEn}</small>
                </td>
                <td>
                  {muscle.roots.map((item) => (
                    <span
                      className={`root-emphasis ${item.emphasis}`}
                      key={item.root}
                    >
                      {item.root}
                    </span>
                  ))}
                </td>
                <td>
                  {muscle.nerveZh}
                  <small>{muscle.nerveEn}</small>
                </td>
                <td>
                  {muscle.actionZh}
                  <small>{muscle.actionEn}</small>
                </td>
                <td>
                  <span className="score-dots" aria-label={`${muscle.specificity} / 5`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <i
                        key={index}
                        className={index < muscle.specificity ? "filled" : ""}
                      />
                    ))}
                  </span>
                </td>
                <td>
                  <span className={`risk-label ${muscle.risk}`}>
                    {riskLabels[muscle.risk]}
                  </span>
                </td>
                <td>
                  {/* Real button so the row is reachable by keyboard without
                      breaking the table's row/cell semantics. */}
                  <button
                    className="row-open-button"
                    aria-label={`查看 ${muscle.nameZh} ${muscle.nameEn} 詳細資訊`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectMuscle(muscle.id);
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? (
          <div className="empty-table">找不到符合條件的肌肉。</div>
        ) : null}
      </div>
    </section>
  );
}
