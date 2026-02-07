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

  const handleCurrentLocation = useCallback(() => {
    // 브라우저 지오로케이션으로 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos); // 가져온 좌표로 상태 업데이트

          if (map) {
            map.panTo(pos);
            map.setZoom(17);
          }
        },
        (error) => {
          console.log(error);
        },
      );
    }
  }, [map]);

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
        <MarkerF position={currentPosition} />
        <button
          className="absolute z-10 bottom-15 right-3 cursor-pointer bg-white rounded-full p-2 shadow-sm"
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
