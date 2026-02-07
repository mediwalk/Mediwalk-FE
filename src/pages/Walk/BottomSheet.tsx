import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import BinCard from "./BinCard";

export default function BottomSheet() {
  const mockBinInfo = [
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

  const [isOpen, setIsOpen] = useState(false);

  const CLOSED_Y = 480;
  const OPEN_Y = 80;

  const y = useMotionValue(CLOSED_Y);

  return (
    <motion.div
      style={{ y }}
      initial={{ y: CLOSED_Y }} // 바텀시트 초기 위치
      animate={{ y: isOpen ? OPEN_Y : CLOSED_Y }} // 바텀시트 펼쳐지면 0%위치, 닫히면 60%위치
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="fixed flex flex-col bottom-0 left-1/2 -translate-x-1/2 bg-white shadow-sm w-full max-w-md z-40 h-full rounded-t-3xl"
      drag="y" // 세로 방향 드래그 허용
      dragListener={true} // 바텀시트 전체에 대해서는 드래그 감지 끄기
      dragConstraints={{ top: OPEN_Y, bottom: CLOSED_Y }}
      dragElastic={0}
      onDragEnd={(_, info) => {
        if (info.offset.y < -20) {
          y.set(OPEN_Y);
          setIsOpen(true);
        } else if (info.offset.y > 20) {
          y.set(CLOSED_Y);
          setIsOpen(false);
        }
      }}
    >
      {/* 회색 바 */}
      <div className="flex justify-center py-4 cursor-grab active:cursor-grabbing">
        <div className="w-15 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* 내부 콘텐츠 영역 */}
      <div className="px-6 flex flex-col h-full overflow-hidden">
        {/* 2번 영역: AI 맞춤 경로 디자인 버튼 */}
        <button className="w-full py-4 bg-primary text-white rounded-xl font-semibold mb-10 flex justify-center items-center gap-2 shrink-0">
          <BsStars className="size-5" />
          <span>AI 맞춤 경로 디자인</span>
        </button>

        {/* 3번 영역: 근처 폐의약품 수거함 리스트 */}
        <div className="flex flex-col  flex-1 gap-4 min-h-0">
          <div className="font-bold text-lg">근처 폐의약품 수거함</div>
          <div
            className={`flex flex-col flex-1 gap-2 pb-45 no-scrollbar ${isOpen ? "overflow-y-auto" : "overflow-hidden"}`}
          >
            {mockBinInfo.map((bin) => {
              return <BinCard key={bin.id} info={bin} />;
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
