import MyGoogleMap from "./components/GoogleMap";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import Header from "../../components/Header";

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
  routePolyline: string | null;
  setRoutePolyline: React.Dispatch<React.SetStateAction<string | null>>;
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

  useEffect(() => {
    if (isLocating || !myLocation) return;

    const fetchData = async () => {
      try {
        setLoading(true);
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
      {!isPreview && <Header />}

      <MyGoogleMap
        sheetState={sheetState}
        bins={bins}
        selectedBinId={selectedBinId}
        setSelectedBinId={setSelectedBinId}
        setSheetState={setSheetState}
        routePolyline={routePolyline} // 💡 지도 컴포넌트로 전달
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
          setRoutePolyline, // 💡 프리뷰 컴포넌트(자식)가 값을 세팅할 수 있게 전달
          myLocation,
        }}
      />
    </div>
  );
};

export default Walk;
