import PillLogo from "../../assets/icons/pill_logo.svg?react";
import GoogleLogo from "../../assets/icons/google_logo.svg?react";

const Login = () => {
  return (
    <main className="flex flex-col">
      <section className="flex flex-col mt-38.5 gap-4 px-5">
        <div className="w-13 h-13 flex items-center justify-center bg-primary/80 rounded-[10.83px]">
          <PillLogo className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-[26px] font-bold text-common-black whitespace-pre-line leading-[140%] tracking-[-0.015em]">
            {`목적지가 있는 산책,
          당신의 일상이 디자인됩니다`}
          </div>
          <div className="text-body2_regular_14 text-cool-neutral-30">
            3초 가입으로 바로 시작해보세요
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center w-full max-w-md gap-7 px-5 mb-20 bottom-0 fixed">
        <div className="flex w-full items-center justify-center bg-common-white rounded-lg shadow-card cursor-pointer">
          <button className="flex items-center gap-3 p-3.5 text-lg font-semibold leading-5 tracking-[-0.015em] text-[#1F1F1F]">
            <GoogleLogo className="w-6 h-6" />
            구글로 계속하기
          </button>
        </div>
        <div className="flex flex-col gap-1 text-caption4_r_12 text-neutral-30">
          <div>로그인하시면 아래 내용에 동의하는 것으로 간주됩니다.</div>
          <div className="flex gap-7.5 justify-center underline underline-offset-2">
            <div>개인정보 처리방침</div>
            <div>이용약관</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
