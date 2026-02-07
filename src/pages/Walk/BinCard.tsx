interface BinInfo {
  id: number;
  title: string;
  detail: string;
  distance: number;
  time: number;
  step: number;
  reward: number;
}

interface BinCardProps {
  info: BinInfo;
}

export default function BinCard({ info }: BinCardProps) {
  return (
    <div className="p-5 w-full border border-gray-100 rounded-2xl flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold ">{info.title}</p>
          <p className="text-xs text-gray-500">{info.detail}</p>
        </div>
        <div className="text-primary font-medium text-sm bg-blue-50 px-3 py-1 rounded-lg">
          + {info.reward}원
        </div>
      </div>
      <div className="text-xs ">
        <span className="text-primary font-medium">{info.distance}m</span>
        <span className="text-gray-500">
          {" "}
          • 도보 {info.time}분 • {info.step}보
        </span>
      </div>
    </div>
  );
}
