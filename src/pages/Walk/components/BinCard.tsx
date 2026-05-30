import { useNavigate } from "react-router-dom";
import BulletIcon from "../../../assets/icons/bullet.svg?react";
import ShineIcon from "../../../assets/icons/ai_fill.svg?react";
import type { BinLocationData } from "../Walk";
import { formatDistance } from "../../../utils/formatDistance";

interface BinCardProps {
  info: BinLocationData;
  isSelected: boolean;
  onClick: () => void;
}

export default function BinCard({ info, isSelected, onClick }: BinCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={onClick}
      className={`p-4 mx-2 rounded-2xl flex flex-col gap-2 shadow-card ${isSelected ? "bg-primary-extralight border border-primary" : "bg-white"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sub3_sb_16 text-[#31353B]">{info.name}</p>
          <p className="text-caption3_r_13 text-[#6C727C]">{info.address}</p>
        </div>
        <div
          className={`text-sub4_sb_14 pl-2 pr-2.5 py-1.5 rounded-sm ${isSelected ? "text-white bg-primary" : "text-primary bg-[#F3F7FF]"}`}
        >
          + {info.baseRewardAmount}원
        </div>
      </div>
      <div className="flex gap-0.5 items-center">
        <span className="text-primary text-caption1_m_13">
          {formatDistance(info.distanceMeters)}
        </span>
        <BulletIcon className="text-[#7A8396] w-4 h-4" />
        <span className="text-caption3_r_13 text-[#6C727C]">
          도보 {info.walkingDistanceMeters}분
        </span>
        <BulletIcon className="text-[#7A8396] w-4 h-4" />
        <span className="text-caption3_r_13 text-[#6C727C]">
          {info.estimatedSteps}보
        </span>
      </div>
      {isSelected && (
        <button
          onClick={() => navigate(`/walk/filter/${info.id}`)}
          className="w-full py-3 mt-1 text-sub4_sb_14 bg-primary text-white rounded-lg flex justify-center items-center gap-1.5"
        >
          <ShineIcon className="text-white w-4 h-4" />
          <span>AI 맞춤 경로 디자인</span>
        </button>
      )}
    </div>
  );
}
