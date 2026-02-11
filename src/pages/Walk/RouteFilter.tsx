import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const RouteFilter = () => {
  const navigate = useNavigate();
  const { binId } = useParams();

  // 닫힘
  const handleClose = () => {
    navigate(`/walk/${binId}`);
  };

  return (
    // 부모의 지도 위에 덮이는 고정 레이아웃
    <div className="fixed inset-x-0 bottom-0 top-20 bg-white max-w-md mx-auto z-50 rounded-t-3xl flex flex-col overflow-hidden">
      <div className="px-5.5 pb-5.5 pt-9 flex justify-between items-center border-b border-gray-50">
        <h2 className="text-xl font-bold">AI 맞춤 경로 디자인</h2>
        <button onClick={handleClose} className="p-1">
          <IoClose className="size-8 text-[#52575E]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-20 no-scrollbar">
        {/* 여기에 기획안의 필터 컨텐츠(활동량, 경사도 등)를 넣으세요 */}
        <p className="text-gray-500 text-sm">목적지: {binId}번 수거함</p>
      </div>
    </div>
  );
};

export default RouteFilter;
