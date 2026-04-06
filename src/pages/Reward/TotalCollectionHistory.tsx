import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../assets/icons/arrow1_left.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";

const TotalCollectionHistory = () => {
  const navigate = useNavigate();
  return (
    <div className="h-dvh flex flex-col">
      <header className="px-5 pt-6 pb-3 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/reward")} />
      </header>
      <main className="flex flex-col flex-1 min-h-0 gap-6 pt-6 pb-15">
        <section className="flex flex-col px-5 gap-1 shrink-0">
          <div className="flex gap-1 text-head1_sb_24">
            누적 수거<span className="text-primary">18회</span>
          </div>
          <div className="text-body4_r_14 text-cool-neutral-40">
            이번 년도 누적 폐의약품 수거 횟수를 알려드려요
          </div>
        </section>
        <section className="flex flex-col flex-1 gap-2 min-h-0">
          <div className="flex flex-col gap-2 px-5 pb-2 overflow-hidden overflow-y-auto no-scrollbar">
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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
                  <div className="text-primary text-sub4_sb_14">+ 0원</div>
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

export default TotalCollectionHistory;
