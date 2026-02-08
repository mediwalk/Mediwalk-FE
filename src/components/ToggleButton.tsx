interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleButton = ({ isOn, onToggle }: ToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 flex items-center rounded-full px-1 transition-colors duration-300 ${
        isOn ? "bg-primary" : "bg-gray-300"
      }`}
    >
      {/* 토글 내부의 하얀 원 */}
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
