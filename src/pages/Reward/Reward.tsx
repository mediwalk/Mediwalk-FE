import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Badge from "../../components/Badge";

// Icons
import ArrowRightIcon from "../../assets/icons/arrow2_right.svg?react";
import MoneyIcon from "../../assets/icons/money_fill.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import DateIcon from "../../assets/icons/date_fill.svg?react";
import PotIcon from "../../assets/icons/pot_badge.svg?react";
import ShoeIcon from "../../assets/icons/shoe_badge.svg?react";
import SaveIcon from "../../assets/icons/save_badge.svg?react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

// API 응답용 타입
interface RewardMainResponse {
  userId: number;
  lastMonthRewardTotal: number;
  thisMonthRewardTotal: number;
  thisMonthMedicineCollectionRewardTotal: number;
  totalAccumulatedReward: number;
  rewardIncreaseRateComparedToLastMonth: number | null;
  totalCollectionsCount: number;
  yearlyMedicineCollectionCount: number;
  achievements: Achievement[];
  recentRewardTransactions: RewardTransaction[];
}

interface Achievement {
  userAchievementId: number;
  achievementId: number;
  achievementCode:
    | "ENV_NOVICE"
    | "ENV_GUARDIAN"
    | "ENV_RELIABLE"
    | "WALK_NEWBIE"
    | "WALK_HEALTHY"
    | "WALK_IRON"
    | "SAVE_THRIFTY"
    | "SAVE_EXPERT"
    | "SAVE_ASSET";
  achievementName: string;
  achievementDescription: string;
  achievementCategory:
    | "ENVIRONMENTAL_PROTECTOR"
    | "WALKING_EXPERT"
    | "SAVINGS_MASTER";
  isAchieved: boolean;
  achievedDate: string | null;
  iconType: "environment" | "walking" | "savings";
}

interface RewardTransaction {
  id: number;
  userId: number;
  eventId: number;
  eventTitle: string;
  locationName: string;
  eventType: "MEDICINE_COLLECTION" | "EXERCISE_MISSION_COMPLETE";
  accumulationCompleted: boolean;
  amount: number;
  transactionType: "ACCUMULATION" | "REFUND";
  transactionDate: string;
  bankName?: string;
  accountNumberMasked?: string;
}

// 화면 렌더링용 타입
interface FormattedTransaction {
  id: number;
  title: string;
  status: string;
  date: string;
  location: string;
  amount: string;
  isPositive: boolean;
}

