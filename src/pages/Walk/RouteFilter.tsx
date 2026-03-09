import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "../../assets/icons/delete_line.svg?react";
import LocationIcon from "../../assets/icons/location_fill.svg?react";
import ArrowIcon from "../../assets/icons/arrow2_right.svg?react";
import ToggleButton from "../../components/ToggleButton";
import { useEffect, useState } from "react";
import type { BinLocationData } from "./Walk";
import api from "../../api/axios";
import { mapActivityLevel, mapSlopeLevel } from "../../utils/filter";

const RouteFilter = () => {
  const navigate = useNavigate();
  const { binId } = useParams();
  const [loading, setLoading] = useState(true);

  const [bin, setBin] = useState<BinLocationData | null>(null);

  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [slopeLevel, setSlopeLevel] = useState<string | null>(null);

  const [isRestingPointOn, setIsRestingPoint] = useState<boolean>(false);
  const [isNatureFriendly, setIsNatureFriendly] = useState<boolean>(false);
  const [isPedestrianZone, setIsPedestrianZone] = useState<boolean>(false);

  // 버튼 활성화 여부 판단 (활동량과 경사도가 모두 null이 아닐 때)
  const isFormValid = activeLevel !== null && slopeLevel !== null;

  // API 호출 - 화면이 켜지면 실행
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 수거함 정보 가져오기
        const binRes = await api.get(`/collection-locations/${binId}`);
        setBin(binRes.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    if (!isFormValid) return;

    navigate(`/walk/preview/${binId}`, {
      state: {
        destinationId: Number(binId),
        name: bin?.name,
        isMission: false, // 일반 모드라는 표시
        filters: {
          activityLevel: mapActivityLevel(activeLevel),
          slopeLevel: mapSlopeLevel(slopeLevel),
          includeRestPoints: isRestingPointOn,
          natureFriendly: isNatureFriendly,
          pedestrianOnly: isPedestrianZone,
        },
      },
    });
  };

  // 필터 버튼 선택
  const renderFilterButtons = (
    options: string[],
    current: string | null,
    setter: (val: string) => void,
  ) => (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setter(option)}
          className={`px-4 py-2 rounded-md text-body2_m_14 text-[#41464E] transition-colors duration-200 ${
            current === option
              ? "bg-cool-neutral-30 text-white"
              : "bg-white text-gray-600 ring-1 ring-inset ring-cool-neutral-70"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  // 닫힘
  const handleClose = () => {
    navigate(`/walk/${binId}`);
  };

  return (
    // 부모의 지도 위에 덮이는 고정 레이아웃
    <div className="fixed inset-x-0 px-5 bottom-0 top-20 bg-white max-w-md mx-auto z-50 rounded-t-3xl flex flex-col overflow-hidden">
      <div className="mt-8 mb-5 flex justify-between items-center">
        <h2 className="text-title1_sb_20">AI 맞춤 경로 디자인</h2>
        <button onClick={handleClose}>
          <CloseIcon className="text-[#52575E] w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-center items-center mb-5">
        <div className="w-full pl-3 pr-4 py-3 flex justify-between items-center bg-[#F3F7FF] border border-primary rounded-full">
          <div className="flex gap-1 items-center">
            <LocationIcon className="text-primary w-5 h-5" />
            <span className="text-sub3_sb_16 text-[#202123]">나의 목적지</span>
          </div>
          <div
            onClick={() => navigate(`/walk/${binId}`)}
            className="flex items-center text-body1_m_16 text-[#202123] cursor-pointer"
          >
            <span>{bin?.name}</span>
            <ArrowIcon className="text-[#202123] w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="flex flex-col gap-4">
        {/* 건강 맞춤형 필터 */}
        <div className="flex flex-col gap-4 py-3.5">
          <h2 className="text-sub1_sb_18">건강 맞춤형 필터</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h5 className="text-body2_m_14 text-[#202123]">활동량</h5>
              {renderFilterButtons(
                ["적당한", "활발한", "최대의"],
                activeLevel,
                setActiveLevel,
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="text-body2_m_14 text-[#202123]">경사도</h5>
              {renderFilterButtons(
                ["완만한", "적당한", "가파른"],
                slopeLevel,
                setSlopeLevel,
              )}
            </div>
            <div className="flex justify-between items-center py-1">
              <p className="text-body2_m_14 text-[#202123]">휴식 포인트 배치</p>
              <ToggleButton
                isOn={isRestingPointOn}
                onToggle={() => setIsRestingPoint(!isRestingPointOn)}
              />
            </div>
          </div>
        </div>
        {/* 환경 맞춤형 필터 */}
        <div className="flex flex-col gap-4 py-3.5">
          <h2 className="text-sub1_sb_18">환경 맞춤형 필터</h2>
          <div className="flex flex-col gap-5">
            {/* 자연 친화 */}
            <div className="flex justify-between items-center py-1">
              <div>
                <p className="text-body2_m_14 text-[#202123]">자연 친화</p>
                <p className="text-caption3_r_13 text-[#4E545D]">
                  녹지율이 높은 경로를 우선순위로 둡니다.
                </p>
              </div>
              <ToggleButton
                isOn={isNatureFriendly}
                onToggle={() => setIsNatureFriendly(!isNatureFriendly)}
              />
            </div>
            {/* 보행자 전용 */}
            <div className="flex justify-between items-center py-1">
              <div>
                <p className="text-body2_m_14 text-[#202123]">보행자 전용</p>
                <p className="text-caption3_r_13 text-[#4E545D]">
                  보행자 전용 도로의 안전한 길을 추천합니다.
                </p>
              </div>
              <ToggleButton
                isOn={isPedestrianZone}
                onToggle={() => setIsPedestrianZone(!isPedestrianZone)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 mx-auto bottom-0 pt-7 pb-10 px-5 w-full max-w-md">
        <button
          onClick={handleSubmit}
          className={`w-full text-sub3_sb_16 rounded-lg py-4 ${isFormValid ? "bg-primary text-white" : "bg-cool-neutral-95 text-cool-neutral-70"}`}
        >
          AI 맞춤 경로 확인하기
        </button>
      </div>
    </div>
  );
};

export default RouteFilter;
