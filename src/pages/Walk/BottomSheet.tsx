import { motion, useDragControls, type PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import BinCard from "./components/BinCard";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { WalkContextType } from "./Walk";
import ShineIcon from "../../../src/assets/icons/ai_fill.svg?react";

export default function BottomSheet() {
  const {
    sheetState,
    setSheetState,
    bins,
    loading,
    selectedBinId,
    setSelectedBinId,
    myLocation,
  } = useOutletContext<WalkContextType>();

  const { binId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (binId) {
      setSelectedBinId(Number(binId));
      setSheetState("expanded");
    }
  }, [binId, setSheetState]);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const TOP_Y = 80;
  const MIDDLE_Y = windowHeight * 0.6;
  const BOTTOM_Y = windowHeight - 105;

  const controls = useDragControls();

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

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.y;

    if (offset < -50) {
      if (sheetState === "collapsed") setSheetState("half");
      else if (sheetState === "half") setSheetState("expanded");
    } else if (offset > 50) {
      if (sheetState === "expanded") setSheetState("half");
      else if (sheetState === "half") setSheetState("collapsed");
    }
  };

  return (
    <motion.div
      initial={{ y: MIDDLE_Y }}
      animate={{ y: getTargetY() }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed flex flex-col top-0 left-0 right-0 bg-white w-full max-w-md mx-auto z-40 h-dvh rounded-t-3xl"
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: TOP_Y, bottom: BOTTOM_Y }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="w-15 h-1 bg-[#C3C7CE] rounded-full" />
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex flex-col flex-1 px-3 py-4 gap-3 min-h-0">
          <div className="flex flex-col gap-1 mx-2">
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
              <>
                <div className="p-4 mx-2 rounded-2xl flex flex-col gap-2 shadow-card bg-primary-extralight border border-primary">
                  <div className="flex flex-col gap-1">
                    <p className="text-sub3_sb_16 text-[#31353B]">
                      맞춤형 산책 경로 추천
                    </p>
                    <p className="text-caption3_r_13 text-[#6C727C]">
                      원하시는 활동량에 따른 경로를 추천해드릴게요.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate("/walk/filter", {
                        state: {
                          destinationIds: bins.map((bin) => bin.id),
                          myLocation: myLocation,
                        },
                      })
                    }
                    className="w-full py-3 mt-1 text-sub4_sb_14 bg-primary text-white rounded-lg flex justify-center items-center gap-1.5"
                  >
                    <ShineIcon className="text-white w-4 h-4" />
                    <span>AI 맞춤 경로 디자인</span>
                  </button>
                </div>

                {bins?.map((bin) => (
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
                    myLocation={myLocation!}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
