import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ToggleButton from "../../../components/ToggleButton";
import { useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { PiMapPinFill } from "react-icons/pi";
// import { useParams } from "react-router-dom";

const MissionDetail = () => {
  // const { missionId } = useParams();

  const navigate = useNavigate();

  const [activeLevel, setActiveLevel] = useState<string>("적당한");
  const [slopeLevel, setSlopeLevel] = useState<string>("완만한");

  const [isRestingPointOn, setIsRestingPoint] = useState(false);
  const [isNatureFriendly, setIsNatureFriendly] = useState(false);
  const [isPedestrianZone, setIsPedestrianZone] = useState(false);

  // 필터 버튼 선택
  const renderFilterButtons = (
    options: string[],
    current: string,
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

  return (
    <div className="px-6 h-screen flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="flex h-16 items-center shrink-0">
        <div className="cursor-pointer">
          <IoIosArrowBack className="size-9" onClick={() => navigate("/")} />
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="flex flex-col gap-5 py-3 pb-5 overflow-hidden">
        {/* 미션 제목 */}
        <section className="flex flex-col gap-1 shrink-0">
          <h4 className="text-primary font-medium">
            오늘의 폐의약품 수거 미션
          </h4>
          <h1 className="text-2xl font-semibold">
            옆 동네 보건소에 폐의약품 처리하기
          </h1>
        </section>

        {/* 미션 내용 */}
        <section className="flex flex-col flex-1 gap-3 overflow-y-auto pb-25 no-scrollbar">
          {/* 목적지, 거리, 보상 박스 */}
          <div className="flex flex-col gap-5 p-5 bg-white rounded-2xl shadow-md shadow-gray-100">
            {/* 목적지, 거리 */}
            <div className="flex flex-col gap-3">
              {/* 목적지 영역 */}
              <div className="flex justify-between">
                <div className="flex items-center gap-1.5 text-gray-600 ">
                  <PiMapPinFill className="size-4 text-gray-500" />
                  <span className="font-medium">목적지</span>
                </div>
                <p>강남구 보건소</p>
              </div>
              {/* 거리 영역 */}
              <div className="flex justify-between ">
                <div className="flex items-center gap-1.5 text-gray-600 ">
                  <AiFillClockCircle className="size-4 text-gray-500" />
                  <span className=" font-medium">거리</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-medium">1,500m</span>
                  <span className="text-gray-500 ">도보 약 40분</span>
                </div>
              </div>
            </div>
            {/* 보상 영역 */}
            <div className="bg-blue-50 flex justify-between px-4 py-3 rounded-lg font-medium">
              <p>폐의약품 수거 보상</p>
              <p className="text-primary">3000 원</p>
            </div>
          </div>
          {/* 필터 영역 */}
          <div className="flex flex-col gap-5 px-5 py-5 bg-white rounded-2xl shadow-md shadow-gray-100">
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
        </section>
      </div>
      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-10">
        <div>
          <button className="w-full py-4 bg-primary rounded-xl text-white font-semibold active:scale-99 transition-transform">
            미션 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
