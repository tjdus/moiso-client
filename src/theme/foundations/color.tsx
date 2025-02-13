// src/theme/foundations/color.js
const colors = {
  brand: {
    50: { value: "#e6f3ff" },  // 가장 밝은 하늘색
    100: { value: "#b3d7ff" },
    200: { value: "#80bcff" },
    300: { value: "#4da0ff" },
    400: { value: "#1a85ff" },
    500: { value: "#0066e6" }, // 메인 포인트 색상 - 진한 파란색
    600: { value: "#0052b3" },
    700: { value: "#003d80" },
    800: { value: "#00294d" },
    900: { value: "#001426" },
  },
  text: {
    default: { value: "#222222" },
    primary: { value: "#000000" }, // 기본 글자 색
    secondary: { value: "#cccccc" }, // 보조 글자 색
  },
  background: {
    default: { value: "#1a202c" }, // 전체 배경색
    card: { value: "#2d3748" }, // 카드 등의 배경색
  },
  success: { value: "#38A169" }, // 성공 메시지 색
  warning: { value: "#ECC94B" }, // 경고 메시지 색
  error: { value: "#E53E3E" }, // 오류 메시지 색
};

export default colors;
