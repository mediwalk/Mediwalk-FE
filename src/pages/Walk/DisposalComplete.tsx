import CheckIcon from "../../assets/icons/check_fill.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import { useNavigate } from "react-router-dom";

const DisposalComplete = () => {
  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/home");
  };

  return (
    <div className="bg-background inset-0 flex flex-col items-center px-5">
      <div className="flex flex-col gap-4 mt-58.5">
        <div className="flex justify-center">
          <CheckIcon className="text-primary w-14 h-14" />
        </div>
        <div className="text-head1_sb_24 text-center">
          폐의약품 수거 인증이 <br />
          완료되었어요
        </div>
      </div>
      <div className="flex w-full flex-col gap-3 mt-35">
        <div className="flex justify-between p-3 bg-primary-extralight border border-primary-light rounded-lg items-center">
          <div className="text-primary flex gap-0.5 text-sub3_sb_16 items-center">
            <CheckIcon className="w-5 h-5" />
            800원 적립 완료
          </div>
          <div className="text-caption1-m-13 text-cool-neutral-30">
            누적 잔액 50,850원
          </div>
        </div>
        <div className="flex flex-col py-4 pl-3 pr-4 bg-common-white shadow-card rounded-lg gap-3 text-body3_r_16">
          <div className="flex justify-between">
            <div className="flex gap-0.5 items-center">
              <BulletIcon className="w-4 h-4 text-neutral-30" />
              <span className="text-common-black">오늘의 운동</span>
            </div>
            <div>618m 산책 완료</div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-0.5 items-center">
              <BulletIcon className="w-4 h-4 text-neutral-30" />
              <span className="text-common-black">오늘의 성취</span>
            </div>
            <div>초보 환경 지킴이 달성</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full text-sub3_sb_16 mt-12">
        <button
          onClick={returnHome}
          className="flex-1 py-4 bg-common-white text-primary border border-primary rounded-lg"
        >
          홈 화면으로
        </button>
        <button className="flex-1 py-4 bg-primary text-common-white rounded-lg">
          리워드 환급받기
        </button>
      </div>
    </div>
  );
};

export default DisposalComplete;
