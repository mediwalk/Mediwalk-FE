// src/pages/Home/GoogleMap.tsx
import { useCallback, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { TbCurrentLocation } from "react-icons/tb";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// 위치를 못 가져왔을 때 보여줄 기본 좌표
const defaultCenter = {
  lat: 37.5559,
  lng: 126.9723,
};

export default function MyGoogleMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // 지도 인스턴스와 현재 위치를 저장할 상태
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [isTracking, setIsTracking] = useState(true); // 지도 중심이 나를 따라다닐지 여부

  // 💡 실시간 위치 감시 로직
  useEffect(() => {
    if (!navigator.geolocation) return;

    // watchPosition은 위치가 변할 때마다 콜백을 실행합니다.
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // 1. 마커 위치 업데이트 (마커가 지도를 따라 움직임)
        setCurrentPosition(newPos);

        // 2. 트래킹 모드일 때만 지도 중심 이동
        if (isTracking && map) {
          map.panTo(newPos);
        }
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        maximumAge: 0, // 항상 최신 위치 가져오기
        timeout: 5000,
      }, // 높은 정확도 설정
    );

    // 컴포넌트 언마운트 시 감시 종료
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoaded, map, isTracking]);

  // 현재 위치 버튼 클릭 시: 내 위치로 이동 + 다시 추적 활성화
  const handleCurrentLocation = useCallback(() => {
    if (map) {
      map.panTo(currentPosition);
      map.setZoom(17);
      setIsTracking(true); // 다시 나를 따라오게 설정
    }
  }, [map, currentPosition]);

  useEffect(() => {
    if (isLoaded) {
      handleCurrentLocation();
    }
  }, [isLoaded, handleCurrentLocation]);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition} //  상태값을 중심으로 설정
        zoom={17}
        options={{
          disableDefaultUI: true,
        }}
        onLoad={(map) => setMap(map)}
      >
        {/* 현재 내 위치에 마커 표시 */}
        <MarkerF
          position={currentPosition}
          zIndex={1}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4e83ff",
            fillOpacity: 0.2,
            strokeWeight: 0,
            scale: 23,
          }}
        />
        <MarkerF
          position={currentPosition}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4e83ff",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 3,
            scale: 8,
          }}
        />

        <button
          className="absolute z-10 bottom-25 right-4 cursor-pointer bg-white rounded-full p-2 shadow-sm"
          onClick={handleCurrentLocation}
        >
          <TbCurrentLocation className="size-5" />
        </button>
      </GoogleMap>
    </div>
  ) : (
    <div className="h-87 bg-gray-100 animate-pulse rounded-3xl" />
  );
}
