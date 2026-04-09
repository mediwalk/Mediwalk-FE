import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    // 로컬 스토리지에서 로그인 여부(토큰) 확인
    const hasToken = localStorage.getItem("accessToken");

    const displayTimer = setTimeout(() => {
      // 2초 지나면 페이드아웃 애니메이션 시작
      setIsFading(true);

      // 2초 뒤에 어디로 갈지 결정
      setTimeout(() => {
        if (hasToken) {
          // 로그인 상태면 홈으로 (replace: true로 뒤로가기 방지)
          navigate("/home", { replace: true });
        } else {
          // 로그인 안 했으면 로그인 창으로
          navigate("/login", { replace: true });
        }
      }, 500);
    }, 2000);
    // 컴포넌트가 사라질 때 타이머 정리
    return () => clearTimeout(displayTimer);
  }, [navigate]);
  return (
    <main
      className={`flex items-center justify-center h-full w-full text-poppins-logo text-common-white bg-primary transition-opacity duration-500 ease-in-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      mediwalk
    </main>
  );
};

export default Splash;
