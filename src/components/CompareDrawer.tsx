import { Check, GitCompareArrows, X } from "lucide-react";
import { muscleById } from "../data/muscles";
import { protocolById } from "../data/protocols";
import type { Protocol } from "../types";

interface CompareDrawerProps {
  protocol: Protocol;
  compareId: string | null;
  open: boolean;
  onChangeCompare: (id: string) => void;
  onClose: () => void;
  onSelectMuscle: (id: string) => void;
}

export function CompareDrawer({
  protocol,
  compareId,
  open,
  onChangeCompare,
  onClose,
  onSelectMuscle
}: CompareDrawerProps) {
  const comparison = compareId ? protocolById.get(compareId) : null;
  const leftIds = new Set([
    ...protocol.required.map((item) => item.muscleId),
    ...protocol.discriminators.map((item) => item.muscleId)
  ]);
  const rightIds = new Set([
    ...(comparison?.required.map((item) => item.muscleId) ?? []),
    ...(comparison?.discriminators.map((item) => item.muscleId) ?? [])
  ]);
  const allIds = Array.from(new Set([...leftIds, ...rightIds]));

  return (
    <>
      <div
        className={`compare-scrim ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        className={`compare-drawer ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div className="compare-header">
          <div>
            <GitCompareArrows size={20} />
            <div>
              <h2>病灶鑑別比較</h2>
              <p>相同 root／nerve 的控制肌會比單一路徑更有定位價值。</p>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="關閉">
            <X size={20} />
          </button>
        </div>

        <div className="compare-selectors">
          <div>
            <span>目前目標</span>
            <strong>{protocol.labelZh}</strong>
            <small>{protocol.labelEn}</small>
          </div>
          <span className="versus">VS</span>
          <label>
            <span>比較病灶</span>
            <select
              value={compareId ?? ""}
              onChange={(event) => onChangeCompare(event.target.value)}
            >
              {protocol.compareIds.map((id) => {
                const item = protocolById.get(id);
                return item ? (
                  <option value={id} key={id}>
                    {item.labelZh} · {item.labelEn}
                  </option>
                ) : null;
              })}
            </select>
          </label>
        </div>

        {comparison ? (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>肌肉 Muscle</th>
                  <th>{protocol.shortCode}</th>
                  <th>{comparison.shortCode}</th>
                  <th>鑑別價值</th>
                </tr>
              </thead>
              <tbody>
                {allIds.map((id) => {
                  const muscle = muscleById.get(id);
                  if (!muscle) return null;
                  const left = leftIds.has(id);
                  const right = rightIds.has(id);
                  return (
                    <tr key={id} onClick={() => onSelectMuscle(id)}>
                      <td>
                        <strong>{muscle.nameZh}</strong>
                        <small>{muscle.nameEn}</small>
                      </td>
                      <td>{left ? <Check size={17} /> : "—"}</td>
                      <td>{right ? <Check size={17} /> : "—"}</td>
                      <td>
                        {left && right
                          ? "共同受影響：用於確認嚴重度"
                          : "差異肌：有助病灶定位"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="compare-rules">
              <div>
                <strong>{protocol.labelZh}</strong>
                <p>{protocol.diagnosticRule}</p>
              </div>
              <div>
                <strong>{comparison.labelZh}</strong>
                <p>{comparison.diagnosticRule}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="empty-copy">此 protocol 尚未設定比較病灶。</p>
        )}
      </section>
    </>
  );
}
