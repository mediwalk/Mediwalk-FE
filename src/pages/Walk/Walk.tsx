import { BiBell } from "react-icons/bi";
import MyGoogleMap from "./GoogleMap";
import BottomSheet from "./BottomSheet";
import { useState } from "react";

const Walk = () => {
  // 바텀시트 상태
  const [sheetState, setSheetState] = useState<
    "half" | "collapsed" | "expanded"
  >("half");
  return (
    <div className="relative h-dvh">
      {/* 헤더 */}
      <header className="flex h-16 justify-between items-center px-6">
        <div className="text-2xl font-bold">mediwalk</div>
        <div className="cursor-pointer">
          <BiBell className="size-6" />
        </div>
      </header>
      <MyGoogleMap sheetState={sheetState} />
      <BottomSheet sheetState={sheetState} setSheetState={setSheetState} />
    </div>
  );
};

export default Walk;
