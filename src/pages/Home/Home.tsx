import { BiBell } from "react-icons/bi";
import { FaAngleRight } from "react-icons/fa6";
import MissionCard from "./MissionCard";
import BinCard from "./BinCard";

export interface MissionInfo {
  id: number;
  type: string;
  title: string;
  detail: string;
  point: string;
}

const Home = () => {
  const mockMissions: MissionInfo[] = [
    {
      id: 1,
      type: "medicine",
      title: "오늘의 폐의약품 수거 미션",
      detail: "옆 동네 보건소에 버리고 오기",
      point: "300P",
    },
    {
      id: 2,
      type: "walk",
      title: "오늘의 운동 미션",
      detail: "약수터 거쳐서 약국 가기",
      point: "100P",
    },
  ];
  const mockBinInfo = [
    {
      id: 1,
      title: "강남구 보건소",
      detail: "서울시 강남구 학동로 456",
      distance: 350,
      reward: 3000,
    },
    {
      id: 2,
      title: "선릉역 약국",
      detail: "서울시 강남구 테헤란로 303",
      distance: 580,
      reward: 4000,
    },
    {
      id: 3,
      title: "역삼동 주민센터",
      detail: "서울시 강남구 테헤란로 8길 22",
      distance: 720,
      reward: 5000,
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-3">
        {/* 헤더 */}
        <header className="flex h-16 justify-between items-center px-6">
          <div className="text-2xl font-bold">mediwalk</div>
          <div className="cursor-pointer">
            <BiBell className="size-6" />
          </div>
        </header>
        {/* 인사말, 리워드 */}
        <section className="px-6 pt-4 pb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-medium">안녕하세요, 김메디님</h1>
            <p className="text-gray-400 text-sm font-medium">
              오늘도 건강하게 폐의약품 수거해볼까요?
            </p>
          </div>

          <div className="h-22 w-full flex p-4 items-center justify-between rounded-2xl border shadow-sm bg-white border-primary">
            <div className="font-semibold whitespace-pre-wrap">
              {"이번 달 폐의약품\n수거 리워드"}
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="text-lg font-bold text-primary">50,850 원</div>
              <div className="text-xs font-semibold text-gray-500">
                지난 달 대비 +24%
              </div>
            </div>
          </div>
        </section>
        {/* 오늘의 미션 */}
        <section>
          <div className="font-semibold text-xl px-6 mt-3">오늘의 미션</div>
          <div className="flex flex-nowrap no-scrollbar overflow-x-auto gap-4 py-3">
            <div className="px-1"></div>
            {mockMissions.map((mission) => {
              return <MissionCard key={mission.id} info={mission} />;
            })}
            <div className="px-1"></div>
          </div>
        </section>
        {/* 근처 폐의약품 수거함 */}
        <section className="flex flex-col p-6 gap-3">
          <div className="flex justify-between">
            <div className="font-semibold text-xl">근처 폐의약품 수거함</div>
            <div className="flex items-center gap-0.5 text-sm text-gray-500 cursor-pointer">
              전체보기 <FaAngleRight />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {mockBinInfo.map((bin) => {
              return <BinCard key={bin.id} info={bin} />;
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
