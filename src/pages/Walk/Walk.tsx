import { BiBell } from "react-icons/bi";
import MyGoogleMap from "./components/GoogleMap";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

export interface BinLocationData {
  id: number;
  name: string;
  address: string;
  baseRewardAmount: number;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  walkingDistanceMeters: number;
  estimatedSteps: number;
}

export interface WalkContextType {
  sheetState: "half" | "collapsed" | "expanded";
  setSheetState: React.Dispatch<
    React.SetStateAction<"half" | "collapsed" | "expanded">
  >;
  bins: BinLocationData[];
  loading: boolean;
  selectedBinId: number | null;
  setSelectedBinId: React.Dispatch<React.SetStateAction<number | null>>;
}

const Walk = () => {
  const { binId } = useParams();
  const location = useLocation();

  const isPreview = location.pathname.includes("preview");

  // 자식이 드래그로 바꿀 상태를 여기서 관리
  const [sheetState, setSheetState] = useState<
    "half" | "collapsed" | "expanded"
  >(binId ? "expanded" : "half");

  const [bins, setBins] = useState<BinLocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(
    binId ? Number(binId) : null,
  );

  const { myLocation, isLocating } = useCurrentLocation();

  //const [routePolyline, setRoutePolyline] = useState<string | null>(null); // 경로 PolyLine 상태
  const [routePath, setRoutePath] = useState<any[]>([]); //일단은 배열로 위도경도 전달

  // API 호출 - 화면이 켜지면 실행
  useEffect(() => {
    if (isLocating || !myLocation) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 근처 수거함 가져오기 (현재 내 위치 위도/경도 임시값 넣음)
        const binRes = await api.get("/collection-locations/nearby", {
          params: {
            latitude: myLocation.lat,
            longitude: myLocation.lng,
            radiusKm: 2,
          },
        });
        setBins(binRes.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [myLocation, isLocating]);

  if (isLocating || !myLocation) {
    return (
      <div className="h-dvh flex items-center justify-center bg-white">
        <p className="font-semibold text-primary animate-pulse">
          현재 위치를 찾고 있습니다...
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-dvh">
      {/* 헤더 */}
      {!isPreview && (
        <header className="flex h-16 justify-between items-center px-6">
          <div className="text-2xl font-bold">mediwalk</div>
          <div className="cursor-pointer">
            <BiBell className="size-6" />
          </div>
        </header>
      )}
      {/* 지도에 데이터와 상태 넘겨주기 */}
      <MyGoogleMap
        sheetState={sheetState}
        bins={bins}
        selectedBinId={selectedBinId}
        setSelectedBinId={setSelectedBinId}
        setSheetState={setSheetState}
        //routePolyline={routePolyline}
        routePath={routePath}
        myLocation={myLocation}
      />
      {/*  바텀시트에 Context로 데이터 넘겨주기 */}
      <Outlet
        context={{
          sheetState,
          setSheetState,
          bins,
          loading,
          selectedBinId,
          setSelectedBinId,
          //routePolyline,
          //setRoutePolyline,
          routePath,
          setRoutePath,
          myLocation,
        }}
      />
    </div>
  );
};

export default Walk;
