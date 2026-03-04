import PillIcon from "../../../assets/icons/pill_fill.svg?react";
import ShoeIcon from "../../../assets/icons/shoe_fill.svg?react";
import ArrowIcon from "../../../assets/icons/arrow2_right.svg?react";
import type { MissionsData } from "../Home";
import { useNavigate } from "react-router-dom";

interface MissionCardProps {
  info: MissionsData;
}

const MissionCard = ({ info }: MissionCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      //onClick={() => navigate(`/mission/${info.id}`)}
      className={`flex flex-col flex-none px-3.5 gap-3 rounded-2xl h-32 w-62 justify-center ${info.missionId == 1 ? "bg-primary text-white" : "bg-white shadow-card"}`}
    >
      <div className="pl-1">
        {info.missionId == 1 ? (
          <PillIcon />
        ) : (
          <ShoeIcon className="text-[#31353B] w-8 h-8" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-between items-center">
          <span className="text-sub1_sb_18">{info.missionTitle}</span>
          <span className="cursor-pointer">
            <ArrowIcon className="w-6 h-6" />
          </span>
        </div>
        <div className="text-body4_r_14">{info.missionDescription}</div>
      </div>
    </div>
  );
};

export default MissionCard;
