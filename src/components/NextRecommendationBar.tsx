import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { NextRecommendation } from "../logic/recommendations";

interface NextRecommendationBarProps {
  recommendation: NextRecommendation | null;
  onSelect: (id: string) => void;
}

export function NextRecommendationBar({
  recommendation,
  onSelect
}: NextRecommendationBarProps) {
  if (!recommendation) {
    return (
      <div className="next-bar complete">
        <CheckCircle2 size={22} />
        <div>
          <strong>目前方案已完成</strong>
          <span>請依型態、病人耐受度與臨床問題決定是否停止。</span>
        </div>
      </div>
    );
  }

  const { muscle } = recommendation.planned;
  return (
    <button className="next-bar" onClick={() => onSelect(muscle.id)}>
      <span className="next-arrow">
        <ArrowRight size={21} />
      </span>
      <span>
        <strong>
          下一塊：{muscle.nameZh} <small>{muscle.nameEn}</small>
        </strong>
        <span>{recommendation.reason}</span>
      </span>
      <ArrowRight className="next-chevron" size={19} />
    </button>
  );
}
