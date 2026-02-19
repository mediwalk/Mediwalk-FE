import { useState, useEffect } from "react";

export const useCurrentLocation = () => {
  const [myLocation, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(true); // GPS 찾는 중인지 여부

  useEffect(() => {
    // 브라우저가 GPS를 지원하지 않을 때 (기본 위치: 서울역)
    if (!navigator.geolocation) {
      setLocation({ lat: 37.5559, lng: 126.9723 });
      setIsLocating(false);
      return;
    }

    // 위치 가져오기 시작
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없습니다:", error);
        // 권한 거부 시 기본 위치(서울역 등)로 세팅
        setLocation({ lat: 37.5559, lng: 126.9723 });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  return { myLocation, isLocating };
};
