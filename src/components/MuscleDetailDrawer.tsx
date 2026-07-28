import {
  AlertTriangle,
  ArrowDownRight,
  BookOpen,
  Crosshair,
  Gauge,
  MoveRight,
  PersonStanding,
  Plus,
  Ruler,
  ShieldAlert,
  X
} from "lucide-react";
import type { ReactNode } from "react";
import { muscleById } from "../data/muscles";
import { sourceById } from "../data/sources";
import { useOverlay } from "../hooks/useOverlay";
import type { Muscle } from "../types";

interface MuscleDetailDrawerProps {
  muscle: Muscle | null;
  open: boolean;
  inCurrentPlan: boolean;
  onClose: () => void;
  onAddToPlan: (id: string) => void;
  onSelectAlternative: (id: string) => void;
}

const riskCopy = {
  low: "一般風險",
  caution: "需注意解剖層次",
  high: "高風險／考慮超音波"
};

export function MuscleDetailDrawer({
  muscle,
  open,
  inCurrentPlan,
  onClose,
  onAddToPlan,
  onSelectAlternative
}: MuscleDetailDrawerProps) {
  const containerRef = useOverlay<HTMLElement>(open, onClose);

  if (!muscle) return null;

  const primaryRoots = muscle.roots
    .filter((item) => item.emphasis === "primary")
    .map((item) => item.root)
    .join("–");
  const secondaryRoots = muscle.roots
    .filter((item) => item.emphasis === "secondary")
    .map((item) => item.root)
    .join(", ");

  return (
    <>
      <div
        className={`drawer-scrim ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={containerRef}
        tabIndex={-1}
        role="dialog"
        className={`muscle-drawer ${open ? "open" : ""}`}
        aria-hidden={!open}
        aria-labelledby="muscle-detail-title"
      >
        <div className="drawer-handle" aria-hidden="true" />
        <div className="drawer-header">
          <div>
            <span className={`risk-heading ${muscle.risk}`}>
              {muscle.risk === "high" ? <AlertTriangle size={14} /> : null}
              {riskCopy[muscle.risk]}
            </span>
            <h2 id="muscle-detail-title">{muscle.nameZh}</h2>
            <p>{muscle.nameEn}</p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="關閉"
            data-autofocus
          >
            <X size={20} />
          </button>
        </div>

        <div className="detail-route">
          {muscle.path.map((segment, index) => (
            <span key={segment.id}>
              {index > 0 ? <MoveRight size={13} /> : null}
              <b>{segment.labelZh}</b>
            </span>
          ))}
        </div>

        <div className="detail-summary-grid">
          <div>
            <span>主要神經根</span>
            <strong>{primaryRoots}</strong>
            {secondaryRoots ? <small>次要：{secondaryRoots}</small> : null}
          </div>
          <div>
            <span>周邊神經</span>
            <strong>{muscle.nerveZh}</strong>
            <small>{muscle.nerveEn}</small>
          </div>
          <div>
            <span>主要動作</span>
            <strong>{muscle.actionZh}</strong>
            <small>{muscle.actionEn}</small>
          </div>
          <div>
            <span>實用評分</span>
            <strong>鑑別 {muscle.specificity}/5</strong>
            <small>容易進針 {muscle.ease}/5</small>
          </div>
        </div>

        <div className="technique-list">
          <DetailRow
            icon={<PersonStanding size={18} />}
            label="受檢者姿勢"
            value={muscle.position}
          />
          <DetailRow
            icon={<Crosshair size={18} />}
            label="解剖定位"
            value={muscle.landmark}
          />
          <DetailRow
            icon={<ArrowDownRight size={18} />}
            label="進針方向"
            value={muscle.direction}
          />
          <DetailRow
            icon={<Ruler size={18} />}
            label="建議針長"
            value={muscle.needle}
          />
          <DetailRow
            icon={<ShieldAlert size={18} />}
            label="安全注意"
            value={muscle.safety}
            warning
          />
          <DetailRow
            icon={<Gauge size={18} />}
            label="選用理由"
            value={muscle.whyUseful}
          />
        </div>

        {muscle.alternativeIds.length > 0 ? (
          <section className="alternatives">
            <h3>替代肌肉 Alternative</h3>
            <div>
              {muscle.alternativeIds.map((id) => {
                const alternative = muscleById.get(id);
                if (!alternative) return null;
                return (
                  <button
                    key={id}
                    onClick={() => onSelectAlternative(id)}
                  >
                    <span>
                      <strong>{alternative.nameZh}</strong>
                      <small>{alternative.nameEn}</small>
                    </span>
                    <MoveRight size={15} />
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="detail-sources">
          <h3>
            <BookOpen size={16} />
            內容依據
          </h3>
          <div>
            {muscle.sourceIds.map((id) => {
              const source = sourceById.get(id);
              if (!source) return null;
              return source.url ? (
                <a key={id} href={source.url} target="_blank" rel="noreferrer">
                  {source.organization} · {source.title}
                </a>
              ) : (
                <span key={id}>{source.title}</span>
              );
            })}
          </div>
        </section>

        <div className="drawer-actions">
          <button className="secondary-button" onClick={onClose}>
            查看完整路徑
          </button>
          <button
            className="primary-button"
            disabled={inCurrentPlan}
            onClick={() => onAddToPlan(muscle.id)}
          >
            {inCurrentPlan ? null : <Plus size={17} />}
            {inCurrentPlan ? "已在方案中" : "加入本次方案"}
          </button>
        </div>
      </aside>
    </>
  );
}

interface DetailRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  warning?: boolean;
}

function DetailRow({ icon, label, value, warning = false }: DetailRowProps) {
  return (
    <div className={warning ? "warning" : undefined}>
      <span className="detail-row-icon">{icon}</span>
      <strong>{label}</strong>
      <p>{value}</p>
    </div>
  );
}
