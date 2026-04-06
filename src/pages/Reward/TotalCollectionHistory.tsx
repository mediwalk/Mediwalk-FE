import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../assets/icons/arrow1_left.svg?react";

const TotalCollectionHistory = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col px-5">
      <header className="pt-6 pb-3 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/reward")} />
      </header>
      <main></main>
    </div>
  );
};

export default TotalCollectionHistory;
