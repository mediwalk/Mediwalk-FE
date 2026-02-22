// 한글 -> API 규격(Enum) 변환
export const mapActivityLevel = (kor: string | null) => {
  if (kor === "활발한") return "ACTIVE";
  if (kor === "최대의") return "MAXIMUM";
  return "MODERATE"; // 기본값 (적당한)
};

export const mapSlopeLevel = (kor: string | null) => {
  if (kor === "적당한") return "MODERATE";
  if (kor === "가파른") return "STEEP";
  return "GENTLE"; // 기본값 (완만한)
};
