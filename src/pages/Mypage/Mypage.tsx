import Header from "../../components/Header";
import PillIcon from "../../assets/icons/pill_logo.svg?react";
import SettingListItem from "./SettingListItem";
import useUserStore from "../../store/useUserStore";

import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../api/firebase";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";

const Mypage = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { name, email, clearUser } = useUserStore();

  const closeModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      // 파이어베이스 로그아웃 (구글 세션 끊기)
      await signOut(auth);

      // Zustand 비우기 (이 함수가 실행되면 persist가 알아서 로컬 스토리지 백업)
      clearUser();

      // 로그인 페이지로 강제 이동 (replace: true 로 뒤로가기 방지)
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <div>
        <Header />
        {/* 하단 메인 영역 */}
        <main className="flex flex-col px-5 gap-3">
          {/* profile 영역 */}
          <section className="py-4">
            <div className="flex px-4 py-5 gap-3 bg-common-white items-center border-[1.5px] border-primary rounded-xl justify-between">
              <div className="flex gap-3">
                <div className="rounded-full bg-primary w-12 h-12 justify-center items-center flex">
                  <PillIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-title1_sb_20">{name || "김메디"}</span>
                  <span className="text-caption1_m_13 text-cool-neutral-30">
                    {email || "mediwalk@gmail.com"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(!isLogoutModalOpen);
                }}
                className="px-3 py-1.5 bg-neutral-99 border border-neutral-95 rounded-sm text-cool-neutral-40 text-caption1_m_13 cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          </section>
          {/* settings 영역 */}
          <div className="flex flex-col gap-10 pb-10">
            {/* 계정 관리 영역 */}
            <section className="flex flex-col gap-1">
              <div className="text-sub4_sb_14 text-cool-neutral-40">
                계정 관리
              </div>
              <div className="flex flex-col px-3 py-1 rounded-xl bg-common-white shadow-card">
                <SettingListItem icon="person" title="프로필 수정" />
                <SettingListItem icon="account" title="계좌 관리" />
                <SettingListItem icon="location" title="내 주소 설정" />
              </div>
            </section>
            {/* 앱 설정 영역 */}
            <section className="flex flex-col gap-1">
              <div className="text-sub4_sb_14 text-cool-neutral-40">
                앱 설정
              </div>
              <div className="flex flex-col px-3 py-1 rounded-xl bg-common-white shadow-card">
                <SettingListItem icon="notification" title="알림 설정" />
                <SettingListItem icon="security" title="개인정보 처리방침" />
                <SettingListItem icon="setting" title="앱 설정" />
              </div>
            </section>
            {/* 고객 지원 영역 */}
            <section className="flex flex-col gap-1">
              <div className="text-sub4_sb_14 text-cool-neutral-40">
                고객 지원
              </div>
              <div className="flex flex-col px-3 py-1 rounded-xl bg-common-white shadow-card">
                <SettingListItem icon="info" title="자주 묻는 질문" />
                <SettingListItem icon="question" title="1:1 문의하기" />
              </div>
            </section>
          </div>
        </main>
      </div>
      {isLogoutModalOpen && (
        <ConfirmModal
          title="정말 로그아웃 하시겠습니까?"
          detail=""
          onClose={closeModal}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default Mypage;
