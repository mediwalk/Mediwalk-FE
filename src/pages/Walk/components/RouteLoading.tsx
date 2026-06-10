import { createPortal } from "react-dom";
import PillIcon from "../../../assets/icons/pill_logo.svg?react";

const RouteLoading = () => {
  return createPortal(
    <div className="fixed inset-0 z-100 flex flex-col max-w-md mx-auto left-0 right-0 items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center text-center gap-3 animate-pulse">
        <PillIcon className="w-17 h-17 text-primary m-4" />
        <div className="flex flex-col gap-2.5">
          <h1 className="text-head1_sb_24 text-common-black whitespace-pre-line">
            {"메디워크가 최적의 경로를\n탐색하고 있어요"}
          </h1>
          <p className="text-body4_r_14 text-neutral-30 whitespace-pre-line">
            {"잠시만 기다려주세요.\n곧 적절한 경로를 추천드릴게요"}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RouteLoading;
