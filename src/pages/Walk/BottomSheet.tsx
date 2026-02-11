import { motion, useDragControls, type PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import BinCard from "./BinCard";

export interface BinInfo {
  id: number;
  title: string;
  detail: string;
  distance: number;
  time: number;
  step: number;
  reward: number;
}

interface BottomSheetProps {
  sheetState: "half" | "collapsed" | "expanded";
  setSheetState: (state: "half" | "collapsed" | "expanded") => void;
}

export default function BottomSheet({
  sheetState,
  setSheetState,
}: BottomSheetProps) {
  const mockBinInfo: BinInfo[] = [
    {
      id: 1,
      title: "강남구 보건소",
      detail: "서울시 강남구 학동로 456",
      distance: 350,
      time: 5,
      step: 450,
      reward: 3000,
    },
    {
      id: 2,
      title: "선릉역 약국",
      detail: "서울시 강남구 테헤란로 303",
      distance: 580,
      time: 8,
      step: 750,
      reward: 4000,
    },
    {
      id: 3,
      title: "역삼동 주민센터",
      detail: "서울시 강남구 테헤란로 8길 22",
      distance: 720,
      time: 10,
      step: 930,
      reward: 5000,
    },
    {
      id: 4,
      title: "논현역 메디 약국",
      detail: "서울시 강남구 학동로 456",
      distance: 720,
      time: 12,
      step: 950,
      reward: 3000,
    },
    {
      id: 5,
      title: "선릉역 약국",
      detail: "서울시 강남구 테헤란로 303",
      distance: 800,
      time: 15,
      step: 980,
      reward: 4000,
    },
    {
      id: 6,
      title: "선릉역 약국",
      detail: "서울시 강남구 테헤란로 303",
      distance: 800,
      time: 15,
      step: 980,
      reward: 4000,
    },
  ];

  // 선택된 카드 상태관리
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);

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
          <div className="font-bold text-lg">근처 폐의약품 수거함</div>
          <div
            className={`flex flex-col flex-1 gap-2 pb-45 no-scrollbar ${sheetState === "expanded" ? "overflow-y-auto" : "overflow-hidden"}`}
          >
            {mockBinInfo.map((bin) => {
              return (
                <BinCard
                  key={bin.id}
                  info={bin}
                  onClick={() => {
                    if (bin.id === selectedBinId) setSelectedBinId(null);
                    else setSelectedBinId(bin.id);
                  }}
                  isSelected={selectedBinId === bin.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
