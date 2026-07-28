import { ExternalLink, ShieldCheck, X } from "lucide-react";
import { sources } from "../data/sources";
import { useOverlay } from "../hooks/useOverlay";

interface SourcesModalProps {
  open: boolean;
  onClose: () => void;
}

export function SourcesModal({ open, onClose }: SourcesModalProps) {
  const containerRef = useOverlay<HTMLElement>(open, onClose);

  return (
    <div
      className={`modal-shell ${open ? "open" : ""}`}
      aria-hidden={!open}
    >
      <div className="modal-scrim" onClick={onClose} aria-hidden="true" />
      <section
        ref={containerRef}
        tabIndex={-1}
        className="sources-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sources-modal-title"
      >
        <div className="modal-header">
          <div>
            <ShieldCheck size={22} />
            <div>
              <h2 id="sources-modal-title">臨床用途、限制與內容依據</h2>
              <p>Physician-facing decision support · 不是自動診斷系統</p>
            </div>
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

        <div className="limits-copy">
          <p>
            本工具供受過訓練的復健科／電診醫師規劃 needle EMG。建議方案不能取代病史、理學檢查、完整
            EDX、個別出血／感染風險評估、解剖變異或超音波導引。
          </p>
          <ul>
            <li>不輸入或儲存姓名、病歷號等病人識別資料。</li>
            <li>標示「高風險」的胸壁或深層肌肉，不應因網頁建議而降低操作門檻。</li>
            <li>Root innervation 具有個體與文獻差異；畫面以「主要／次要」呈現而非假裝單一確定值。</li>
            <li>Generalized protocols 在 needle-only 模式下是不完整 EDX，畫面會保留警告。</li>
          </ul>
        </div>

        <div className="source-list">
          {sources.map((source) => (
            <article key={source.id}>
              <div>
                <strong>{source.title}</strong>
                <span>{source.organization}</span>
                <p>{source.note}</p>
              </div>
              {source.url ? (
                <a href={source.url} target="_blank" rel="noreferrer">
                  開啟來源 <ExternalLink size={14} />
                </a>
              ) : (
                <span className="source-local">使用者提供 PDF</span>
              )}
            </article>
          ))}
        </div>

        <div className="modal-footer">
          <span>Content review date · 2026-07-28</span>
          <button className="primary-button" onClick={onClose}>
            我了解，返回工具
          </button>
        </div>
      </section>
    </div>
  );
}
