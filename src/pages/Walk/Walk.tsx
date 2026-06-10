import MyGoogleMap from "./components/GoogleMap";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import Header from "../../components/Header";

export interface PointSuggestion {
  poiKey: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  approxAlongRouteMeters: number;
  distanceToPolylineMeters: number;
}

export interface RestPoint {
  id: number;
  routeId: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  order: number;
  distanceFromPrevious: number;
  instruction: string;
}

export interface RouteDataResponse {
  id: number;
  userId: number;
  userDailyMissionId: number | null;
  destinationId: number;
  destinationName: string;
  startLatitude: number;
  startLongitude: number;
  totalDistanceMeters: number;
  estimatedWalkTimeMinutes: number;
  estimatedSteps: number;
  activityLevel: string;
  routePolyline: string;
  hasRestPoints: boolean;
  notifyEcoMart: boolean;
  notifyWalkingProgress: boolean;
  restPoints: RestPoint[];
  martSuggestionsAlongRoute: PointSuggestion[];
  parkSuggestionsAlongRoute: PointSuggestion[];
}

export interface BinLocationData {
  id: number;
  name: string;
  address: string;
  baseRewardAmount: number;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  walkingDistanceMeters: number;
  estimatedWalkTimeMinutes: number;
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
  routePolyline: string | null;
  setRoutePolyline: React.Dispatch<React.SetStateAction<string | null>>;
  routeData: RouteDataResponse | null;
  setRouteData: React.Dispatch<React.SetStateAction<RouteDataResponse | null>>;
  setFocusedLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  myLocation: { lat: number; lng: number } | null;
}

const Walk = () => {
  const { binId } = useParams();
  const location = useLocation();

  const isPreview = location.pathname.includes("preview");

  const [sheetState, setSheetState] = useState<
    "half" | "collapsed" | "expanded"
  >(binId ? "expanded" : "half");

  const [bins, setBins] = useState<BinLocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(
    binId ? Number(binId) : null,
  );

  const { myLocation, isLocating } = useCurrentLocation();

  const [routePolyline, setRoutePolyline] = useState<string | null>(null);

  // 프리뷰 마커를 위한 상태와, 특정 마커 포커싱을 위한 상태 추가
  const [routeData, setRouteData] = useState<RouteDataResponse | null>(null);
  const [focusedLocation, setFocusedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!binId && !isPreview) {
      setSelectedBinId(null);
      setSheetState("half");
      setRoutePolyline(null);
      setRouteData(null);
      setFocusedLocation(null);
    }
  }, [binId, isPreview]);

  useEffect(() => {
    if (isLocating || !myLocation) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const binRes = await api.get("/collection-locations/nearby", {
          params: {
            latitude: myLocation.lat,
            longitude: myLocation.lng,
            radiusKm: 3,
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
      {!isPreview && <Header />}

      <MyGoogleMap
        sheetState={sheetState}
        bins={bins}
        selectedBinId={selectedBinId}
        setSelectedBinId={setSelectedBinId}
        setSheetState={setSheetState}
        routePolyline={routePolyline}
        routeData={routeData} // 지도에 넘겨줌
        focusedLocation={focusedLocation} // 지도에 넘겨줌
        myLocation={myLocation}
      />

      <Outlet
        context={{
          sheetState,
          setSheetState,
          bins,
          loading,
          selectedBinId,
          setSelectedBinId,
          routePolyline,
          setRoutePolyline,
          routeData,
          setRouteData, // 💡 자식(RoutePreview)이 채울 수 있게 넘겨줌
          setFocusedLocation, // 💡 클릭 시 포커스 이동을 위해 넘겨줌
          myLocation,
        }}
      />
    </div>
  );
};

export default Walk;
