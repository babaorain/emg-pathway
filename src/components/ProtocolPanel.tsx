import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  GitCompareArrows,
  Info,
  RotateCcw,
  Sparkles,
  Trash2
} from "lucide-react";
import { muscleById } from "../data/muscles";
import { buildPlan, planCompletion } from "../logic/recommendations";
import type {
  MuscleResult,
  PlanTier,
  Protocol,
  ResultMap,
  ResultState
} from "../types";

interface ProtocolPanelProps {
  protocol: Protocol;
  results: ResultMap;
  customMuscleIds: string[];
  onChangeResult: (muscleId: string, result: MuscleResult) => void;
  onSelectMuscle: (muscleId: string) => void;
  onRemoveCustom: (muscleId: string) => void;
  onReset: () => void;
  onCompare: () => void;
}

const tierLabels: Record<
  PlanTier,
  { number: number; zh: string; en: string; description: string }
> = {
  required: {
    number: 1,
    zh: "必查",
    en: "Essential",
    description: "建立最小可判讀骨架"
  },
  discriminator: {
    number: 2,
    zh: "鑑別用",
    en: "For differentiation",
    description: "跨神經或近遠端控制"
  },
  conditional: {
    number: 3,
    zh: "視結果追加",
    en: "Add based on results",
    description: "依異常型態擴張"
  }
};

const resultOptions: Array<{ id: ResultState; label: string }> = [
  { id: "normal", label: "正常" },
  { id: "abnormal", label: "異常" }
];

export function ProtocolPanel({
  protocol,
  results,
  customMuscleIds,
  onChangeResult,
  onSelectMuscle,
  onRemoveCustom,
  onReset,
  onCompare
}: ProtocolPanelProps) {
  const plan = buildPlan(protocol);
  const completion = planCompletion(protocol, results);

  return (
    <aside className="protocol-panel" aria-labelledby="protocol-title">
      <div className="protocol-header">
        <div>
          <span className="protocol-code">{protocol.shortCode}</span>
          <h2 id="protocol-title">{protocol.labelZh}</h2>
          <p>{protocol.labelEn}</p>
        </div>
        <div className="protocol-header-actions">
          <button
            className="icon-button"
            aria-label="重設檢查結果"
            onClick={onReset}
          >
            <RotateCcw size={17} />
          </button>
          <button className="icon-text-button" onClick={onCompare}>
            <GitCompareArrows size={16} />
            比較
          </button>
        </div>
      </div>

      <p className="protocol-summary">{protocol.summary}</p>

      <div className="completion-line">
        <div>
          <span
            style={{
              width: `${
                completion.requiredTotal
                  ? (completion.requiredDone / completion.requiredTotal) * 100
                  : 0
              }%`
            }}
          />
        </div>
        <small>
          必查 {completion.requiredDone}/{completion.requiredTotal} · 全方案{" "}
          {completion.allDone}/{completion.allTotal}
        </small>
      </div>

      <div className="protocol-tiers">
        {(["required", "discriminator", "conditional"] as PlanTier[]).map(
          (tier) => {
            const meta = tierLabels[tier];
            const rows = plan.filter((item) => item.tier === tier);
            return (
              <section className={`protocol-tier tier-${tier}`} key={tier}>
                <div className="tier-heading">
                  <span className="tier-number">{meta.number}</span>
                  <div>
                    <strong>
                      {meta.zh} <small>{meta.en}</small>
                    </strong>
                    <span>{meta.description}</span>
                  </div>
                </div>
                <div className="tier-rows">
                  {rows.map(({ muscle, entry }) => {
                    const current = results[muscle.id] ?? {
                      tested: false,
                      result: "untested"
                    };
                    return (
                      <div className="protocol-row" key={muscle.id}>
                        <button
                          className="muscle-row-main"
                          onClick={() => onSelectMuscle(muscle.id)}
                        >
                          <span>
                            <strong>{muscle.nameZh}</strong>
                            <small>{muscle.nameEn}</small>
                          </span>
                          <span className="row-meta">
                            {muscle.roots
                              .filter((item) => item.emphasis === "primary")
                              .map((item) => item.root)
                              .join("–")}{" "}
                            · {muscle.nerveEn}
                          </span>
                          {muscle.risk === "high" ? (
                            <AlertTriangle
                              className="high-risk-icon"
                              size={16}
                              aria-label="高風險進針"
                            />
                          ) : null}
                          <ChevronRight size={16} />
                        </button>

                        <div className="row-reason">
                          <Info size={14} />
                          <span>{entry.reason}</span>
                        </div>

                        <div className="result-controls">
                          <button
                            className={`tested-toggle ${
                              current.tested ? "active" : ""
                            }`}
                            onClick={() =>
                              onChangeResult(muscle.id, {
                                tested: !current.tested,
                                result: current.tested
                                  ? "untested"
                                  : current.result === "untested"
                                    ? "normal"
                                    : current.result
                              })
                            }
                            aria-pressed={current.tested}
                          >
                            {current.tested ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Circle size={16} />
                            )}
                            已檢查
                          </button>
                          {resultOptions.map((option) => (
                            <button
                              key={option.id}
                              disabled={!current.tested}
                              className={`result-option ${option.id} ${
                                current.result === option.id ? "active" : ""
                              }`}
                              onClick={() =>
                                onChangeResult(muscle.id, {
                                  tested: true,
                                  result: option.id
                                })
                              }
                              aria-pressed={current.result === option.id}
                            >
                              {current.result === option.id ? (
                                <Check size={14} />
                              ) : null}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }
        )}
      </div>

      {customMuscleIds.length > 0 ? (
        <section className="custom-plan">
          <div className="custom-plan-heading">
            <strong>本次加選</strong>
            <span>Custom additions</span>
          </div>
          {customMuscleIds.map((muscleId) => {
            const muscle = muscleById.get(muscleId);
            if (!muscle) return null;
            const current = results[muscle.id] ?? {
              tested: false,
              result: "untested"
            };
            return (
              <div className="custom-plan-row" key={muscle.id}>
                <button onClick={() => onSelectMuscle(muscle.id)}>
                  <span>
                    <strong>{muscle.nameZh}</strong>
                    <small>{muscle.nameEn}</small>
                  </span>
                  <span>
                    {muscle.roots
                      .filter((item) => item.emphasis === "primary")
                      .map((item) => item.root)
                      .join("–")}
                  </span>
                </button>
                <button
                  className={`custom-result ${
                    current.tested ? current.result : ""
                  }`}
                  onClick={() =>
                    onChangeResult(muscle.id, {
                      tested: true,
                      result:
                        current.result === "normal" ? "abnormal" : "normal"
                    })
                  }
                >
                  {current.tested
                    ? current.result === "abnormal"
                      ? "異常"
                      : "正常"
                    : "標記結果"}
                </button>
                <button
                  className="icon-button"
                  aria-label={`移除 ${muscle.nameZh}`}
                  onClick={() => onRemoveCustom(muscle.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </section>
      ) : null}

      <div className="diagnostic-rule">
        <Sparkles size={17} />
        <div>
          <strong>判讀停止規則</strong>
          <p>{protocol.diagnosticRule}</p>
        </div>
      </div>
    </aside>
  );
}
