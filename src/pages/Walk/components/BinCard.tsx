import { useState } from "react";
import BulletIcon from "../../../assets/icons/bullet.svg?react";
import { useNavigate } from "react-router-dom";
import type { BinLocationData } from "../Walk";
import { formatDistance } from "../../../utils/formatDistance";
import ShineIcon from "../../../assets/icons/ai_fill.svg?react";
import useUserStore from "../../../store/useUserStore";
import api from "../../../api/axios";
import RouteLoading from "./RouteLoading";

interface BinCardProps {
  info: BinLocationData;
  isSelected: boolean;
  onClick: () => void;
  myLocation: { lat: number; lng: number };
}

export default function BinCard({
  info,
  isSelected,
  onClick,
  myLocation,
}: BinCardProps) {
  const navigate = useNavigate();
  const { id: userId } = useUserStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDirectGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || !myLocation) return;

    try {
      setIsGenerating(true);
      const requestBody = {
        userId: userId,
        currentLatitude: myLocation.lat,
        currentLongitude: myLocation.lng,
        destinationIds: [info.id],
        filter: {
          activityLevel: "MODERATE",
          includeRestPoints: true,
          notifyEcoMart: true,
          notifyWalkingProgress: true,
        },
      };

      const response = await api.post("/routes/generate", requestBody);

      navigate(`/walk/preview/${info.id}`, {
        state: {
          routeData: response.data,
          binId: info.id,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`p-4 mx-2 rounded-2xl flex flex-col gap-2 shadow-card cursor-pointer border-[1.5px] transition-all ${
          isSelected
            ? "bg-primary-extralight border-primary"
            : "bg-white border-transparent"
        }`}
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
            도보 {info.estimatedWalkTimeMinutes}분
          </span>
          <BulletIcon className="text-[#7A8396] w-4 h-4" />
          <span className="text-caption3_r_13 text-[#6C727C]">
            {info.estimatedSteps}보
          </span>
        </div>
        {isSelected && (
          <button
            onClick={handleDirectGenerate}
            className="w-full py-3 mt-1 text-sub4_sb_14 bg-primary text-white rounded-lg flex justify-center items-center gap-1.5"
          >
            <ShineIcon className="text-white w-4 h-4" />
            <span>맞춤 경로 추천받기</span>
          </button>
        )}
      </div>

      {isGenerating && <RouteLoading />}
    </>
  );
}
