import ArrowIcon from "../../assets/icons/arrow2_right.svg?react";
import LocationIcon from "../../assets/icons/location_fill.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import { formatDistance } from "../../utils/formatDistance";

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
      className="flex p-4 gap-1.5 bg-white w-full py-4 pr-4 pl-3 rounded-2xl shadow-card"
    >
      <div>
        <LocationIcon className="text-primary w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <div className="text-sub3_sb_16 text-[#31353B]">{info.title}</div>
            <div className="cursor-pointer">
              <ArrowIcon className="text-[#4A4E56] w-5 h-5" />
            </div>
          </div>
          <div className="text-caption3_r_13 text-[#6C727C]">{info.detail}</div>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-primary text-caption1_m_13">
            {formatDistance(info.distance)}
          </span>
          <span>
            <BulletIcon className="text-[#7A8396] w-4 h-4" />
          </span>
          <span className="text-[#6C727C] text-caption3_r_13">
            리워드 {info.reward}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default BinCard;
