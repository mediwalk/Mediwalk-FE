import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ToggleButton from "../../../components/ToggleButton";
import { useState } from "react";
// import { useParams } from "react-router-dom";

const MissionDetail = () => {
  // const { missionId } = useParams();

  const navigate = useNavigate();

  const [isRestingPointOn, setIsRestingPoint] = useState(false);
  const [isNatureFriendly, setIsNatureFriendly] = useState(false);
  const [isPedestrianZone, setIsPedestrianZone] = useState(false);

  return (
    <div className="px-6">
      {/* 헤더 */}
      <header className="flex h-16 items-end">
        <div className="cursor-pointer">
          <IoIosArrowBack className="size-9" onClick={() => navigate("/")} />
        </div>
      </header>
      {/* 메인 영역 */}
      <div>
        {/* 미션 제목 */}
        <section>
          <h4>오늘의 폐의약품 수거 미션</h4>
          <h1>옆 동네 보건소에 폐의약품 처리하기</h1>
        </section>

        {/* 미션 내용 */}
        <section>
          {/* 목적지, 거리, 보상 박스 */}
          <div>
            {/* 목적지, 거리 */}
            <div>
              {/* 목적지 영역 */}
              <div className="flex justify-between">
                <p>목적지</p>
                <p>강남구 보건소</p>
              </div>
              {/* 거리 영역 */}
              <div>
                <p>거리</p>
                <p>
                  1500m
                  <span>도보 약 40분</span>
                </p>
              </div>
            </div>
            {/* 보상 영역 */}
            <div>
              <p>폐의약품 수거 보상</p>
              <p>3000 원</p>
            </div>
          </div>
          {/* 필터 영역 */}
          <div>
            {/* 건강 맞춤형 필터 */}
            <h2>건강 맞춤형 필터</h2>
            <div>
              <div>
                <h5>활동량</h5>
                <div>
                  <button>적당한</button>
                  <button>활발한</button>
                  <button>최대의</button>
                </div>
              </div>
              <div>
                <h5>경사도</h5>
                <div>
                  <button>완만한</button>
                  <button>적당한</button>
                  <button>가파른</button>
                </div>
              </div>
              <div>
                <p>휴식 포인트 배치</p>
                <ToggleButton
                  isOn={isRestingPointOn}
                  onToggle={() => setIsRestingPoint(!isRestingPointOn)}
                />
              </div>
            </div>
            {/* 환경 맞춤형 필터 */}
            <h2>환경 맞춤형 필터</h2>
            <div>
              {/* 자연 친화 */}
              <div>
                <div>
                  <p>자연 친화</p>
                  <p>녹지율이 높은 경로를 우선순위로 둡니다.</p>
                </div>
                <ToggleButton
                  isOn={isNatureFriendly}
                  onToggle={() => setIsNatureFriendly(!isNatureFriendly)}
                />
              </div>
              {/* 보행자 전용 */}
              <div>
                <div>
                  <p>보행자 전용</p>
                  <p>보행자 전용 도로의 안전한 길을 추천합니다.</p>
                </div>
                <ToggleButton
                  isOn={isPedestrianZone}
                  onToggle={() => setIsPedestrianZone(!isPedestrianZone)}
                />
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
