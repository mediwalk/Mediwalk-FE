import { PiPillFill } from "react-icons/pi";
import { FaWalking } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";

interface MissionInfo {
  id: number;
  type: string;
  title: string;
  detail: string;
  point: string;
}

interface MissionCardProps {
  info: MissionInfo;
}

const MissionCard = ({ info }: MissionCardProps) => {
  return (
    <div
      className={`flex flex-col flex-none px-4 gap-3 rounded-2xl shadow-sm h-35 w-70 justify-center ${info.type == "medicine" ? "bg-primary text-white" : "bg-white"}`}
    >
      <div>
        {info.type == "medicine" ? (
          <PiPillFill className="size-8" />
        ) : (
          <FaWalking className="size-8" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className=" font-semibold text-lg">{info.title}</span>
          <span className="cursor-pointer">
            <FaAngleRight className="size-6" />
          </span>
        </div>
        <div className="font-medium text-sm">{info.detail}</div>
      </div>
    </div>
  );
};

export default MissionCard;
