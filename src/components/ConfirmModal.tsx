interface ConfirmModalProps {
  title: string;
  detail: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  title,
  detail,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div className="absolute flex px-4 inset-0 z-60 bg-black/70 items-center justify-center backdrop-blur-md">
      <div className="flex flex-col bg-common-white px-5 pt-5 pb-4 gap-4 rounded-lg w-full">
        <div className="flex flex-col gap-2">
          <div className="text-sub1_sb_18">{title}</div>
          <div className="text-body4_r_14 text-neutral-30">{detail}</div>
        </div>
        <div className="flex items-center justify-end text-sub4_sb_14">
          <button onClick={onClose} className="w-20 px-1 py-2 text-neutral-50">
            취소
          </button>
          <button onClick={onConfirm} className="w-20 px-1 py-2 text-primary">
            진행할래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
