import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Walk from "./pages/Walk/Walk";
import Reward from "./pages/Reward/Reward";
import Mypage from "./pages/Mypage/Mypage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      {/*} 1. 전체 배경 (PC에서 보이는 회색 배경 */}
      <div className="min-h-dvh bg-gray-100 flex justify-center items-center">
        {/* 2. 앱 컨테이너 (실제 앱 화면) */}
        <div className="w-full max-w-md h-dvh bg-background flex flex-col relative">
          <main className="flex-1 overflow-y-auto relative w-full no-scrollbar">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/walk" element={<Walk />} />
              <Route path="/reward" element={<Reward />} />
              <Route path="/mypage" element={<Mypage />} />
            </Routes>
          </main>
          <NavBar />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
