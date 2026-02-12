import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { PiMapPinFill } from "react-icons/pi";
import { FaAngleRight } from "react-icons/fa6";
import ToggleButton from "../../components/ToggleButton";
import { useState } from "react";

const RouteFilter = () => {
  const navigate = useNavigate();
  const { binId } = useParams();

  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [slopeLevel, setSlopeLevel] = useState<string | null>(null);

  const [isRestingPointOn, setIsRestingPoint] = useState(false);
  const [isNatureFriendly, setIsNatureFriendly] = useState(false);
  const [isPedestrianZone, setIsPedestrianZone] = useState(false);

  // 버튼 활성화 여부 판단 (활동량과 경사도가 모두 null이 아닐 때)
  const isFormValid = activeLevel !== null && slopeLevel !== null;

  // 필터 버튼 선택
  const renderFilterButtons = (
    options: string[],
    current: string | null,
    setter: (val: string) => void,
  ) => (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setter(option)}
          className={`px-5 py-2 rounded-lg text-sm transition-colors duration-200 ${
            current === option
              ? "bg-gray-600 text-white"
              : "bg-white text-gray-600 border border-gray-500"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  /// 경로 확인 제출 함수
  const handleSubmit = () => {
    if (!isFormValid) return; // 활성화되지 않았을 때는 함수 실행 방지
    navigate(`/walk/preview/${binId}`);
  };

  // 닫힘
  const handleClose = () => {
    navigate(`/walk/${binId}`);
  };

  return (
    // 부모의 지도 위에 덮이는 고정 레이아웃
    <div className="fixed inset-x-0 bottom-0 top-20 bg-white max-w-md mx-auto z-50 rounded-t-3xl flex flex-col overflow-hidden">
      <div className="px-5.5 mt-9 mb-3 flex justify-between items-center">
        <h2 className="text-xl font-bold">AI 맞춤 경로 디자인</h2>
        <button onClick={handleClose} className="p-1">
          <IoClose className="size-8 text-[#52575E]" />
        </button>
      </div>

      <div className="flex justify-center items-center px-5.5 py-2 mb-4">
        <div className="w-full px-4.5 py-3 flex justify-between items-center bg-[#F3F7FF] border border-primary rounded-full">
          <div className="flex gap-1.5 items-center font-semibold">
            <PiMapPinFill className="text-primary size-5" />
            <span>나의 목적지</span>
          </div>
          <div className="flex gap-1 items-center text-[#202123]">
            <span>강남구 보건소</span>
            <FaAngleRight className="size-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5.5 py-5">
        {/* 건강 맞춤형 필터 */}
        <div className="flex flex-col gap-4 mb-4">
          <h2 className="text-lg font-semibold">건강 맞춤형 필터</h2>
          <div className="flex flex-col gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <h5 className="font-medium text-sm">활동량</h5>
              {renderFilterButtons(
                ["적당한", "활발한", "최대의"],
                activeLevel,
                setActiveLevel,
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <h5 className="font-medium text-sm">경사도</h5>
              {renderFilterButtons(
                ["완만한", "적당한", "가파른"],
                slopeLevel,
                setSlopeLevel,
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="font-medium">휴식 포인트 배치</p>
              <ToggleButton
                isOn={isRestingPointOn}
                onToggle={() => setIsRestingPoint(!isRestingPointOn)}
              />
            </div>
          </div>
        </div>
        {/* 환경 맞춤형 필터 */}
        <div className="flex flex-col gap-4 py-3">
          <h2 className="text-lg font-semibold">환경 맞춤형 필터</h2>
          <div className="flex flex-col gap-5">
            {/* 자연 친화 */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">자연 친화</p>
                <p className="text-xs text-gray-500">
                  녹지율이 높은 경로를 우선순위로 둡니다.
                </p>
              </div>
              <ToggleButton
                isOn={isNatureFriendly}
                onToggle={() => setIsNatureFriendly(!isNatureFriendly)}
              />
            </div>
            {/* 보행자 전용 */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">보행자 전용</p>
                <p className="text-xs text-gray-500">
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
      <div className="px-5.5 fixed bottom-0 pb-12 w-full max-w-md">
        <button
          onClick={handleSubmit}
          className={`w-full font-semibold rounded-xl py-4 ${isFormValid ? "bg-primary text-white" : "bg-cool-neutral-95 text-cool-neutral-70"}`}
        >
          AI 맞춤 경로 확인하기
        </button>
      </div>
    </div>
  );
};

export default RouteFilter;
