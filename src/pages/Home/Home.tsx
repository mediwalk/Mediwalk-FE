import { BiBell } from "react-icons/bi";
import { FaAngleRight } from "react-icons/fa6";
import MissionCard from "./Mission/MissionCard";
import BinCard from "./BinCard";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

interface UserData {
  id: number;
  name: string;
  totalAccumulatedReward: number;
}

export interface MissionInfo {
  id: number;
  type: string;
  title: string;
  detail: string;
  point: string;
}

interface BinLocationData {
  id: number;
  name: string;
  address: string;
  baseRewardAmount: number;
  latitude: number;
  longitude: number;
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

  const { myLocation, isLocating } = useCurrentLocation();

  const [user, setUser] = useState<UserData | null>(null);
  const [bins, setBins] = useState<BinLocationData[]>([]);
  const [loading, setLoading] = useState(true);

  // API 호출 - 화면이 켜지면 실행
  useEffect(() => {
    if (isLocating || !myLocation) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. 사용자 정보 가져오기 (ID: 1번 유저라고 가정)
        const userRes = await api.get("/users/1");
        setUser(userRes.data);

        // 2. 근처 수거함 가져오기 (현재 내 위치 위도/경도 넣음)
        const binRes = await api.get("/collection-locations/nearby", {
          params: {
            latitude: myLocation.lat,
            longitude: myLocation.lng,
            limit: 3,
          },
        });
        setBins(binRes.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [myLocation, isLocating]);

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
            <h1 className="text-2xl font-medium">안녕하세요, {user?.name}님</h1>
            <p className="text-gray-400 text-sm font-medium">
              오늘도 건강하게 폐의약품 수거해볼까요?
            </p>
          </div>

          <div className="h-22 w-full flex p-4 items-center justify-between rounded-2xl border shadow-sm bg-white border-primary">
            <div className="font-semibold whitespace-pre-wrap">
              {"이번 달 폐의약품\n수거 리워드"}
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="text-lg font-bold text-primary">
                {user?.totalAccumulatedReward.toLocaleString()}원
              </div>
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
            {bins.map((bin) => {
              return (
                <BinCard
                  key={bin.id}
                  info={{
                    id: bin.id,
                    title: bin.name,
                    detail: bin.address,
                    distance: 500,
                    reward: bin.baseRewardAmount,
                  }}
                />
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
