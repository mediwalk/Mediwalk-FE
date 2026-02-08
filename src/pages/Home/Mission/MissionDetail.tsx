import { IoIosArrowBack } from "react-icons/io";
// import { useParams } from "react-router-dom";

const MissionDetail = () => {
  // const { missionId } = useParams();

  return (
    <div>
      {/* 헤더 */}
      <header className="flex h-16 justify-between items-center px-6">
        <div className="text-2xl font-bold">mediwalk</div>
        <div className="cursor-pointer">
          <IoIosArrowBack className="size-6" />
        </div>
      </header>
    </div>
  );
};

export default MissionDetail;
