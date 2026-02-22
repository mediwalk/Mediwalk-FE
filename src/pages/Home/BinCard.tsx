import { FaAngleRight } from "react-icons/fa6";
import { PiMapPinFill } from "react-icons/pi";

interface BinInfo {
  id: number;
  title: string;
  detail: string;
  distance: number;
  reward: number;
}

interface BinCardProps {
  info: BinInfo;
  onClick?: () => void;
}

const BinCard = ({ info, onClick }: BinCardProps) => {
  return (
    <div
      onClick={onClick}
      className="flex p-4 gap-2 bg-white w-full rounded-2xl shadow-xs"
    >
      <div>
        <PiMapPinFill className="text-primary size-5" />
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center">
            <div className="text-sub3_sb_16 text-[#31353B]">{info.title}</div>
            <div className="cursor-pointer">
              <FaAngleRight className="text-[#4A4E56]" />
            </div>
          </div>
          <div className="text-caption3_r_13 text-[#6C727C]">{info.detail}</div>
        </div>
        <div>
          <span className="text-primary text-caption1_m_13">
            {info.distance}m
          </span>
          <span className="text-[#6C727C] text-caption3_r_13">
            {" "}
            • 리워드 {info.reward}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default BinCard;
