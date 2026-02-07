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
}

const BinCard = ({ info }: BinCardProps) => {
  return (
    <div className="flex p-4 gap-2 bg-white w-full h-24 rounded-2xl shadow-xs">
      <div>
        <PiMapPinFill className="text-primary size-5 mt-0.5" />
      </div>
      <div className="w-full flex flex-col gap-2 justify-center">
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center">
            <div className="font-semibold ">{info.title}</div>
            <div className="cursor-pointer">
              <FaAngleRight className="text-gray-500" />
            </div>
          </div>
          <div className="text-xs text-gray-500">{info.detail}</div>
        </div>
        <div className="text-xs ">
          <span className="text-primary font-medium">{info.distance}m</span>
          <span className="text-gray-500"> • 리워드 {info.reward}원</span>
        </div>
      </div>
    </div>
  );
};

export default BinCard;
