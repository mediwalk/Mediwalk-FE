import HomeIcon from "../assets/icons/home_fill.svg?react";
import ShoeIcon from "../assets/icons/shoe_fill.svg?react";
import RewardIcon from "../assets/icons/reward_fill.svg?react";
import MyIcon from "../assets/icons/person_fill.svg?react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation(); //현재 링크

  const getLink = (path: string) => {
    return location.pathname === path
      ? "text-primary color-primary"
      : "text-[#7A8396] color-[#7A8396]";
  };

  return (
    <nav className="w-full h-21 flex bg-background-common z-50 px-10 pt-3 pb-5 justify-between ">
      <Link
        to="/home"
        className={`flex flex-col items-center justify-center w-12 gap-1 ${getLink("/")}`}
      >
        <span>
          <HomeIcon className="w-7 h-7" />
        </span>
        <span className="text-xs font-semibold">홈</span>
      </Link>
      <Link
        to="/walk"
        className={`flex flex-col items-center justify-center w-12 gap-1 ${getLink("/walk")}`}
      >
        <span>
          <ShoeIcon className="w-7 h-7" />
        </span>
        <span className="text-xs font-semibold">운동 경로</span>
      </Link>
      <Link
        to="/reward"
        className={`flex flex-col items-center justify-center w-12 gap-1 ${getLink("/reward")}`}
      >
        <span>
          <RewardIcon className="w-7 h-7" />
        </span>
        <span className="text-xs font-semibold">리워드</span>
      </Link>
      <Link
        to="/mypage"
        className={`flex flex-col items-center justify-center w-12 gap-1 ${getLink("/mypage")}`}
      >
        <span>
          <MyIcon className="w-7 h-7" />
        </span>
        <span className="text-xs font-semibold">마이</span>
      </Link>
    </nav>
  );
};

export default NavBar;
