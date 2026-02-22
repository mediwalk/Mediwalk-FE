import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const DisposalComplete = () => {
  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-background inset-0 flex flex-col items-center px-5">
      <div className="flex flex-col gap-5 mt-60">
        <div className="flex justify-center">
          <FaCircleCheck className="text-primary size-15" />
        </div>
        <div className="text-head1_sb_24 text-center">
          폐의약품 수거 인증이 <br />
          완료되었어요
        </div>
      </div>
      <div className="flex w-full flex-col gap-3.5 mt-40">
        <div className="flex justify-between px-4 py-3 bg-primary-extralight border border-primary-light rounded-xl items-center">
          <div className="text-primary flex gap-1.5 text-sub3_sb_16 items-center">
            <FaCircleCheck className="size-4" />
            3000원 적립 완료
          </div>
          <div className="text-caption1-m-13 text-cool-neutral-30">
            누적 잔액 50,850원
          </div>
        </div>
        <div className="flex flex-col p-4 bg-common-white shadow-md shadow-[#4a4e56]/4 rounded-xl gap-4.5 text-body3_r_16">
          <div className="flex justify-between">
            <div>• 오늘의 운동</div>
            <div>350m 산책 완료</div>
          </div>
          <div className="flex justify-between">
            <div>• 오늘의 성취</div>
            <div>초보 환경 지킴이 달성</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full text-sub3_sb_16 mt-15">
        <button
          onClick={returnHome}
          className="flex-1 py-4 bg-common-white text-primary border border-primary rounded-xl"
        >
          홈 화면으로
        </button>
        <button className="flex-1 py-4 bg-primary text-common-white rounded-xl">
          리워드 환급받기
        </button>
      </div>
    </div>
  );
};

export default DisposalComplete;
