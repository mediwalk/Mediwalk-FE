import { GoHomeFill } from "react-icons/go";
import { FaWalking, FaMedal } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { useLocation, Link } from "react-router-dom";

const NavBar = () => {
  const location = useLocation(); //현재 링크

  const getLink = (path: string) => {
    return location.pathname === path
      ? "text-primary color-primary"
      : "text-gray color-gray";
  };

  return (
    <nav className="w-full flex bg-background items-center z-50 px-10 py-4 justify-around ">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center gap-1 ${getLink("/")}`}
      >
        <span>
          <GoHomeFill className="size-6" />
        </span>
        <span className="text-xs font-semibold">홈</span>
      </Link>
      <Link
        to="/walk"
        className={`flex flex-col items-center justify-center gap-1 ${getLink("/walk")}`}
      >
        <span>
          <FaWalking className="size-6" />
        </span>
        <span className="text-xs font-semibold">운동 경로</span>
      </Link>
      <Link
        to="/reward"
        className={`flex flex-col items-center justify-center gap-1 ${getLink("/reward")}`}
      >
        <span>
          <FaMedal className="size-6" />
        </span>
        <span className="text-xs font-semibold">리워드</span>
      </Link>
      <Link
        to="/mypage"
        className={`flex flex-col items-center justify-center gap-1 ${getLink("/mypage")}`}
      >
        <span>
          <IoPerson className="size-6" />
        </span>
        <span className="text-xs font-semibold">마이</span>
      </Link>
    </nav>
  );
};

export default NavBar;
