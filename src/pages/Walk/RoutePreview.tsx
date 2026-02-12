import { useState } from "react";
import { motion, useDragControls, type PanInfo } from "framer-motion";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const RoutePreview = () => {
  const navigate = useNavigate();
  const { binId } = useParams();
  const { setSheetState, sheetState } = useOutletContext<any>();

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // 프리뷰 전용 위치 상수
  const TOP_Y = 110;
  const MIDDLE_Y = windowHeight * 0.52;
  const BOTTOM_Y = windowHeight - 140;

  const controls = useDragControls();

  const getTargetY = () => {
    if (sheetState === "expanded") return TOP_Y;
    if (sheetState === "half") return MIDDLE_Y;
    return BOTTOM_Y;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.y;
    if (offset < -20) {
      if (sheetState === "collapsed") setSheetState("half");
      else if (sheetState === "half") setSheetState("expanded");
    } else if (offset > 20) {
      if (sheetState === "expanded") setSheetState("half");
      else if (sheetState === "half") setSheetState("collapsed");
    }
  };

  return (
    <div className="relative h-dvh w-full pointer-events-none">
      {/* 상단 목적지 플로팅 바  */}
      <div className="fixed w-full max-w-md left-1/2 -translate-x-1/2 top-10 inset-x-0 px-5 z-50 pointer-events-auto">
        <div className="bg-white rounded-full px-5 py-3 flex items-center justify-between shadow-md shadow-[#4A4E56]/6">
          <div className="flex gap-3 items-center">
            <span className="text-primary font-semibold">목적지</span>
            <span className="font-semibold">서울역 메디 약국</span>
          </div>
          <button onClick={() => navigate(`/walk/filter/${binId}`)}>
            <IoClose className="size-6 text-[#6C727C]" />
          </button>
        </div>
      </div>

      {/* 바텀시트 */}
      <motion.div
        animate={{ y: getTargetY() }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        // 바텀시트 높이를 (화면 전체 - 상단 여백)으로 강제 설정
        style={{ height: windowHeight - TOP_Y }}
        // style 높이를 따름
        className="fixed inset-x-0 top-0 bg-white w-full max-w-md mx-auto z-40 rounded-t-3xl shadow-xl flex flex-col pointer-events-auto overflow-hidden"
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: TOP_Y, bottom: BOTTOM_Y }}
        onDragEnd={handleDragEnd}
      >
        {/* 드래그 핸들 */}
        <div
          onPointerDown={(e) => controls.start(e)}
          className="flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none flex-none"
        >
          <div className="w-15 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* 내부 레이아웃 */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* 헤더 */}
          <div className="px-8 pb-2 flex-none">
            <div className="mb-5 mt-3 flex flex-col gap-2">
              <h2 className="text-xl font-bold leading-tight mb-2">
                지구를 지키는
                <br />
                운동을 시작해볼까요?
              </h2>
              <p className="text-xs text-[#7A8396]">
                <span className="text-primary">총 2.5km </span>• 평균 경사도
                완만함 • 적당한 활동량
              </p>
            </div>
          </div>

          {/* 휴식 포인트 */}
          <div className="flex-1 overflow-y-auto px-8 min-h-0 no-scrollbar pb-20">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <div className="flex flex-col items-center pt-1">
                <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
                <div className="w-0.5 h-full border-l-2 border-dashed border-gray-200 -mt-1" />
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-700">
                  용산공원 입구 벤치
                </div>
                <p className="text-sm text-gray-600">
                  300m 앞 공원 벤치에서 잠시 쉬어가세요
                </p>
              </div>

              <div className="flex flex-col items-center pt-1">
                <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
                <div className="w-0.5 h-full border-l-2 border-dashed border-gray-200 -mt-1" />
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-700">
                  용산공원 입구 벤치
                </div>
                <p className="text-sm text-gray-600">
                  300m 앞 공원 벤치에서 잠시 쉬어가세요
                </p>
              </div>

              <div className="flex flex-col items-center pt-1">
                <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
                <div className="w-0.5 h-full border-l-2 border-dashed border-gray-200 -mt-1" />
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-700">
                  용산공원 입구 벤치
                </div>
                <p className="text-sm text-gray-600">
                  300m 앞 공원 벤치에서 잠시 쉬어가세요
                </p>
              </div>
              <div className="flex flex-col items-center pt-1">
                <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
                <div className="w-0.5 h-full border-l-2 border-dashed border-gray-200 -mt-1" />
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-700">
                  용산공원 입구 벤치
                </div>
                <p className="text-sm text-gray-600">
                  300m 앞 공원 벤치에서 잠시 쉬어가세요
                </p>
              </div>
              <div className="flex flex-col items-center pt-1">
                <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
                <div className="w-0.5 h-full border-l-2 border-dashed border-gray-200 -mt-1" />
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-700">
                  용산공원 입구 벤치
                </div>
                <p className="text-sm text-gray-600">
                  300m 앞 공원 벤치에서 잠시 쉬어가세요
                </p>
              </div>
              <div className="flex flex-col items-center pt-1">
                <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
                <div className="w-0.5 h-full border-l-2 border-dashed border-gray-200 -mt-1" />
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-700">
                  용산공원 입구 벤치
                </div>
                <p className="text-sm text-gray-600">
                  300m 앞 공원 벤치에서 잠시 쉬어가세요
                </p>
              </div>

              <div className="flex flex-col items-center pt-1">
                <div className="size-3 rounded-full border-2 border-gray-300 bg-white z-10" />
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-700">
                  도착지
                </div>
                <p className="text-sm text-gray-600">운동 완료!</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8 pt-4 bg-white z-50 pointer-events-auto">
        <button className="w-full py-4 bg-primary rounded-xl text-white font-semibold active:scale-99 transition-transform">
          인증하기
        </button>
      </div>
    </div>
  );
};

export default RoutePreview;
