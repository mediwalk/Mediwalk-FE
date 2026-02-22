import { useEffect, useState } from "react";
import { motion, useDragControls, type PanInfo } from "framer-motion";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { PiMapPinFill } from "react-icons/pi";
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../api/axios";
import ErrorModal from "../../components/ErrorModal";

// 백엔드 영어 데이터를 한글로 변환
const slopeMap: Record<string, string> = {
  GENTLE: "완만함",
  MODERATE: "적당함",
  STEEP: "가파름",
};
const activityMap: Record<string, string> = {
  MODERATE: "적당한",
  ACTIVE: "활발한",
  MAXIMUM: "최대의",
};

const RoutePreview = () => {
  const { binId } = useParams();
  const navigate = useNavigate();

  const { state } = useLocation(); // 앞 페이지에서 넘긴 데이터 받기

  const {
    setSheetState,
    sheetState,
    setRoutePath,
    setRoutePolyline,
    myLocation,
    setSelectedBinId,
  } = useOutletContext<any>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // AI 경로 결과 저장할 상태
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 프리뷰 화면이 열리면 목적지(binId)를 선택된 상태로 지정
  useEffect(() => {
    if (binId) {
      setSelectedBinId(Number(binId));
    }
  }, [binId, setSelectedBinId]);

  // API 호출 - 화면 켜지고 위치 파악되면 실행
  useEffect(() => {
    // 위치 정보가 없거나 state로 넘어온 값이 없으면 튕겨내기
    if (!myLocation || !state) return;

    const generateRoute = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        /* // api 요청 body
        const requestBody = {
          userId: 1, // 현재 로그인한 유저 아이디 (임시 1)
          currentLatitude: myLocation.lat,
          currentLongitude: myLocation.lng,
          destinationIds: [state.destinationId],
          filter: state.filters,
        };

        const res = await api.post("/routes/generate", requestBody);

        console.log("AI 경로 생성 성공!", res.data);
        setRouteData(res.data); // 성공한 데이터 저장 */

        // 내 위치 -> 목적지로 가는 가짜 좌표 배열 만들기!
        const mockPath = [
          { lat: myLocation.lat, lng: myLocation.lng }, // 출발지 (내 위치)
          { lat: 37.625294853394145, lng: 127.0781739504518 }, // 가짜 중간길 1
          { lat: 37.6253017812431, lng: 127.07791624762802 }, // 가짜 중간길 2
          { lat: 37.62475891276535, lng: 127.0779524964447 },
          { lat: 37.624795140824325, lng: 127.07766648994472 },
          { lat: 37.624756850774546, lng: 127.0776636345529 },
          { lat: 37.62464004956438, lng: 127.07716508916506 },
          { lat: 37.62424932620634, lng: 127.07529843747463 },
          { lat: 37.623797078519246, lng: 127.0745135389438 },
          { lat: 37.62403372851429, lng: 127.07429005262443 },
          { lat: 37.624155491649596, lng: 127.07408344251196 },
          { lat: 37.62409248123931, lng: 127.07398992618778 },
          { lat: 37.62406101059809, lng: 127.07388794544731 },
          { lat: 37.62475942903467, lng: 127.07364225637096 },
          { lat: 37.624828, lng: 127.073786 }, // 도착지 (공릉1동 주민센터 좌표)
        ];

        // 임시 가짜 데이터 (Mock)
        const mockResponse = {
          id: 105,
          userId: 1,
          userDailyMissionId: 12,
          destinationId: 3,
          startLatitude: 37.629,
          startLongitude: 127.075,
          totalDistanceMeters: 618,
          estimatedWalkTimeMinutes: 40,
          estimatedSteps: 3500,
          averageSlope: "GENTLE",
          activityLevel: "MODERATE",
          routePolyline: "_p~iF~ps|U_ulLnnqC_mqNvxq",
          greenSpaceRatio: 0.8,
          crosswalkCount: 3,
          isPedestrianOnly: true,
          isNatureFriendly: true,
          hasRestPoints: true,
          restPoints: [
            {
              id: 1001,
              routeId: 105,
              name: "용산공원 입구 벤치",
              type: "REST_BENCH",
              latitude: 37.632,
              longitude: 127.0765,
              order: 1,
              distanceFromPrevious: 800,
              instruction: "800m 앞 공원 벤치에서 잠시 쉬어가세요.",
            },
            {
              id: 1002,
              routeId: 105,
              name: "이태원 광장 쉼터",
              type: "PARK",
              latitude: 37.6355,
              longitude: 127.078,
              order: 2,
              distanceFromPrevious: 1200,
              instruction: "목적지 도착 전 마지막 휴식 포인트입니다.",
            },
            {
              id: 1003,
              routeId: 105,
              name: "공릉1동 주민센터",
              type: "DESTINATION",
              latitude: 37.638,
              longitude: 127.0795,
              order: 3,
              distanceFromPrevious: 500,
              instruction: "목적지에 도착했습니다! 운동 완료!",
            },
          ],
          generatedAt: "2026-02-20T20:00:00Z",
          completedAt: null,
          createdAt: "2026-02-20T20:00:00Z",
          updatedAt: "2026-02-20T20:00:00Z",
        };
        setRouteData(mockResponse);
        //setRoutePolyline(mockResponse.routePolyline); // 받아온 암호화된 경로 문자열을 지도 컴포넌트로 전달
        setRoutePath(mockPath);
      } catch (error) {
        console.error("경로 생성 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateRoute();
  }, [myLocation, state, setRoutePolyline, setRoutePath]);

  const controls = useDragControls();

  // 인증하기 버튼 클릭 시 실행될 함수
  const handleAuthenticate = async () => {
    try {
      let finalReward = 0; // 얻은 리워드
      if (state.isMission) {
        // 미션에서 넘어온 경우: 미션 완료 API 호출
        await api.post(`/user-daily-missions/${state.missionId}/complete`, {
          earnedReward: state.earnedReward || 3000, // (임시) 원래는 이전 페이지에서 넘어온 보상 금액을 넣어야 함
          currentLatitude: 37.618839703254395,
          currentLongitude: 127.07549661397934,
        });
        finalReward = state.earnedReward || 3000;
      } else {
        // 일반 수거함에서 넘어온 경우: 이벤트 생성 API 호출
        await api.post("/events", {
          userId: 1,
          eventType: "MEDICINE_COLLECTION",
          title: state.name,
          rewardAmount: 100,
          eventDateTime: new Date().toISOString(),
          collectionLocationId: state.destinationId,
          routeId: routeData?.id,
          //currentLatitude: 37.624828,
          //currentLongitude: 127.073786,
          currentLatitude: myLocation?.lat,
          currentLongitude: myLocation?.lng,
        });
        finalReward = 100; // 일반 수거 보상 (임시 100)
      }

      // 완료 후 성공 화면으로 이동
      navigate("/complete", {
        replace: true, // 뒤로가기 했을 때 이 프리뷰 페이지로 다시 못 오게 막음
        state: {
          reward: finalReward,
          distance: routeData?.totalDistanceMeters || 0,
        },
      });
    } catch (error: any) {
      console.error("인증 처리 실패:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const formattedMsg = error.response.data.message.replace(".", ".\n");
        setErrorMessage(formattedMsg);
      } else {
        setErrorMessage("서버와 통신 중 문제가 발생했습니다.");
      }
      setIsErrorModalOpen(true);
    }
  };

  // 경로 생성 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
        <p className="font-semibold text-lg text-primary animate-pulse">
          AI가 최적의 경로를 디자인하고 있습니다...
        </p>
      </div>
    );
  }

  // 모달 제어 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const confirmModal = () => {
    navigate(`/walk/${binId}`);
  };

  // 프리뷰 전용 위치 상수
  const TOP_Y = 110;
  const MIDDLE_Y = windowHeight * 0.52;
  const BOTTOM_Y = windowHeight - 140;

  const getTargetY = () => {
    if (sheetState === "expanded") return TOP_Y;
    if (sheetState === "half") return MIDDLE_Y;
    return BOTTOM_Y;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.y;
    if (offset < -20) {
      if (sheetState === "collapsed") setSheetState("half");
      else if (sheetState === "half") setSheetState("expanded");
    } else if (offset > 20) {
      if (sheetState === "expanded") setSheetState("half");
      else if (sheetState === "half") setSheetState("collapsed");
    }
  };

  return (
    <>
      <div className="relative h-dvh w-full pointer-events-none">
        {/* 상단 목적지 플로팅 바  */}
        <div
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="fixed w-full max-w-md left-1/2 -translate-x-1/2 top-10 inset-x-0 px-5 z-50 pointer-events-auto"
        >
          <div className="bg-white rounded-full px-5 py-3 flex items-center justify-between shadow-md shadow-[#4A4E56]/6">
            <div className="flex gap-3 items-center">
              <span className="text-primary text-sub3_sb_16">목적지</span>
              <span className="text-body1_m_16">공릉1동 주민센터</span>
            </div>
            <button onClick={() => setIsModalOpen(!isModalOpen)}>
              <IoClose className="size-6 text-[#6C727C]" />
            </button>
          </div>
        </div>

        {/* 바텀시트 */}
        <motion.div
          animate={{ y: getTargetY() }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          // 바텀시트 높이를 (화면 전체 - 상단 여백)으로 강제 설정
          style={{ height: windowHeight - TOP_Y }}
          // style 높이를 따름
          className="fixed inset-x-0 top-0 bg-white w-full max-w-md mx-auto z-40 rounded-t-3xl shadow-xl flex flex-col pointer-events-auto overflow-hidden"
          drag="y"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ top: TOP_Y, bottom: BOTTOM_Y }}
          onDragEnd={handleDragEnd}
        >
          {/* 드래그 핸들 */}
          <div
            onPointerDown={(e) => controls.start(e)}
            className="flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none flex-none"
          >
            <div className="w-15 h-1.5 bg-[#C3C7CE] rounded-full" />
          </div>

          {/* 내부 레이아웃 */}
          <div className="flex flex-col h-full overflow-hidden">
            {/* 헤더 */}
            <div className="px-8 pb-2 flex-none">
              <div className="mb-5 mt-3 flex flex-col gap-2">
                <h2 className="text-title1_sb_20 leading-tight mb-2">
                  지구를 지키는
                  <br />
                  운동을 시작해볼까요?
                </h2>
                <p className="text-[#40444B] text-caption3_r_13">
                  <span className="text-primary text-caption1_m_13">
                    총 {routeData?.totalDistanceMeters}m{" "}
                  </span>
                  • 평균 경사도 {slopeMap[routeData?.averageSlope]} •{" "}
                  {activityMap[routeData?.activityLevel]} 활동량
                </p>
              </div>
            </div>

            {/* 휴식 포인트 */}
            <div className="flex-1 overflow-y-auto px-8 min-h-0 no-scrollbar pb-20">
              {/* map() 함수를 이용해서 배열 길이만큼 반복해서 그림 */}
              {routeData?.restPoints?.map((point: any, index: number) => {
                const isLast = index === routeData.restPoints.length - 1; // 마지막 목적지인지 확인
                return (
                  <div
                    key={point.id}
                    className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1"
                  >
                    <div className="flex flex-col items-center pt-1">
                      <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
                      {/* 마지막 줄이면 점선을 안 그림 */}
                      {!isLast && (
                        <div className="w-0.5 h-full border-l-2 border-dashed border-gray-200 -mt-1" />
                      )}
                    </div>
                    <div className="pb-8">
                      <div className="flex items-center gap-1 mb-1.5 text-[#6C727C] text-caption1_m_13">
                        <span>
                          <PiMapPinFill className="size-4 text-primary" />
                        </span>
                        {point.name}
                      </div>
                      <p className="text-body1_m_16 text-[#202123] ">
                        {point.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
        {/* 인증하기 버튼 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8 pt-4 bg-white z-50 pointer-events-auto">
          <button
            onClick={handleAuthenticate}
            className="w-full py-4 bg-primary rounded-xl text-white text-sub3_sb_16 active:scale-99 transition-transform"
          >
            인증하기
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ConfirmModal
          title="목적지를 재설정 하시겠습니까?"
          detail="목적지를 재설정하여 AI 경로 추천을 받을 수 있어요."
          onClose={closeModal}
          onConfirm={confirmModal}
        />
      )}
      {isErrorModalOpen && (
        <ErrorModal
          title="인증에 실패했습니다"
          detail={errorMessage}
          onClose={closeErrorModal}
        />
      )}
    </>
  );
};

export default RoutePreview;
