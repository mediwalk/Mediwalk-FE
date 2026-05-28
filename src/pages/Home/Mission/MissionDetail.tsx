import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ArrowIcon from "../../../assets/icons/arrow1_left.svg?react";
import LocationIcon from "../../../assets/icons/location_fill.svg?react";
import ClockIcon from "../../../assets/icons/time_fill.svg?react";
import { useParams } from "react-router-dom";
import type { MissionsData } from "../Home";
import api from "../../../api/axios";
import useUserStore from "../../../store/useUserStore";
import { useCurrentLocation } from "../../../hooks/useCurrentLocation";
import RouteLoading from "../../Walk/components/RouteLoading";

const MissionDetail = () => {
  const { missionId } = useParams();
  const { id: userId } = useUserStore();
  const { myLocation } = useCurrentLocation();

  const [isLoading, setLoading] = useState(true);
  const [mission, setMission] = useState<MissionsData | null>(null);

  const navigate = useNavigate();

  // API 호출 - 화면이 켜지면 실행
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 미션 정보 가져오기
        const missionRes = await api.get(`/user-daily-missions/${missionId}`);
        console.log(missionRes);
        setMission(missionRes.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 미션 시작 버튼 클릭 함수
  const handleStartMission = async () => {
    if (!userId || !myLocation) {
      alert("사용자 정보나 현재 위치를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);

      // 백엔드 요청 바디 생성
      const requestBody = {
        userId: userId,
        currentLatitude: myLocation.lat,
        currentLongitude: myLocation.lng,
        destinationIds: [mission?.collectionLocationId],
        filter: {
          activityLevel: "MODERATE",
          includeRestPoints: true,
          notifyEcoMart: true,
        },
      };

      // POST 요청 보내기
      const response = await api.post("/routes/generate", requestBody);

      // 성공하면 받아온 데이터를 가지고 다음 페이지로 넘어감
      navigate(`/walk/preview/${mission?.collectionLocationId}`, {
        state: {
          isMission: true, // 미션에서 넘어왔다는 표시
          routeData: response.data,
          binId: mission?.collectionLocationId,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("AI 경로 생성 실패:", error);
      alert("맞춤 경로를 생성하는 데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="px-5 h-dvh flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="pt-6 pb-3 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/home")} />
      </header>

      {/* 메인 영역 */}
      <div className="flex flex-col gap-5 pt-3 pb-5">
        {/* 미션 제목 */}
        <section className="flex flex-col gap-1">
          <h4 className="text-primary text-caption1_m_13">
            {mission?.missionTitle}
          </h4>
          <h1 className="text-head1_sb_24">{mission?.missionDescription}</h1>
        </section>

        {/* 목적지, 거리 박스 */}
        <div className="flex flex-col gap-5 p-4 bg-white rounded-xl shadow-card">
          {/* 목적지, 거리 */}
          <div className="flex flex-col gap-3">
            {/* 목적지 영역 */}
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <LocationIcon className="w-4 h-4 text-cool-neutral-60" />
                <span className="text-body1_m_16 text-cool-neutral-20">
                  목적지
                </span>
              </div>
              <p className="text-body1_m_16 text-common-black">
                {mission?.destinationName || ""}
              </p>
            </div>
            {/* 거리 영역 */}
            <div className="flex justify-between ">
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4 text-cool-neutral-60" />
                <span className="text-body1_m_16 text-cool-neutral-20">
                  거리
                </span>
              </div>
              <div className="flex items-center gap-1 justify-end text-body1_m_16">
                <span className=" text-common-black">
                  {mission?.distanceMeters || "0"}m
                </span>
                <span className="text-cool-neutral-60">
                  도보 약 {mission?.walkingDistanceMeters || "0"}분
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pt-7 pb-10 bg-linear-to-t from-white from-70% to-transparent">
        <button
          onClick={handleStartMission}
          className="w-full text-sub3_sb_16 rounded-lg py-4 bg-primary text-white"
        >
          미션 시작하기
        </button>
      </div>
      {isLoading && <RouteLoading />}
    </div>
  );
};

export default MissionDetail;
