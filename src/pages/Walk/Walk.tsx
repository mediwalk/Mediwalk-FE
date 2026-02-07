import { BiBell } from "react-icons/bi";
import MyGoogleMap from "./GoogleMap";
import BottomSheet from "./BottomSheet";

const Walk = () => {
  return (
    <div className="relative overflow-hidden">
      {/* 헤더 */}
      <header className="flex h-16 justify-between items-center px-6">
        <div className="text-2xl font-bold">mediwalk</div>
        <div className="cursor-pointer">
          <BiBell className="size-6" />
        </div>
      </header>
      <MyGoogleMap />
      <BottomSheet />
    </div>
  );
};

export default Walk;
