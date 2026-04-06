import NotiIcon from "../assets/icons/noti_line.svg?react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background flex h-15 justify-between items-baseline-last px-5 pb-3 shrink-0">
      <div className="text-poppins-bold">mediwalk</div>
      <div className="cursor-pointer">
        <NotiIcon />
      </div>
    </header>
  );
};

export default Header;
