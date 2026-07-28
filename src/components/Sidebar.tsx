import { ChevronRight, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useOverlay } from "../hooks/useOverlay";
import type { Protocol, ProtocolType, Region } from "../types";

interface SidebarProps {
  region: Region;
  protocols: Protocol[];
  selectedProtocolId: string;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

const filters: Array<{ id: ProtocolType | "all"; label: string }> = [
  { id: "all", label: "全部" },
  { id: "root", label: "神經根" },
  { id: "plexus", label: "神經叢" },
  { id: "nerve", label: "周邊神經" },
  { id: "general", label: "全身型態" }
];

export function Sidebar({
  region,
  protocols,
  selectedProtocolId,
  open,
  onClose,
  onSelect
}: SidebarProps) {
  // Only engages while the mobile drawer is open; on desktop `open` stays false
  // and the sidebar behaves as ordinary in-page content.
  const containerRef = useOverlay<HTMLElement>(open, onClose);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ProtocolType | "all">(
    region === "general" ? "general" : "all"
  );

  useEffect(() => {
    setType(region === "general" ? "general" : "all");
    setQuery("");
  }, [region]);

  const visible = protocols.filter((protocol) => {
    const matchesType = type === "all" || protocol.type === type;
    const text =
      `${protocol.labelZh} ${protocol.labelEn} ${protocol.shortCode}`.toLowerCase();
    return matchesType && text.includes(query.trim().toLowerCase());
  });

  return (
    <>
      <div
        className={`sidebar-scrim ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={containerRef}
        tabIndex={-1}
        className={`sidebar ${open ? "open" : ""}`}
      >
        <div className="sidebar-mobile-title">
          <strong>選擇臨床目標</strong>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="關閉"
            data-autofocus
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={16} />
          <input
            aria-label="搜尋病灶"
            placeholder="搜尋 root、nerve、lesion"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="type-filter" aria-label="病灶類型">
          {filters
            .filter((item) =>
              region === "general"
                ? item.id === "general"
                : item.id !== "general"
            )
            .map((item) => (
              <button
                key={item.id}
                className={type === item.id ? "active" : ""}
                onClick={() => setType(item.id)}
              >
                {item.label}
              </button>
            ))}
        </div>

        {/* A navigation list, not a form control — `listbox`/`option` would
            promise arrow-key semantics this doesn't implement. */}
        <nav className="protocol-list" aria-label="病灶清單">
          {visible.map((protocol) => (
            <button
              key={protocol.id}
              aria-current={
                selectedProtocolId === protocol.id ? "true" : undefined
              }
              className={
                selectedProtocolId === protocol.id ? "selected" : undefined
              }
              onClick={() => {
                onSelect(protocol.id);
                onClose();
              }}
            >
              <span>
                <strong>{protocol.labelZh}</strong>
                <small>{protocol.labelEn}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
          {visible.length === 0 ? (
            <p className="empty-copy">沒有符合條件的病灶。</p>
          ) : null}
        </nav>

        <div className="sidebar-note">
          <strong>選肌邏輯</strong>
          <p>同 root 跨周邊神經；同 nerve 跨病灶近遠端；優先容易進針的高鑑別力肌肉。</p>
        </div>
      </aside>
    </>
  );
}
