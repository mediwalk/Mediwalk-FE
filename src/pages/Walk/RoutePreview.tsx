import { useEffect, useState } from "react";
import { motion, useDragControls, type PanInfo } from "framer-motion";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import CloseIcon from "../../assets/icons/delete_line.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import LocationIcon from "../../assets/icons/location_fill.svg?react";
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../api/axios";
import ErrorModal from "../../components/ErrorModal";
import type { RouteDataResponse, WalkContextType } from "./Walk";
import { formatDistance } from "../../utils/formatDistance";

const activityMap: Record<string, string> = {
  MODERATE: "적당한",
  ACTIVE: "활발한",
  MAXIMUM: "최대의",
};

interface PointItem {
  id: string;
  title: string;
  desc: string;
  lat?: number;
  lng?: number;
}

const RoutePreview = () => {
  const { binId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    setSheetState,
    sheetState,
    setRoutePolyline,
    setRouteData,
    setFocusedLocation,
    bins,
    setSelectedBinId,
  } = useOutletContext<WalkContextType>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [windowHeight] = useState(window.innerHeight);
  const [previewData, setPreviewData] = useState<RouteDataResponse | null>(
    null,
  );
  const [combinedPoints, setCombinedPoints] = useState<PointItem[]>([]);

  useEffect(() => {
    if (binId) setSelectedBinId(Number(binId));
  }, [binId, setSelectedBinId]);

  useEffect(() => {
    if (state && state.routeData) {
      const data: any = state.routeData;
      setPreviewData(data);
      setRouteData(data);

      if (data.routePolyline) setRoutePolyline(data.routePolyline);

      const points: PointItem[] = [];

      // 백엔드에서 내려준 routeSegments 배열을 순서대로 순회
      if (data.routeSegments && data.routeSegments.length > 0) {
        points.push(
          ...data.routeSegments.map((segment: any, index: number) => {
            let lat, lng;
            let title = segment.name;
            let desc = segment.instruction;

            // 1. 경로 안내
            if (segment.type === "ROUTE_GUIDE") {
              title = "경로 안내";
            }
            // 2. 추천 마트 (martSuggestionsAlongRoute에서 좌표 매칭)
            else if (segment.type === "MARKET") {
              const matchedMart = data.martSuggestionsAlongRoute?.find(
                (m: any) => m.name === segment.name,
              );
              lat = matchedMart?.latitude;
              lng = matchedMart?.longitude;
              desc = desc || "산책 중 들러서 건강한 저당 식품을 구경해 보세요.";
            }
            // 3. 추천 공원 (parkSuggestionsAlongRoute에서 좌표 매칭)
            else if (segment.type === "PARK") {
              const matchedPark = data.parkSuggestionsAlongRoute?.find(
                (p: any) => p.name === segment.name,
              );
              lat = matchedPark?.latitude;
              lng = matchedPark?.longitude;
              desc = desc || "공원을 가로지르며 상쾌하게 걸어보세요.";
            }
            // 4. 휴식 포인트 (restPoints에서 좌표 매칭)
            else if (segment.type?.includes("REST")) {
              const matchedRest = data.restPoints?.find(
                (r: any) => r.name === segment.name,
              );
              lat = matchedRest?.latitude;
              lng = matchedRest?.longitude;
              desc = desc || "근처 벤치에서 잠시 쉬어가세요.";
            }
            // 5. 목적지 (bins에서 좌표 매칭)
            else if (segment.type === "DESTINATION") {
              const destBin = bins.find((b) => b.id === data.destinationId);
              lat = destBin?.latitude;
              lng = destBin?.longitude;
              desc =
                desc ||
                "목적지에 도착했어요! 오늘도 메디워크와 함께 지구를 지키는 운동을 완료했어요.";
            }

            return {
              id: `segment-${segment.segmentIndex || index}`,
              title: title,
              desc: desc,
              lat: lat,
              lng: lng,
            };
          }),
        );
      } else {
        // 만약 예외적으로 routeSegments가 비어있을 경우 목적지만 띄우기 (방어 코드)
        const destBin = bins.find((b) => b.id === data.destinationId);
        if (data.destinationName) {
          points.push({
            id: "destination",
            title: data.destinationName,
            desc: "목적지에 도착했어요! 오늘도 메디워크와 함께 지구를 지키는 운동을 완료했어요.",
            lat: destBin?.latitude,
            lng: destBin?.longitude,
          });
        }
      }

      setCombinedPoints(points);
    }

    return () => {
      setRouteData(null);
      setRoutePolyline(null);
      setFocusedLocation(null);
    };
  }, [state, setRoutePolyline, setRouteData, setFocusedLocation, bins]);

  const controls = useDragControls();

  const handleAuthenticate = async () => {
    try {
      const liveLocation = await new Promise<{ lat: number; lng: number }>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("위치 정보를 지원하지 않는 브라우저입니다."));
          }
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => reject(error),
            { enableHighAccuracy: true },
          );
        },
      );

      const proximityRes = await api.get(
        `/collection-locations/${binId}/destination-proximity`,
        {
          params: {
            currentLatitude: liveLocation.lat,
            currentLongitude: liveLocation.lng,
          },
        },
      );

      if (!proximityRes.data.withinActivationRadius) {
        setErrorMessage("목적지 20m 이내에서 다시 시도해주세요.");
        setIsErrorModalOpen(true);
        return;
      }

      navigate("/camera", {
        replace: true,
        state: {
          ...state,
          routeData: previewData,
          myLocation: liveLocation,
        },
      });
    } catch (error: any) {
      console.error("거리 인증 실패:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message.replace(".", ".\n"));
      } else {
        setErrorMessage(
          "위치 정보를 가져오거나 서버와 통신 중 문제가 발생했습니다.",
        );
      }
      setIsErrorModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  const confirmModal = () => {
    if (state?.isMission) {
      navigate("/home");
    } else {
      navigate(`/walk`);
    }
  };

  const handlePointClick = (point: PointItem) => {
    if (point.lat && point.lng) {
      setFocusedLocation({ lat: point.lat, lng: point.lng });
      setSheetState("half");
    }
  };

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
        <div
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="fixed w-full max-w-md left-1/2 -translate-x-1/2 top-10 inset-x-0 px-5 z-50 pointer-events-auto cursor-pointer"
        >
          <div className="bg-white rounded-full pl-5 pr-4 py-3 flex items-center justify-between shadow-card">
            <div className="flex gap-3 items-center">
              <span className="text-primary text-sub3_sb_16">목적지</span>
              <span className="text-body1_m_16">
                {previewData?.destinationName}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(!isModalOpen);
              }}
            >
              <CloseIcon className="w-6 h-6 text-[#6C727C]" />
            </button>
          </div>
        </div>

        <motion.div
          animate={{ y: getTargetY() }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{ height: windowHeight - TOP_Y }}
          className="fixed inset-x-0 top-0 bg-white w-full max-w-md mx-auto z-40 rounded-t-3xl shadow-xl flex flex-col pointer-events-auto overflow-hidden"
          drag="y"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ top: TOP_Y, bottom: BOTTOM_Y }}
          onDragEnd={handleDragEnd}
        >
          <div
            onPointerDown={(e) => controls.start(e)}
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          >
            <div className="w-15 h-1 bg-[#C3C7CE] rounded-full" />
          </div>

          <div className="flex flex-col h-full px-5 overflow-hidden">
            <div className="pb-5 flex-none">
              <div className="flex flex-col gap-2">
                <h2 className="text-title1_sb_20 mb-2">
                  지구를 지키는
                  <br />
                  운동을 시작해볼까요?
                </h2>
                <div className="flex gap-0.5 items-center">
                  <span className="text-primary text-caption1_m_13">
                    총 {formatDistance(previewData?.totalDistanceMeters)}{" "}
                  </span>
                  <BulletIcon className="w-4 h-4 text-[#7A8396]" />
                  <span className="text-[#40444B] text-caption3_r_13">
                    {previewData?.activityLevel
                      ? activityMap[previewData.activityLevel]
                      : "보통"}{" "}
                    활동량
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar py-2 pb-20">
              {combinedPoints.length > 0 ? (
                combinedPoints.map((point: PointItem, index: number) => {
                  const isLast = index === combinedPoints.length - 1;
                  return (
                    <div
                      key={point.id}
                      className="grid grid-cols-[auto_1fr] gap-x-3 cursor-pointer"
                      onClick={() => handlePointClick(point)}
                    >
                      <div className="flex flex-col items-center">
                        {/* 💡 경로안내(좌표없음)인 경우 아이콘 스타일을 살짝 다르게 표시하거나 동일하게 유지 가능합니다 */}
                        <div
                          className={`w-4 h-4 rounded-full border-[1.4px] ${point.lat ? "border-primary bg-primary-extralight" : "border-[#97A2B8] bg-[#F3F7FF]"} z-10 shrink-0`}
                        />
                        {!isLast && (
                          <div className="w-0.5 h-full border-l border-dashed border-[#97A2B8]" />
                        )}
                      </div>
                      <div className="pb-8 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1 text-[#6C727C] text-caption1_m_13">
                          {point.lat && (
                            <LocationIcon className="w-4 h-4 text-primary" />
                          )}
                          {point.title}
                        </div>
                        <p className="text-body1_m_16 text-[#202123]">
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-[#6C727C] text-caption1_m_13 py-10">
                  선택하신 경로 주변에 안내할 특별한 포인트가 없습니다.
                  <br />
                  목적지를 향해 바로 출발해 보세요!
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-10 pt-7 z-50 pointer-events-auto bg-linear-to-t from-white from-70% to-transparent">
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
