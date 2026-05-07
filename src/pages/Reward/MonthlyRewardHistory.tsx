import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../assets/icons/arrow1_left.svg?react";
import FilterIcon from "../../assets/icons/filter_line.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import api from "../../api/axios";

// API 응답용 타입
interface RewardTransaction {
  id: number;
  userId: number;
  eventId: number | null;
  eventTitle: string | null;
  locationName: string | null;
  eventType: "MEDICINE_COLLECTION" | "EXERCISE_MISSION_COMPLETE";
  accumulationCompleted: boolean;
  amount: number;
  transactionType: "ACCUMULATION" | "REFUND";
  transactionDate: string;
  description: string | null;
  imageUrl: string | null;
  bankName: string | null;
  accountNumberMasked: string | null;
}

const MonthlyRewardHistory = () => {
  const navigate = useNavigate();
  const { id: userId } = useUserStore();

  const [activeFilter, setActiveFilter] = useState<"최신순" | "과거순">(
    "최신순",
  );

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);

  // 상단 요약 정보를 담을 상태
  const [summary, setSummary] = useState({
    thisMonthTotal: 0,
    increaseRate: 0,
    totalCount: 0,
  });

  const handleFilter = (selectedFilter: "최신순" | "과거순") => {
    setActiveFilter(selectedFilter);
    setIsFilterOpen(!isFilterOpen);
  };

  // 현재 달의 시작일과 종료일을 ISO 8601 형식(YYYY-MM-DDTHH:mm:ss)으로 구하는 함수
  const getCurrentMonthDateRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const pad = (n: number) => String(n).padStart(2, "0");
    const formatISO = (date: Date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    return {
      startDateTime: formatISO(start),
      endDateTime: formatISO(end),
    };
  };

  useEffect(() => {
    if (!userId) return;

    const fetchMonthlyData = async () => {
      try {
        // 1. 상단 요약 정보 (이번달 모은 금액, 증감률) 가져오기 위해 main API 호출
        const mainRes = await api.get(`/reward-main`, {
          params: { userId },
        });

        // 2. 명세서에 맞춘 파라미터 세팅 (이번 달 범위 + 최신/과거순 정렬)
        const { startDateTime, endDateTime } = getCurrentMonthDateRange();
        const sortParam = activeFilter === "최신순" ? "latest" : "oldest";

        const txRes = await api.get(`/reward-transactions`, {
          params: {
            userId,
            startDateTime,
            endDateTime,
            sort: sortParam,
            size: 100, // 넉넉하게 한 달 치 가져오기
          },
        });

        const txData: RewardTransaction[] = txRes.data;

        setSummary({
          thisMonthTotal: mainRes.data.thisMonthRewardTotal || 0,
          increaseRate: mainRes.data.rewardIncreaseRateComparedToLastMonth || 0,
          totalCount: txData.length, // 불러온 내역의 개수
        });

        setTransactions(txData);
      } catch (error) {
        console.error("이번 달 적립 내역 로딩 실패:", error);
      }
    };

    fetchMonthlyData();
  }, [userId, activeFilter]);

  return (
    <div className="h-dvh flex flex-col">
      <header className="pt-6 pb-3 px-5 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/reward")} />
      </header>
      <main className="flex flex-col flex-1 min-h-0 gap-5 pt-6 pb-15">
        <section className="flex flex-col px-5 gap-1 shrink-0">
          <div className="flex gap-1 text-head1_sb_24">
            이번 달
            <span className="text-primary">
              {summary.thisMonthTotal.toLocaleString()}원
            </span>
            모았어요
          </div>
          <div className="text-body4_r_14 text-cool-neutral-40">
            지난 달 대비 {summary.increaseRate > 0 ? "+" : ""}
            {summary.increaseRate}%
          </div>
        </section>
        <section className="flex flex-col flex-1 gap-2 min-h-0">
          <div className="flex relative justify-between items-center px-5 shrink-0">
            <div className="flex gap-0.5 text-sub2_m_18">
              총
              <span className="text-primary text-sub1_sb_18">
                {summary.totalCount}
              </span>
              회
            </div>
            <div
              className="flex gap-1 py-1.5 pl-3 text-body2_m_14 text-cool-neutral-40 items-center cursor-pointer"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FilterIcon className="w-4 h-4 text-cool-neutral-60" />
              {activeFilter}
            </div>
            {isFilterOpen && (
              <div className="flex flex-col absolute z-50 text-center top-10 right-0 bg-common-white text-body2_m_14 rounded-sm border border-cool-neutral-90">
                <div
                  className={`px-5 py-1.5 rounded-t-sm cursor-pointer ${
                    activeFilter === "최신순"
                      ? "bg-primary-extralight text-primary"
                      : "bg-common-white text-cool-neutral-30"
                  }`}
                  onClick={() => handleFilter("최신순")}
                >
                  최신순
                </div>
                <div
                  className={`px-5 py-1.5 rounded-b-sm cursor-pointer ${
                    activeFilter === "과거순"
                      ? "bg-primary-extralight text-primary"
                      : "bg-common-white text-cool-neutral-30"
                  }`}
                  onClick={() => handleFilter("과거순")}
                >
                  과거순
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 gap-2 px-5 pb-2 overflow-hidden overflow-y-auto no-scrollbar">
            {transactions.length > 0 ? (
              transactions.map((item) => {
                const isAccumulation = item.transactionType === "ACCUMULATION";
                const dateObj = new Date(item.transactionDate);
                const formattedDate = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, "0")}. ${String(dateObj.getDate()).padStart(2, "0")}`;

                let displayTitle = "";
                if (item.transactionType === "REFUND") {
                  displayTitle = "리워드 환급";
                } else if (item.eventType === "EXERCISE_MISSION_COMPLETE") {
                  displayTitle = "운동 미션 완료";
                } else {
                  displayTitle = "폐의약품 수거";
                }

                const displayLocation = isAccumulation
                  ? item.locationName || "위치 정보 없음"
                  : `${item.bankName || ""} ${item.accountNumberMasked || ""}`.trim();

                const amountText = `${item.amount > 0 ? "+" : ""} ${item.amount.toLocaleString()}원`;
                return (
                  <article
                    key={item.id}
                    className={`flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card`}
                  >
                    <div className="w-11 h-11 bg-[#EDF1F7] rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        // 이미지가 있으면 출력
                        <img
                          src={item.imageUrl}
                          alt={displayTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // 이미지가 없으면 기본 배경색
                        <div className="w-full h-full bg-[#D1D9E6]"></div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-1 justify-center">
                      <div className="flex justify-between items-center">
                        <div className="text-[#31353B] text-sub3_sb_16">
                          {displayTitle}
                        </div>
                        <div
                          className={`${item.amount > 0 ? "text-primary" : "text-[#62738F]"} text-sub4_sb_14`}
                        >
                          {amountText}
                        </div>
                      </div>
                      <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                        {formattedDate}
                        {displayLocation && <BulletIcon className="w-4 h-4" />}
                        {displayLocation}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-cool-neutral-40 text-sub3_sb_16">
                이번 달 내역이 없습니다.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MonthlyRewardHistory;
