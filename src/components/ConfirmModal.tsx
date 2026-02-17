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
    <div className="absolute inset-0 bg-black/70 items-center justify-center">
      <div className="bg-white">
        <div>{title}</div>
        <div>{detail}</div>
        <div>
          <button onClick={onClose}>취소</button>
          <button onCanPlayThrough={onConfirm}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
