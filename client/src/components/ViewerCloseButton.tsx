import { X } from "lucide-react";

// 사진 전체화면 뷰어 공용 닫기 버튼.
// - 손가락으로 누르기 쉽도록 56px 원형(터치 권장 크기 44px 이상, 모든 뷰어에서 같은 모양)
// - 클릭/터치가 뒤에 깔린 창(상세 팝업, 목록 등)으로 전달되지 않도록 이벤트를 모두 막는다.
//   (예전에는 닫기를 누르면 같은 클릭이 아래 창에도 전달돼 여러 창이 한꺼번에 닫히는 일이 있었음)
export default function ViewerCloseButton({ onClose, className = "" }: { onClose: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label="닫기"
      className={`w-14 h-14 rounded-full bg-white/25 active:bg-white/40 flex items-center justify-center text-white shrink-0 ${className}`}
      style={{ touchAction: "manipulation" }}
      onPointerDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <X size={28} />
    </button>
  );
}
