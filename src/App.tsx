import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Walk from "./pages/Walk/Walk";
import Reward from "./pages/Reward/Reward";
import Mypage from "./pages/Mypage/Mypage";
import NavBar from "./components/NavBar";
import MissionDetail from "./pages/Home/Mission/MissionDetail";
import RouteFilter from "./pages/Walk/RouteFilter";
import BottomSheet from "./pages/Walk/BottomSheet";

function Layout() {
  const location = useLocation();

  // 네비게이션바 숨길 페이지 설정
  const hideNavBarPaths = ["/mission", "/walk/route"];
  const hideNavBar = hideNavBarPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div className="min-h-dvh bg-gray-100 flex justify-center items-center">
      {/* 2. 앱 컨테이너 (실제 앱 화면) */}
      <div className="w-full max-w-md h-dvh bg-background flex flex-col relative">
        <main className="flex-1 overflow-y-auto relative w-full no-scrollbar">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission/:missionId" element={<MissionDetail />} />

            <Route path="/walk" element={<Walk />}>
              {/* /walk 진입 시: 기본 리스트 상태 */}
              <Route index element={<BottomSheet />} />
              {/* /walk/:binId 진입 시: 특정 수거함 선택 상태 */}
              <Route path=":binId" element={<BottomSheet />} />
              {/* /walk/:binId/filter 진입 시: AI 필터 설정 상태 */}
              <Route path=":binId/filter" element={<RouteFilter />} />
            </Route>

            <Route path="/reward" element={<Reward />} />
            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </main>
        {!hideNavBar && <NavBar />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
