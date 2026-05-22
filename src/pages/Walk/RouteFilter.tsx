import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ArrowIcon from "../../assets/icons/arrow1_left.svg?react";
import ToggleButton from "../../components/ToggleButton";
import CoffeeIcon from "../../assets/icons/tea_fill.svg?react";
import ShoesIcon from "../../assets/icons/shoe_fill.svg?react";
import FireIcon from "../../assets/icons/fire_fill.svg?react";

const RouteFilter = () => {
  const navigate = useNavigate();
  const { binId } = useParams();

  // 현재 스텝 관리 (1 또는 2)
  const [step, setStep] = useState<1 | 2>(1);

  // 1단계 상태: 활동량 선택 (null 이면 선택 안 됨)
  const [activityLevel, setActivityLevel] = useState<string | null>(null);

  // 2단계 상태: 세부 사항 토글
  const [isRestPoint, setIsRestPoint] = useState<boolean>(false);
  const [isEcoMart, setIsEcoMart] = useState<boolean>(false);
  const [isWalkAlert, setIsWalkAlert] = useState<boolean>(false);

  // 1단계 완료 핸들러
  const handleNextStep = () => {
    if (activityLevel) {
      setStep(2);
    }
  };

  // 최종 제출 핸들러
  const handleSubmit = () => {
    // 선택된 데이터들을 모아서 다음 페이지(미리보기)로 전달
    navigate(`/walk/preview/${binId}`, {
      state: {
        destinationId: Number(binId),
        isMission: false,
        filters: {
          activityLevel, // "moderate", "active", "max" 등으로 매핑 필요
          isRestPoint,
          isEcoMart,
          isWalkAlert,
        },
      },
    });
  };

  // 1단계 활동량 옵션 데이터
  const activityOptions = [
    {
      id: "moderate",
      title: "적당히 걷고 싶어요",
      desc: "약 2천 보로, 20분 가량 소요돼요",
      icon: <CoffeeIcon className="w-7 h-7 text-primary" />,
    },
    {
      id: "active",
      title: "활발하게 걷고 싶어요",
      desc: "약 4천 보로, 40분 가량 소요돼요",
      icon: <ShoesIcon className="w-7 h-7 text-primary" />,
    },
    {
      id: "max",
      title: "최대치로 걷고 싶어요",
      desc: "약 6천 보로, 1시간 가량 소요돼요",
      icon: <FireIcon className="w-7 h-7 text-primary" />,
    },
  ];

  return (
    <div className="px-5 h-dvh flex flex-col bg-common-white">
      {/* 헤더 */}
      <header className="pt-6 pb-3 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/walk")} />
      </header>

      <main className="flex flex-col">
        {/* 스텝 인디케이터 & 제목 */}
        <section className="flex flex-col gap-4 py-3">
          {/* 인디케이터 */}
          <div className="flex gap-1 items-center">
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-full text-sub4_sb_14 ${
                step === 1
                  ? "bg-primary text-common-white"
                  : "bg-cool-neutral-95 text-cool-neutral-50"
              }`}
            >
              1
            </div>
            <div className="w-4 border-t-2 border-cool-neutral-90"></div>
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-full text-sub4_sb_14 ${
                step === 2
                  ? "bg-primary text-common-white"
                  : "bg-cool-neutral-90 text-cool-neutral-40"
              }`}
            >
              2
            </div>
          </div>
          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <h1 className="text-head1_sb_24 text-common-black whitespace-pre-line">
              {step === 1
                ? "활동량에 맞춰\n경로를 디자인해드릴게요"
                : "마지막 단계예요!\n세부 사항을 선택해주세요"}
            </h1>
            <p className="text-body4_r_14 text-cool-neutral-20">
              {step === 1
                ? "아래의 선택지에서 원하시는 활동량을 선택해주세요"
                : "원하시는 세부 사항이 있다면 산책 도중 알려드려요"}
            </p>
          </div>
        </section>

        {/* step 1 */}
        {step === 1 && (
          <div className="flex flex-col animate-fade-in mt-5">
            <div className="flex flex-col gap-2">
              {activityOptions.map((option) => {
                const isActive = activityLevel === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setActivityLevel(option.id)}
                    className={`flex items-center justify-between pl-3 pr-5 py-4 rounded-xl border-[1.5px] cursor-pointer transition-colors ${
                      isActive
                        ? "border-primary-light"
                        : "border-cool-neutral-90"
                    }`}
                  >
                    <div className="flex gap-2.5">
                      <div>{option.icon}</div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sub3_sb_16 text-common-black">
                          {option.title}
                        </div>
                        <div className="text-body4_r_14 text-cool-neutral-30">
                          {option.desc}
                        </div>
                      </div>
                    </div>
                    {/* 라디오 버튼 원 */}
                    <div
                      className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center ${
                        isActive ? "border-primary" : "border-cool-neutral-80"
                      }`}
                    >
                      {isActive && (
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* step 2 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="flex flex-col gap-8 mt-10">
              {/* 토글 1 */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-primary rounded-full"></span>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sub3_sb_16 text-common-black">
                      휴식 포인트 설정
                    </div>
                    <div className="text-body4_r_14 text-cool-neutral-30">
                      근처에 갈 수 있는 공원이 있다면 알려드려요
                    </div>
                  </div>
                </div>
                <ToggleButton
                  isOn={isRestPoint}
                  onToggle={() => setIsRestPoint(!isRestPoint)}
                />
              </div>

              {/* 토글 2 */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-primary rounded-full"></span>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sub3_sb_16 text-common-black">
                      친환경 농산물 마트
                    </div>
                    <div className="text-body4_r_14 text-cool-neutral-30">
                      저당 식품을 살 수 있는 마트를 알려드려요
                    </div>
                  </div>
                </div>
                <ToggleButton
                  isOn={isEcoMart}
                  onToggle={() => setIsEcoMart(!isEcoMart)}
                />
              </div>

              {/* 토글 3 */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-primary rounded-full"></span>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sub3_sb_16 text-common-black">
                      산책 상태 알림
                    </div>
                    <div className="text-body4_r_14 text-cool-neutral-30">
                      목적지까지 얼마나 남았는지 알려드려요
                    </div>
                  </div>
                </div>
                <ToggleButton
                  isOn={isWalkAlert}
                  onToggle={() => setIsWalkAlert(!isWalkAlert)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-md px-5 pb-10 pt-5">
        {step === 1 ? (
          <button
            onClick={handleNextStep}
            disabled={!activityLevel} // 선택 안 하면 비활성화
            className={`w-full py-4 rounded-lg text-sub3_sb_16 transition-colors ${
              activityLevel
                ? "bg-primary text-common-white"
                : "bg-cool-neutral-95 text-cool-neutral-70"
            }`}
          >
            다음 단계로
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-lg text-sub3_sb_16 bg-primary text-common-white transition-colors"
          >
            맞춤형 산책 경로 추천받기
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteFilter;
