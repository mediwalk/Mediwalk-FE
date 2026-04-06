import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../assets/icons/arrow1_left.svg?react";
import FilterIcon from "../../assets/icons/filter_line.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import { useState } from "react";

const MonthlyRewardHistory = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<"최신순" | "과거순">(
    "최신순",
  );

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const handleFilter = (selectedFilter: "최신순" | "과거순") => {
    setActiveFilter(selectedFilter);
    setIsFilterOpen(!isFilterOpen);
  };
  return (
    <div className="h-dvh flex flex-col">
      <header className="pt-6 pb-3 px-5 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/reward")} />
      </header>
      <main className="flex flex-col flex-1 min-h-0 gap-5 pt-6 pb-15">
        <section className="flex flex-col px-5 gap-1 shrink-0">
          <div className="flex gap-1 text-head1_sb_24">
            이번 달<span className="text-primary">15,400원</span>모았어요
          </div>
          <div className="text-body4_r_14 text-cool-neutral-40">
            지난 달 대비 +24%
          </div>
        </section>
        <section className="flex flex-col flex-1 gap-2 min-h-0">
          <div className="flex relative justify-between items-center px-5 shrink-0">
            <div className="flex gap-0.5 text-sub2_m_18">
              총<span className="text-primary text-sub1_sb_18">2</span>회
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
            <article className="flex gap-2.5 p-4 rounded-xl bg-[#EDF3FF] border-[1.5px] border-primary">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MonthlyRewardHistory;
