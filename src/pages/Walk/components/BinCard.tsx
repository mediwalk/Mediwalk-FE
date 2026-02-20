import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import type { BinLocationData } from "../Walk";

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
      className={`p-5 w-full border rounded-2xl flex flex-col gap-2 shadow-sm ${isSelected ? "bg-primary-extralight border-primary" : "white border-gray-100"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold ">{info.name}</p>
          <p className="text-xs text-gray-500">{info.address}</p>
        </div>
        <div
          className={`font-medium text-sm px-3 py-1.5 rounded-md ${isSelected ? "text-white bg-primary" : "text-primary bg-[#F3F7FF]"}`}
        >
          + {info.baseRewardAmount}원
        </div>
      </div>
      <div className="text-xs ">
        <span className="text-primary font-medium">{info.distanceMeters}m</span>
        <span className="text-gray-500">
          {" "}
          {/*• 도보 {info.walkingDistanceMeters}분*/} • {info.estimatedSteps}
          걸음
        </span>
      </div>
      {isSelected && (
        <button
          onClick={() => navigate(`/walk/filter/${info.id}`)}
          className="w-full py-3 mt-1 text-sm font-semibold bg-primary text-white rounded-lg flex justify-center items-center gap-2"
        >
          <BsStars className="size-4" />
          <span>AI 맞춤 경로 디자인</span>
        </button>
      )}
    </div>
  );
}
