import { PiPillFill } from "react-icons/pi";
import { FaWalking } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import type { MissionsData } from "../Home";
import { useNavigate } from "react-router-dom";

interface MissionCardProps {
  info: MissionsData;
}

const MissionCard = ({ info }: MissionCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/mission/${info.id}`)}
      className={`flex flex-col flex-none px-4 gap-3 rounded-2xl shadow-sm h-35 w-70 justify-center ${info.missionId == 1 ? "bg-primary text-white" : "bg-white"}`}
    >
      <div>
        {info.missionId == 1 ? (
          <PiPillFill className="size-8" />
        ) : (
          <FaWalking className="size-8" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-sub1_sb_18">{info.missionTitle}</span>
          <span className="cursor-pointer">
            <FaAngleRight className="size-6" />
          </span>
        </div>
        <div className="text-body4_r_14">{info.missionDescription}</div>
      </div>
    </div>
  );
};

export default MissionCard;
