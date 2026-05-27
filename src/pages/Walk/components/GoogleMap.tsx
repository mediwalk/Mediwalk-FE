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

const libraries: ("geometry" | "places")[] = ["geometry"];

interface MapProps {
  sheetState: "half" | "collapsed" | "expanded";
  bins: BinLocationData[];
  selectedBinId: number | null;
  setSelectedBinId: (id: number | null) => void;
  setSheetState: (state: "half" | "collapsed" | "expanded") => void;
  routePolyline?: string | null; 
  myLocation: { lat: number; lng: number };
}

export default function MyGoogleMap({
  sheetState,
  bins,
  selectedBinId,
  setSelectedBinId,
  setSheetState,
  routePolyline,
  myLocation,
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script-2",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState(myLocation);
  const [initialCenter] = useState(myLocation);
  const [isTracking, setIsTracking] = useState(true);

  // 해독된 좌표 배열을 담을 상태
  const [decodedPath, setDecodedPath] = useState<google.maps.LatLng[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentPosition(newPos);
        if (isTracking && map) {
          map.panTo(newPos);
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoaded, map, isTracking]);

  useEffect(() => {
    if (selectedBinId && map && bins.length > 0) {
      const selectedBin = bins.find((b) => b.id === selectedBinId);
      if (selectedBin) {
        map.panTo({ lat: selectedBin.latitude, lng: selectedBin.longitude });
        map.setZoom(17);
        setIsTracking(false);
      }
    }
  }, [selectedBinId, map, bins]);

  useEffect(() => {
    if (routePolyline && window.google && window.google.maps.geometry) {
      try {
        // 1. 암호화된 문자열 -> 실제 좌표 배열
        const path =
          window.google.maps.geometry.encoding.decodePath(routePolyline);
        setDecodedPath(path);

        // 2. 카메라 줌 자동 맞춤
        if (map && path.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          path.forEach((point) => bounds.extend(point));
          map.fitBounds(bounds, {
            top: 150,
            bottom: window.innerHeight * 0.45,
            left: 50, // 좌측 여백
            right: 50, // 우측 여백
          });

          map.panBy(0, 100); // 바텀시트 가려지는 거 보정
          setIsTracking(false);
        }
      } catch (e) {
        console.error("Polyline 디코딩 실패:", e);
      }
    } else {
      setDecodedPath([]);
    }
  }, [routePolyline, map]);

  const handleCurrentLocation = useCallback(() => {
    if (map) {
      map.panTo(currentPosition);
      map.setZoom(17);
      setIsTracking(true);
    }
  }, [map, currentPosition]);

  const getMapHeight = () => {
    switch (sheetState) {
      case "half":
        return "55%";
      case "collapsed":
        return "100%";
      case "expanded":
        return "55%";
      default:
        return "55%";
    }
  };

  return isLoaded ? (
    <motion.div
      className="w-full relative"
      animate={{ height: getMapHeight() }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenter}
        zoom={17}
        options={{ disableDefaultUI: true }}
        onLoad={(map) => {
          setMap(map);
          map.panTo(currentPosition);
        }}
        onDragStart={() => setIsTracking(false)}
      >
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

        {bins.map((bin) => {
          const isSelected = selectedBinId === bin.id;
          const size = isSelected
            ? new google.maps.Size(40, 53)
            : new google.maps.Size(30, 40);
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
              icon={{
                url: isSelected
                  ? "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='%233b82f6' d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'/%3E%3C/svg%3E"
                  : "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='%239ca3af' d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'/%3E%3C/svg%3E",
                scaledSize: size,
                anchor: anchor,
              }}
            />
          );
        })}

        {/* 💡 해독된 진짜 선을 그립니다! */}
        {decodedPath.length > 0 && (
          <PolylineF
            path={decodedPath}
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
