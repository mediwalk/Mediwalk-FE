import { BiBell } from "react-icons/bi";
import MyGoogleMap from "./GoogleMap";

const Walk = () => {
  return (
    <div>
      {/* 헤더 */}
      <header className="flex h-16 justify-between items-center px-6">
        <div className="text-2xl font-bold">mediwalk</div>
        <div className="cursor-pointer">
          <BiBell className="size-6" />
        </div>
      </header>
      <MyGoogleMap />
    </div>
  );
};

export default Walk;
