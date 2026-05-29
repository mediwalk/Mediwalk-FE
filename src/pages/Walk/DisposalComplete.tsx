import CheckIcon from "../../assets/icons/check_fill.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import { useLocation, useNavigate } from "react-router-dom";

const DisposalComplete = () => {
  const navigate = useNavigate();
  // CameraVerify에서 넘겨준 state
  const { state } = useLocation();

  const eventData = state?.eventData;

  const rewardAmount = eventData?.event?.rewardAmount || 0;
  const totalAccumulatedReward = eventData?.totalAccumulatedReward || 0;
  const todayWalkingDistanceMeters = eventData?.todayWalkingDistanceMeters || 0;
  const todayAchievementName =
    eventData?.todayAchievementName || "초보 환경 지킴이";

  return (
    <div className="bg-background h-dvh flex flex-col items-center px-5">
      <header className="pt-6 pb-3 px-5 items-baseline shrink-0">
        <div className="w-6 h-6"></div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 pb-10">
        <CheckIcon className="text-primary w-16 h-16" />
        <div className="text-head1_sb_24 text-center leading-snug">
          폐의약품 수거 인증이 <br />
          완료되었어요
        </div>
      </div>

      <div className="flex flex-col gap-12 shrink-0 w-full pb-10">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between p-3 bg-primary-extralight border border-primary-light rounded-lg items-center">
            <div className="text-primary flex gap-0.5 text-sub3_sb_16 items-center">
              <CheckIcon className="w-5 h-5" />
              {rewardAmount.toLocaleString()}원 적립 완료
            </div>
            <div className="text-caption1-m-13 text-cool-neutral-30">
              누적 잔액 {totalAccumulatedReward.toLocaleString()}원
            </div>
          </div>

          <div className="flex flex-col py-4 pl-3 pr-4 bg-common-white shadow-card rounded-lg gap-3 text-body3_r_16">
            <div className="flex justify-between">
              <div className="flex gap-0.5 items-center">
                <BulletIcon className="w-4 h-4 text-neutral-30" />
                <span className="text-common-black">오늘의 운동</span>
              </div>
              <div>
                {todayWalkingDistanceMeters.toLocaleString()}m 산책 완료
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-0.5 items-center">
                <BulletIcon className="w-4 h-4 text-neutral-30" />
                <span className="text-common-black">오늘의 성취</span>
              </div>
              <div>{todayAchievementName} 달성</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full text-sub3_sb_16">
          <button
            onClick={() => navigate("/home")}
            className="flex-1 py-4 bg-common-white text-primary border border-primary rounded-lg"
          >
            홈 화면으로
          </button>
          <button
            onClick={() => navigate("/reward")}
            className="flex-1 py-4 bg-primary text-common-white rounded-lg"
          >
            리워드 환급받기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisposalComplete;
