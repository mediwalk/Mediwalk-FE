import { motion, useDragControls, type PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import BinCard from "./components/BinCard";
import { useOutletContext, useParams } from "react-router-dom";
import type { WalkContextType } from "./Walk";

export default function BottomSheet() {
  // 부모(Walk)가 내려준 데이터 몽땅 꺼내기
  const {
    sheetState,
    setSheetState,
    bins,
    loading,
    selectedBinId,
    setSelectedBinId,
  } = useOutletContext<WalkContextType>();

  const { binId } = useParams();

  useEffect(() => {
    if (binId) {
      setSelectedBinId(Number(binId));
      setSheetState("expanded");
    }
  }, [binId, setSheetState]);

  // 화면 높이 계산
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  // 위치 상수 정의
  // Header(64px) + Map(55%)를 고려했을 때 바텀시트의 시작 위치
  const TOP_Y = 80;
  const MIDDLE_Y = windowHeight * 0.6; // 화면의 60% 지점부터 시작
  const BOTTOM_Y = windowHeight - 105; // 바닥

  const controls = useDragControls();

  // 현재 상태에 따른 Y값 반환
  const getTargetY = () => {
    switch (sheetState) {
      case "expanded":
        return TOP_Y;
      case "half":
        return MIDDLE_Y;
      case "collapsed":
        return BOTTOM_Y;
      default:
        return MIDDLE_Y;
    }
  };

  // 드래그 종료 시 상태 업데이트
  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.y;

    // 위로 드래그
    if (offset < -50) {
      if (sheetState === "collapsed") setSheetState("half");
      else if (sheetState === "half") setSheetState("expanded");
    }
    // 아래로 드래그
    else if (offset > 50) {
      if (sheetState === "expanded") setSheetState("half");
      else if (sheetState === "half") setSheetState("collapsed");
    }
  };

  return (
    <motion.div
      initial={{ y: MIDDLE_Y }}
      animate={{ y: getTargetY() }} // 부모 상태에 따라 위치 이동
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed flex flex-col top-0 left-0 right-0 bg-white w-full max-w-md mx-auto z-40 h-dvh rounded-t-3xl"
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: TOP_Y, bottom: BOTTOM_Y }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
    >
      {/* 회색 바 */}
      <div
        onPointerDown={(e) => controls.start(e)}
        className="flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="w-15 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* 내부 콘텐츠 영역 */}
      <div className="px-6 flex flex-col h-full overflow-hidden">
        {/* 3번 영역: 근처 폐의약품 수거함 리스트 */}
        <div className="flex flex-col mt-5 flex-1 gap-4 min-h-0">
          <div className="flex flex-col gap-2">
            <div className="text-title1_sb_20">
              폐의약품 수거함{" "}
              <span className="text-primary">{bins.length}</span>건
            </div>
            <div className="text-body4_r_14 text-neutral-40">
              현 위치 기준 3km 이내의 수거함만 노출됩니다
            </div>
          </div>
          <div
            className={`flex flex-col flex-1 gap-2 pb-45 no-scrollbar ${sheetState === "expanded" ? "overflow-y-auto" : "overflow-hidden"}`}
          >
            {loading ? (
              <div className="flex justify-center py-10 text-gray-400">
                수거함을 찾고 있어요...
              </div>
            ) : (
              bins?.map((bin) => (
                <BinCard
                  key={bin.id}
                  info={bin}
                  onClick={() => {
                    if (bin.id === selectedBinId) {
                      setSelectedBinId(null);
                    } else {
                      setSelectedBinId(bin.id);
                    }
                  }}
                  isSelected={selectedBinId === bin.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
