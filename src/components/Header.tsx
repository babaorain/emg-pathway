import { BookOpen, CloudOff, PanelLeft, Printer } from "lucide-react";
import type { Region } from "../types";

interface HeaderProps {
  region: Region;
  online: boolean;
  onRegionChange: (region: Region) => void;
  onPrint: () => void;
  onOpenSources: () => void;
  onOpenMobileNav: () => void;
}

const regions: Array<{ id: Region; label: string }> = [
  { id: "upper", label: "上肢" },
  { id: "lower", label: "下肢" },
  { id: "general", label: "全身型態" }
];

export function Header({
  region,
  online,
  onRegionChange,
  onPrint,
  onOpenSources,
  onOpenMobileNav
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <button
          className="icon-button mobile-only"
          aria-label="開啟病灶選單"
          onClick={onOpenMobileNav}
        >
          <PanelLeft size={20} />
        </button>
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <strong>EMG Pathway</strong>
          <span>肌電路徑選肌</span>
        </div>
      </div>

      <nav className="region-switch" aria-label="檢查區域">
        {regions.map((item) => (
          <button
            key={item.id}
            className={region === item.id ? "active" : ""}
            onClick={() => onRegionChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        {/* Only surfaced when it actually matters — a permanent "cache ready"
            badge was constant chrome for a non-event. */}
        {online ? null : (
          <span className="offline-state">
            <CloudOff size={15} />
            <span>離線使用中</span>
          </span>
        )}
        <button
          className="text-button"
          onClick={onOpenSources}
          title="臨床用途、限制與內容依據"
        >
          <BookOpen size={17} />
          <span>依據與限制</span>
        </button>
        <button
          className="text-button"
          onClick={onPrint}
          aria-label="列印方案"
          title="列印方案"
        >
          <Printer size={17} />
          <span>列印</span>
        </button>
      </div>
    </header>
  );
}
