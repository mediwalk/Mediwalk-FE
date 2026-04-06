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

const goalsData = [
  {
    title: "초보 환경 지킴이",
    description: "폐의약품 10회 이상 수거 완료",
    icon: <PotIcon />,
    iconBg: "bg-[#FEFCE8]",
    status: "달성",
  },
  {
    title: "건강한 걷기 전문가",
    description: "한 달 100,000보 이상 달성",
    icon: <ShoeIcon fill="#EFF6FF" className="text-primary" />,
    iconBg: "bg-primary-extralight",
    status: "달성",
  },
  {
    title: "절약의 달인",
    description: "누적 50,000원 이상 적립",
    icon: <SaveIcon className="text-[#F2994A]" />,
    iconBg: "bg-[#FEF0E8]",
    status: "달성",
  },
  {
    title: "건강한 걷기 전문가",
    description: "한 달 100,000보 이상 달성",
    icon: <ShoeIcon fill="#EFF6FF" className="text-primary" />,
    iconBg: "bg-primary-extralight",
    status: "",
  },
  {
    title: "절약의 달인",
    description: "누적 50,000원 이상 적립",
    icon: <SaveIcon className="text-[#F2994A]" />,
    iconBg: "bg-[#FEF0E8]",
    status: "",
  },
];

// API 응답용 타입
interface RewardTransaction {
  id: number;
  userId: number;
  eventId?: number;
  amount: number;
  transactionType: "ACCUMULATION" | "REFUND";
  transactionDate: string;
  description: string;
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
  const [activeTab, setActiveTab] = useState("달성 목표");

  const [transactionData, setTransactionData] = useState<
    FormattedTransaction[]
  >([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = 1; // 임시
        const response = await api.get(`/reward-transactions?userId=${userId}`);

        const rawData: RewardTransaction[] = response.data;

        // FormattedTransaction 형태로 가공
        const formattedTransactionData: FormattedTransaction[] = rawData.map(
          (data) => {
            const isAccumulation = data.transactionType === "ACCUMULATION";
            const dateObj = new Date(data.transactionDate || Date.now());
            const formattedDate = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, "0")}. ${String(dateObj.getDate()).padStart(2, "0")}`;

            return {
              id: data.id,
              title: isAccumulation ? "폐의약품 수거" : "리워드 환급",
              status: isAccumulation ? "적립 완료" : "",
              date: formattedDate,
              location: isAccumulation
                ? data.description || "위치 정보 없음"
                : `${data.bankName || ""} ${data.accountNumberMasked || ""}`.trim(),
              amount: `${isAccumulation ? "+" : ""} ${data.amount.toLocaleString()}원`,
              isPositive: isAccumulation,
            };
          },
        );

        setTransactionData(formattedTransactionData);
      } catch (error) {
        console.error(
          "Failed to fetch transactions, loading fallback data:",
          error,
        );
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex flex-col px-5 py-3 gap-3 w-full">
        {/* Top Total Reward Card */}
        <section className="bg-primary flex flex-col px-4 pt-5 pb-4 gap-3 rounded-xl text-common-white shadow-card">
          <div className="flex flex-col">
            <div className="text-body2_m_14">총 적립 리워드</div>
            <div className="flex items-center justify-between">
              <div className="text-head1_sb_24">50,850 원</div>
              <ArrowRightIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="w-full flex gap-1.5 py-3.5 bg-common-white text-primary text-sub3_sb_16 rounded-lg items-center justify-center cursor-pointer">
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
        <section className="flex gap-2">
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
                  15,400 원
                </div>
                <ArrowRightIcon className="w-5 h-5 text-[#6C727C]" />
              </div>
            </div>
            <div className="text-caption4_r_12 text-[#6B717B]">
              지난 달 대비 +24%
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
                <div className="text-sub1_sb_18 text-common-black">18 회</div>
                <ArrowRightIcon className="w-5 h-5 text-[#6C727C]" />
              </div>
            </div>
            <div className="text-caption4_r_12 text-[#6B717B]">
              총 50,850원 적립
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="flex flex-col pt-5 pb-10 gap-4">
          <nav className="flex">
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
          <section className="flex flex-col gap-2">
            {activeTab === "달성 목표" &&
              goalsData.map((goal, index) => (
                <div
                  key={index}
                  className="bg-common-white rounded-xl px-3 py-4 flex items-center justify-between shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${goal.iconBg}`}
                    >
                      {goal.icon}
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                      <div className="flex items-center gap-1">
                        <div className="text-sub3_sb_16">{goal.title}</div>
                        {goal.status && <Badge text={goal.status} />}
                      </div>
                      <div className="text-caption3_r_13 text-[#6C727C]">
                        {goal.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-[#6C727C]" />
                </div>
              ))}

            {activeTab === "적립 내역" &&
              (transactionData.length > 0 ? (
                <div className="flex flex-col px-5 bg-common-white card-shadow rounded-xl">
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