const Reward = () => {
  const navigate = useNavigate();
  const { id } = useUserStore();
  const [activeTab, setActiveTab] = useState("달성 목표");

  const [rewardMainData, setRewardMainData] =
    useState<RewardMainResponse | null>(null);

  const [transactionData, setTransactionData] = useState<
    FormattedTransaction[]
  >([]);

  useEffect(() => {
    if (!id) return;

    const fetchTransactions = async () => {
      try {
        // 1. 리워드 메인 데이터 가져오기
        const response = await api.get(`/reward-main`, {
          params: { userId: id },
        });
        const data: RewardMainResponse = response.data;
        setRewardMainData(data);

        // FormattedTransaction 형태로 가공
        if (data.recentRewardTransactions) {
          const formattedTransactionData: FormattedTransaction[] =
            data.recentRewardTransactions.map((item) => {
              const isAccumulation = item.transactionType === "ACCUMULATION";
              const dateObj = new Date(item.transactionDate);
              const formattedDate = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, "0")}. ${String(dateObj.getDate()).padStart(2, "0")}`;

              return {
                id: item.id,
                title: item.eventTitle,
                status: "적립 완료",
                date: formattedDate,
                // 적립일 땐 locationName 우선, 환급일 땐 은행+계좌번호
                location: isAccumulation
                  ? item.locationName || "위치 정보 없음"
                  : `${item.bankName || ""} ${item.accountNumberMasked || ""}`.trim(),
                // amount가 양수면 +, 음수면 그대로(이미 -가 붙어있음) 출력
                amount: `${item.amount > 0 ? "+" : ""}${item.amount.toLocaleString()}원`,
                isPositive: item.amount > 0,
              };
            });
          setTransactionData(formattedTransactionData);
        }
      } catch (error) {
        console.error(
          "Failed to fetch transactions, loading fallback data:",
          error,
        );
      }
    };

    fetchTransactions();
  }, [id]);

  // 달성 목표에 맞춰 아이콘과 배경색을 찾아줌
  const getIcon = (type: string) => {
    if (type === "walking") {
      return {
        icon: <ShoeIcon fill="#EFF6FF" className="text-primary" />,
        bg: "bg-primary-extralight",
      };
    }
    if (type === "savings") {
      return {
        icon: <SaveIcon className="text-[#F2994A]" />,
        bg: "bg-[#FEF0E8]",
      };
    }
    // 기본값은 화분
    return { icon: <PotIcon />, bg: "bg-[#FEFCE8]" };
  };

  return (
    <div className="h-[calc(100dvh-84px)] flex flex-col bg-background overflow-hidden">
      <Header />

      <main className="flex flex-col flex-1 py-3 w-full min-h-0">
        {/* Top Total Reward Card */}
        <section className="bg-primary flex flex-col px-4 pt-5 pb-4 mx-5 mb-3 gap-3 rounded-xl text-common-white shadow-card shrink-0">
          <div className="flex flex-col">
            <div className="text-body2_m_14">총 적립 리워드</div>
            <div className="flex items-center justify-between">
              <div className="text-head1_sb_24">
                {(rewardMainData?.totalAccumulatedReward || 0).toLocaleString()}{" "}
                원
              </div>
              <ArrowRightIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="w-full flex gap-1.5 py-3 bg-common-white text-primary text-sub3_sb_16 rounded-lg items-center justify-center cursor-pointer">
              <MoneyIcon className="w-5 h-5 text-primary" />
              소모품 지원 신청하기
            </button>

            <div className="text-caption4_r_12 flex items-center justify-center text-common-white/90">
              최소 지원 금액 10,000원 <BulletIcon className="w-4 h-4" /> 지원
              수수료 무료
            </div>
          </div>
        </section>

        {/* Two small cards */}
        <section className="flex gap-2 mx-5 shrink-0">
          <div
            className="flex flex-col flex-1 bg-common-white rounded-lg p-3 gap-2 shadow-card"
            onClick={() => navigate("/reward/monthlyReward")}
          >
            <div className="flex flex-col gap-1">
              <div className="flex gap-1.5 items-center text-body2_m_14 text-[#202123]">
                <DateIcon className="w-4 h-4 text-primary" />
                이번 달
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sub1_sb_18 text-common-black">
                  {(rewardMainData?.thisMonthRewardTotal || 0).toLocaleString()}{" "}
                  원
                </div>
                <ArrowRightIcon className="w-5 h-5 text-[#6C727C]" />
              </div>
            </div>
            <div className="text-caption4_r_12 text-[#6B717B]">
              지난 달 대비{" "}
              {rewardMainData?.rewardIncreaseRateComparedToLastMonth &&
              rewardMainData.rewardIncreaseRateComparedToLastMonth > 0
                ? "+"
                : ""}
              {Math.round(
                rewardMainData?.rewardIncreaseRateComparedToLastMonth || 0,
              )}
              %
            </div>
          </div>

          <div
            className="flex flex-col flex-1 bg-common-white rounded-lg p-3 gap-2 shadow-card"
            onClick={() => navigate("/reward/totalCollection")}
          >
            <div className="flex flex-col gap-1">
              <div className="flex gap-1.5 items-center text-body2_m_14 text-[#202123]">
                <DateIcon className="w-4 h-4 text-primary" />
                누적 수거
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sub1_sb_18 text-common-black">
                  {rewardMainData?.yearlyMedicineCollectionCount} 회
                </div>
                <ArrowRightIcon className="w-5 h-5 text-[#6C727C]" />
              </div>
            </div>
            <div className="text-caption4_r_12 text-[#6B717B]">
              총{" "}
              {(rewardMainData?.totalAccumulatedReward || 0).toLocaleString()}원
              적립
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="flex flex-col flex-1 pt-5 gap-4 min-h-0">
          <nav className="flex mx-5 shrink-0">
            <button
              className={`py-3 w-22 h-11 text-center transition-colors cursor-pointer ${activeTab === "달성 목표" ? "text-common-black text-sub3_sb_16 shadow-[inset_0_-3px_0_0_currentColor]" : "text-[#686F7A] text-body1_m_16"}`}
              onClick={() => setActiveTab("달성 목표")}
            >
              달성 목표
            </button>
            <button
              className={`py-3 w-22 h-11 text-center transition-colors cursor-pointer ${activeTab === "적립 내역" ? "text-common-black text-sub3_sb_16 shadow-[inset_0_-3px_0_0_currentColor]" : "text-[#686F7A] text-body1_m_16"}`}
              onClick={() => setActiveTab("적립 내역")}
            >
              적립 내역
            </button>
          </nav>

          {/* Tab Content */}
          <section className="flex flex-col flex-1 px-5 pb-2 gap-2 overflow-y-auto no-scrollbar min-h-0">
            {activeTab === "달성 목표" &&
              rewardMainData?.achievements
                .sort((a, b) => Number(b.isAchieved) - Number(a.isAchieved))
                .map((goal) => {
                  const { icon, bg } = getIcon(goal.iconType);
                  return (
                    <div
                      key={goal.userAchievementId}
                      className="bg-common-white rounded-xl px-3 py-4 flex items-center justify-between shadow-card"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center ${bg}`}
                        >
                          {icon}
                        </div>
                        <div className="flex flex-col gap-1 justify-center">
                          <div className="flex items-center gap-1">
                            <div className="text-sub3_sb_16">
                              {goal.achievementName}
                            </div>
                            {goal.isAchieved && <Badge text="달성" />}
                          </div>
                          <div className="text-caption3_r_13 text-[#6C727C]">
                            {goal.achievementDescription}
                          </div>
                        </div>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-[#6C727C]" />
                    </div>
                  );
                })}

            {activeTab === "적립 내역" &&
              (transactionData.length > 0 ? (
                <div className="flex flex-col px-5 bg-common-white shadow-card rounded-xl">
                  {transactionData.map((data, index) => (
                    <div
                      key={index}
                      className="py-5 flex items-center justify-between shadow-[inset_0_-1px_0_0_#E8EBEF] last:shadow-none"
                    >
                      <div className="flex flex-col gap-1 justify-center">
                        <div className="flex items-center gap-1">
                          <div className="text-sub3_sb_16">{data.title}</div>
                          {data.status && <Badge text={data.status} />}
                        </div>
                        <div className="flex gap-0.5 items-center text-caption3_r_13 text-[#6C727C]">
                          {data.date} <BulletIcon className="w-4 h-4" />
                          {data.location}
                        </div>
                      </div>
                      <div
                        className={`text-sub4_sb_14 ${data.isPositive ? "text-primary" : "text-[#6C727C]"}`}
                      >
                        {data.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-50 text-sub3_sb_16">
                  적립 내역이 없습니다.
                </div>
              ))}
          </section>
        </section>
      </main>
    </div>
  );
};

export default Reward;
