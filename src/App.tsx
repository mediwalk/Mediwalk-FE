import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Walk from "./pages/Walk/Walk";
import Reward from "./pages/Reward/Reward";
import Mypage from "./pages/Mypage/Mypage";
import NavBar from "./components/NavBar";
import MissionDetail from "./pages/Home/Mission/MissionDetail";

function App() {
  // 네비게이션바 숨길 페이지 설정
  const hideNavBarPaths = ["/mission"];
  const hideNavBar = hideNavBarPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <BrowserRouter>
      {/*} 1. 전체 배경 (PC에서 보이는 회색 배경 */}
      <div className="min-h-dvh bg-gray-100 flex justify-center items-center">
        {/* 2. 앱 컨테이너 (실제 앱 화면) */}
        <div className="w-full max-w-md h-dvh bg-background flex flex-col relative">
          <main className="flex-1 overflow-y-auto relative w-full no-scrollbar">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mission/:missionId" element={<MissionDetail />} />
              <Route path="/walk" element={<Walk />} />
              <Route path="/reward" element={<Reward />} />
              <Route path="/mypage" element={<Mypage />} />
            </Routes>
          </main>
          {!hideNavBar && <NavBar />}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
