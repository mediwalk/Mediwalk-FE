import ArrowIcon from "../../assets/icons/arrow2_right.svg?react";
import MissionCard from "./Mission/MissionCard";
import BinCard from "./BinCard";
import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { getTodayDate } from "../../utils/date";
import useUserStore from "../../store/useUserStore";

export interface MissionsData {
  id: number;
  missionId: number;
  collectionLocationId: number;
  destinationName: string;
  status: string;
  earnedReward: number;
  missionTitle: string;
  missionDescription: string;
  distanceMeters: number;
  estimatedWalkTimeMinutes: number;
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
  const { myLocation, isLocating } = useCurrentLocation();
  const navigate = useNavigate();

  // zustand 스토어에서 이름과 저장 함수 꺼내옴
  const { name, id, setUser } = useUserStore();

  // 리워드 전용 로컬 상태
  const [rewardInfo, setRewardInfo] = useState({
    total: 0,
    increaseRate: 0,
  });
  const [missions, setMissions] = useState<MissionsData[]>([]);
  const [bins, setBins] = useState<BinLocationData[]>([]);
  const [_loading, setLoading] = useState(true);

  // 인디케이터용 상태 및 ref 추가
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 될 때마다 현재 인덱스를 계산하는 함수
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    // 카드 하나의 너비 대략
    const cardWidth = 256;

    // 현재 스크롤 위치를 카드 너비로 나누어 반올림하면 현재 인덱스
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentMissionIndex(newIndex);
  };

  // API 호출 - 화면이 켜지면 실행
  useEffect(() => {
    if (isLocating || !myLocation || !id) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRes = await api.get(`/users/${id}`);
        setRewardInfo({
          total: userRes.data.totalAccumulatedReward,
          increaseRate: userRes.data.rewardIncreaseRateComparedToLastMonth,
        });

        // 2. 미션 정보 가져오기
        const today = getTodayDate();
        const missionRes = await api.get("/user-daily-missions", {
          params: {
            userId: id,
            missionDate: today,
            currentLatitude: myLocation.lat,
            currentLongitude: myLocation.lng,
          },
        });
        setMissions(missionRes.data);

        // 3. 근처 수거함 가져오기 (현재 내 위치 위도/경도 넣음)
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
  }, [myLocation, isLocating, setUser]);

  return (
    <>
      <div className="flex flex-col">
        {/* 헤더 */}
        <Header />

        <div className="flex flex-col pt-5">
          {/* 인사말, 리워드 */}
          <section className="px-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-head1_sb_24">
                안녕하세요, {name || "김메디"}님
              </h1>
              <p className="text-body4_r_14 text-[#6B7078]">
                오늘도 건강하게 폐의약품 수거해볼까요?
              </p>
            </div>

            <div className="h-22 w-full flex p-4 items-center justify-between rounded-2xl border bg-white border-primary shadow-card">
              <div className="text-sub3_sb_16 text-[#292C32] whitespace-pre-wrap">
                {"이번 달 폐의약품\n수거 리워드"}
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="text-title1_sb_20 text-primary">
                  {(rewardInfo?.total || 0).toLocaleString()} 원
                </div>
                <div className="text-caption4_r_12 text-[#292C32]">
                  지난 달 대비 {rewardInfo?.increaseRate || 0}%
                </div>
              </div>
            </div>
          </section>
          {/* 오늘의 미션 */}
          <section>
            <div className="text-title1_sb_20 px-5 mt-7 mb-2">오늘의 미션</div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex flex-nowrap no-scrollbar overflow-x-auto gap-2 pb-3"
            >
              <div className="px-1.5"></div>
              {missions.map((mission) => {
                return <MissionCard key={mission.id} info={mission} />;
              })}
              <div className="px-1.5"></div>
            </div>
            {/* 동적 인디케이터 (현재 인덱스에 따라 색상 변경) */}
            <div className="flex gap-1.5 pb-3 justify-center mb-5">
              {missions.map((_, index) => (
                <span
                  key={index}
                  className={`rounded-full h-1.5 w-1.5 transition-colors duration-300 ${
                    currentMissionIndex === index
                      ? "bg-primary"
                      : "bg-neutral-90"
                  }`}
                />
              ))}
            </div>
          </section>
          {/* 근처 폐의약품 수거함 */}
          <section className="flex flex-col p-5 gap-3">
            <div className="flex justify-between">
              <div className="text-title1_sb_20">근처 폐의약품 수거함</div>
              <div
                onClick={() => navigate("/walk")}
                className="flex items-center gap-0.5 text-sm text-body2_m_14 text-[#6B7078] cursor-pointer"
              >
                전체보기 <ArrowIcon className="text-[#6B7078] w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {bins?.map((bin) => {
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
                    onClick={() => navigate(`/walk/${bin.id}`)}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
