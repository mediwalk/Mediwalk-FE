import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../assets/icons/arrow1_left.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import useUserStore from "../../store/useUserStore";
import { useEffect, useState } from "react";
import api from "../../api/axios";

interface RewardTransaction {
  id: number;
  userId: number;
  eventId: number | null;
  eventTitle: string | null;
  locationName: string | null;
  eventType: string | null;
  accumulationCompleted: boolean;
  amount: number;
  transactionType: string;
  transactionDate: string;
  description: string | null;
  imageUrl: string | null;
  bankName: string | null;
  accountNumberMasked: string | null;
}

const TotalCollectionHistory = () => {
  const navigate = useNavigate();
  const { id: userId } = useUserStore();

  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const getCurrentYearDateRange = () => {
    const now = new Date();
    // 올해 1월 1일 00:00:00
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
    // 올해 12월 31일 23:59:59
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

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

    const fetchTotalData = async () => {
      try {
        const { startDateTime, endDateTime } = getCurrentYearDateRange();

        const countRequest = api.get(`/reward-transactions/count`, {
          params: { userId, startDateTime, endDateTime },
        });

        const listRequest = api.get(
          `/reward-transactions/medicine-collections`,
          {
            params: {
              userId,
              startDateTime,
              endDateTime,
            },
          },
        );

        // 두 요청이 끝날 때까지 한 번에 기다림
        const [countResponse, listResponse] = await Promise.all([
          countRequest,
          listRequest,
        ]);

        setTotalCount(countResponse.data.totalCount || 0);
        setTransactions(listResponse.data);
      } catch (error) {
        console.error("누적 수거 내역 로딩 실패:", error);
      }
    };

    fetchTotalData();
  }, [userId]);
  return (
    <div className="h-dvh flex flex-col">
      <header className="px-5 pt-6 pb-3 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/reward")} />
      </header>
      <main className="flex flex-col flex-1 min-h-0 gap-6 pt-6 pb-15">
        <section className="flex flex-col px-5 gap-1 shrink-0">
          <div className="flex gap-1 text-head1_sb_24">
            누적 수거<span className="text-primary">{totalCount}회</span>
          </div>
          <div className="text-body4_r_14 text-cool-neutral-40">
            이번 년도 누적 폐의약품 수거 횟수를 알려드려요
          </div>
        </section>
        <section className="flex flex-col flex-1 gap-2 min-h-0">
          <div className="flex flex-col gap-2 px-5 pb-2 overflow-hidden overflow-y-auto no-scrollbar">
            {transactions.length > 0 ? (
              transactions.map((item) => {
                // 날짜 포맷팅
                const dateObj = new Date(item.transactionDate);
                const formattedDate = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, "0")}. ${String(dateObj.getDate()).padStart(2, "0")}`;

                let displayTitle = "";
                if (item.eventType === "EXERCISE_MISSION_COMPLETE") {
                  displayTitle = "운동 미션 완료";
                } else {
                  displayTitle = "폐의약품 수거";
                }
                const displayLocation =
                  item.locationName || item.description || "위치 정보 없음";
                const amountText = `+ ${item.amount.toLocaleString()}원`;

                return (
                  <article
                    key={item.id}
                    className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card"
                  >
                    <div className="w-11 h-11 bg-[#EDF1F7] rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={displayTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#D1D9E6]"></div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 gap-1 justify-center">
                      <div className="flex justify-between items-center">
                        <div className="text-[#31353B] text-sub3_sb_16">
                          {displayTitle}
                        </div>
                        <div className="text-primary text-sub4_sb_14">
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
                누적된 수거 내역이 없습니다.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TotalCollectionHistory;
