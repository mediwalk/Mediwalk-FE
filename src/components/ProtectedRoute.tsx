import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const ProtectedRoute = () => {
  const { id } = useUserStore();

  // 유저 id가 없으면 무조건 로그인 페이지로
  if (!id) {
    return <Navigate to="/login" replace />;
  }

  // id가 있으면 가려던 페이지 정상적으로 띄워줌
  return <Outlet />;
};

export default ProtectedRoute;
