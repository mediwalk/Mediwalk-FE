interface ErrorModalProps {
  title: string;
  detail: string;
  onClose: () => void;
}

const ErrorModal = ({ title, detail, onClose }: ErrorModalProps) => {
  return (
    <div className="absolute flex inset-0 z-60 bg-black/70 items-center justify-center backdrop-blur-md">
      <div className="flex flex-col bg-common-white px-5 pt-5 pb-4 gap-2 rounded-xl w-90">
        <div className="flex flex-col gap-2 justify-center">
          <div className="text-sub1_sb_18">{title}</div>
          <div className="text-body4_r_14 text-neutral-30">{detail}</div>
        </div>
        <div className="flex items-center justify-end text-sub4_sb_14">
          <button onClick={onClose} className="w-20 px-1 py-2 text-primary">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
