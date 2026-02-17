import { BiBell } from "react-icons/bi";
import MyGoogleMap from "./GoogleMap";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState } from "react";

const Walk = () => {
  const { binId } = useParams();
  const location = useLocation();

  const isPreview = location.pathname.includes("preview");

  // 자식이 드래그로 바꿀 상태를 여기서 관리
  const [sheetState, setSheetState] = useState<
    "half" | "collapsed" | "expanded"
  >(binId ? "expanded" : "half");

  return (
    <div className="relative h-dvh">
      {/* 헤더 */}
      {!isPreview && (
        <header className="flex h-16 justify-between items-center px-6">
          <div className="text-2xl font-bold">mediwalk</div>
          <div className="cursor-pointer">
            <BiBell className="size-6" />
          </div>
        </header>
      )}
      <MyGoogleMap sheetState={sheetState} />
      <Outlet context={{ sheetState, setSheetState }} />
    </div>
  );
};

export default Walk;
