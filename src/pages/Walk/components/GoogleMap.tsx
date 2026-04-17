// src/pages/Home/GoogleMap.tsx
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  PolylineF,
} from "@react-google-maps/api";
import { TbCurrentLocation } from "react-icons/tb";
import type { BinLocationData } from "../Walk";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// 구글 맵에서 경로 디코딩을 위해 geometry 라이브러리 추가 선언
//const libraries: "geometry"[] = ["geometry"];

// 부모가 넘겨주는 Props 타입 정의
interface MapProps {
  sheetState: "half" | "collapsed" | "expanded";
  bins: BinLocationData[];
  selectedBinId: number | null;
  setSelectedBinId: (id: number | null) => void;
  setSheetState: (state: "half" | "collapsed" | "expanded") => void;
  //routePolyline?: string | null;
  routePath?: google.maps.LatLngLiteral[];
  myLocation: { lat: number; lng: number };
}

export default function MyGoogleMap({
  sheetState,
  bins,
  selectedBinId,
  setSelectedBinId,
  setSheetState,
  //routePolyline,
  routePath,
  myLocation,
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script-2",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    //libraries: libraries,
  });

  // 지도 인스턴스와 현재 위치를 저장할 상태
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState(myLocation);

  // 처음 지도 렌더링 시 쓸 '고정된' 초기 위치
  const [initialCenter] = useState(myLocation);

  const [isTracking, setIsTracking] = useState(true); // 지도 중심이 나를 따라다닐지 여부

  // 해독된 경로(위도/경도 배열)를 저장할 상태
  //const [decodedPath, setDecodedPath] = useState<google.maps.LatLng[]>([]);

  // 실시간 위치 감시 로직
  useEffect(() => {
    if (!navigator.geolocation) return;

    // watchPosition은 위치가 변할 때마다 콜백을 실행
    const watchId = navigator.geolocation.watchPosition(
      (_position) => {
        const newPos = {
          lat: 37.62476618466441,
          lng: 127.07364509499423,
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

  // 바텀시트에서 수거함을 클릭하면 지도의 중심을 그 수거함으로 이동
  useEffect(() => {
    if (selectedBinId && map && bins.length > 0) {
      const selectedBin = bins.find((b) => b.id === selectedBinId);
      if (selectedBin) {
        map.panTo({ lat: selectedBin.latitude, lng: selectedBin.longitude });
        map.setZoom(17);
        setIsTracking(false); // 수거함 볼 때는 내 위치 추적 잠깐 끄기
      }
    }
  }, [selectedBinId, map, bins]);

  /*   // 경로 선(Polyline)이 들어오면 해독해서 지도 중심 맞추기
  useEffect(() => {
    if (routePolyline && window.google) {
      // 1. 암호화된 문자열을 실제 좌표 배열로 해독
      const path =
        window.google.maps.geometry.encoding.decodePath(routePolyline);
      setDecodedPath(path);

      // 2. 경로 전체가 한눈에 보이게 지도 카메라 자동 줌/이동
      if (map && path.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);

        // 바텀시트가 아래를 가리니까 지도를 살짝 위로 올려줌
        map.panBy(0, 100);
        setIsTracking(false); // 경로 볼 때는 내 위치 추적 끄기
      }
    } else {
      setDecodedPath([]); // 경로가 없으면 초기화
    }
  }, [routePolyline, map]); */

  // 배열이 들어오면 경로 전체가 보이게 카메라 줌만 맞춰주기
  useEffect(() => {
    if (routePath && routePath.length > 0 && map && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      routePath.forEach((point) => bounds.extend(point)); // 배열의 점들을 전부 포함하게 범위 잡기
      map.fitBounds(bounds);

      setIsTracking(false);
    }
  }, [routePath, map]);

  // 현재 위치 버튼 클릭 시: 내 위치로 이동 + 다시 추적 활성화
  const handleCurrentLocation = useCallback(() => {
    if (map) {
      map.panTo(currentPosition);
      map.setZoom(17);
      setIsTracking(true); // 다시 나를 따라오게 설정
    }
  }, [map, currentPosition]);

  // 상태에 따른 지도 높이 계산
  const getMapHeight = () => {
    switch (sheetState) {
      case "half":
        return "55%"; // 바텀시트가 중간일 때: 화면의 55%만 차지
      case "collapsed":
        return "100%"; // 바텀시트가 내려갔을 때: 화면 꽉 채움
      case "expanded":
        return "55%"; // 바텀시트가 펼쳐졌을 때
      default:
        return "55%";
    }
  };

  return isLoaded ? (
    <motion.div
      className="w-full relative"
      animate={{ height: getMapHeight() }} // 높이 변경 애니메이션
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenter} //  상태값을 중심으로 설정
        zoom={17}
        options={{
          disableDefaultUI: true,
        }}
        onLoad={(map) => {
          setMap(map);
          map.panTo(currentPosition);
        }}
        onDragStart={() => setIsTracking(false)} // 지도 직접 드래그하면 추적 해제
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

        {/* API로 받아온 수거함 마커들 렌더링 */}
        {bins.map((bin) => {
          const isSelected = selectedBinId === bin.id;

          // 크기 정의
          const size = isSelected
            ? new google.maps.Size(40, 53)
            : new google.maps.Size(30, 40);

          // 앵커 정의 (크기에 맞춰 정확한 밑부분 중앙 계산)
          const anchor = isSelected
            ? new google.maps.Point(20, 53)
            : new google.maps.Point(15, 39);

          return (
            <MarkerF
              key={bin.id}
              position={{ lat: bin.latitude, lng: bin.longitude }}
              onClick={() => {
                setSelectedBinId(bin.id);
                setSheetState("half");
              }}
              // 선택된 마커는 파란색, 아니면 회색 핀으로 표시
              icon={{
                url: isSelected
                  ? "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='%233b82f6' d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'/%3E%3C/svg%3E"
                  : "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='%239ca3af' d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'/%3E%3C/svg%3E",

                // 위에서 정의한 변수 사용
                scaledSize: size,
                anchor: anchor,
              }}
            />
          );
        })}

        {/* 경로 선 그리기 */}
        {/* {decodedPath.length > 0 && (
          <PolylineF
            path={decodedPath}
            options={{
              strokeColor: "#3b82f6", // tailwind primary 색상 (파란색)
              strokeOpacity: 0.8,
              strokeWeight: 6, // 선 두께
            }}
          />
        )} */}

        {routePath && routePath.length > 0 && (
          <PolylineF
            path={routePath}
            options={{
              strokeColor: "#3b82f6",
              strokeOpacity: 0.8,
              strokeWeight: 6,
            }}
          />
        )}

        <button
          className={`absolute z-10 right-4 cursor-pointer bg-white rounded-full p-2 shadow-sm ${sheetState === "collapsed" ? "bottom-47" : "bottom-10"}`}
          onClick={handleCurrentLocation}
        >
          <TbCurrentLocation
            className={`size-5 ${isTracking ? "text-primary" : "text-gray-400"}`}
          />
        </button>
      </GoogleMap>
    </motion.div>
  ) : (
    <div className="h-87 bg-gray-100 animate-pulse rounded-3xl" />
  );
}
