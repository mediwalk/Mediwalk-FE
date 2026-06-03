import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CloseIcon from "../../assets/icons/delete_line.svg?react";
import api from "../../api/axios";
import ErrorModal from "../../components/ErrorModal";

// 2가지 모드: 폐의약품(사진), 투함(동영상)
type CameraMode = "MEDICINE" | "DROP_BIN";

const CameraVerify = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 동영상 녹화용 Ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [mode, setMode] = useState<CameraMode>("MEDICINE");
  const [isProcessing, setIsProcessing] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  // 에러 모달 상태 관리
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 에러 모달 닫기 핸들러
  const closeErrorModal = () => setIsErrorModalOpen(false);

  // 카메라 켜기
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false, // 마이크 비활성화
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("카메라 권한 실패", err);
        alert("카메라 권한을 허용해주세요.");
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // [사진 모드] 폐의약품 인증 (단일 캡처)
  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !state?.routeData) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // base64 문자열 추출
    const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];

    try {
      const verifyRes = await api.post("/medicine-verifications", {
        base64Image: base64Image,
      });
      processVerificationResult(verifyRes.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  // [동영상 모드] 투함 인증 (녹화 토글)
  const handleToggleRecord = () => {
    if (!videoRef.current?.srcObject) return;

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      chunksRef.current = [];
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);

        const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
        const formData = new FormData();
        formData.append("video", videoBlob, "record.webm");

        try {
          const verifyRes = await api.post(
            "/medicine-verifications/drop",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
          processVerificationResult(verifyRes.data);
        } catch (error) {
          handleApiError(error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  // 결과 처리 후 이벤트(보상) 생성 및 리다이렉트
  const processVerificationResult = async (data: any) => {
    const { status } = data;

    if (status === "VERIFIED") {
      try {
        const routeData = state.routeData;

        // 미션일 때는 1000, 일반일 때는 state.baseRewardAmount
        const reward = state.isMission ? 1000 : state.baseRewardAmount || 800;

        const eventPayload = {
          userId: routeData.userId || 1,
          eventType: state.isMission
            ? "EXERCISE_MISSION_COMPLETE"
            : "MEDICINE_COLLECTION",
          title: state.isMission ? "운동 미션 완료" : "폐의약품 수거",
          rewardAmount: reward,
          eventDateTime: new Date().toISOString(),
          locationName: routeData.destinationName || "수거함",
          collectionLocationId: routeData.destinationId,
          imageUrl: "string",
          routeId: routeData.id,
          userDailyMissionId: state.isMission
            ? state.id || routeData.userDailyMissionId
            : null,
          currentLatitude: state.myLocation?.lat,
          currentLongitude: state.myLocation?.lng,
        };

        const eventRes = await api.post("/events", eventPayload);

        // 완료 페이지로 이동
        navigate("/complete", {
          replace: true,
          state: { eventData: eventRes.data },
        });
      } catch (error) {
        console.error("이벤트 생성 실패:", error);
        setErrorTitle("리워드 적립 오류");
        setErrorMessage("리워드 적립 중 오류가 발생했습니다.");
        setIsErrorModalOpen(true);
        setIsProcessing(false);
      }
    } else {
      // 검증 실패 시 백엔드에서 전달한 message 띄움
      setErrorTitle("인증 실패");
      setErrorMessage(`폐의약품 인증에 실패했습니다.\n다시 촬영해주세요.`);
      setIsErrorModalOpen(true);
      setIsProcessing(false);
    }
  };

  const handleApiError = (error: any) => {
    console.error("인증 통신 오류:", error);
    setErrorTitle("서버 오류");
    setErrorMessage(
      "서버와 통신 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.",
    );
    setIsErrorModalOpen(true);
    setIsProcessing(false);
  };

  return (
    <>
      <div className="relative h-dvh w-full bg-black overflow-hidden flex flex-col">
        {/* 닫기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 z-50"
        >
          <CloseIcon className="w-6 h-6 text-white drop-shadow-md" />
        </button>

        {/* 뷰파인더 영역 */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* 하단 컨트롤 영역 */}
        <div className="absolute bottom-0 pb-10 w-full flex flex-col items-center z-10">
          {/* 셔터 버튼 */}
          <button
            onClick={
              mode === "MEDICINE" ? handleCapturePhoto : handleToggleRecord
            }
            disabled={isProcessing}
            className={`mb-4 flex items-center justify-center w-19 h-19 rounded-full border-2 border-white transition-all ${
              isProcessing ? "opacity-50 cursor-not-allowed" : "active:scale-95"
            }`}
          >
            {/* 모드에 따른 셔터 아이콘 변화 */}
            <div
              className={`transition-all duration-300 ${
                mode === "MEDICINE"
                  ? "w-16 h-16 bg-white rounded-full" // 사진: 꽉 찬 하얀 원
                  : isRecording
                    ? "w-8 h-8 bg-red-500 rounded-md" // 영상 녹화 중
                    : "w-16 h-16 bg-red-500 rounded-full" // 영상 대기
              }`}
            />
          </button>

          {isProcessing && (
            <p className="text-white mb-4 text-caption1_m_13 animate-pulse">
              AI가 판독 중입니다...
            </p>
          )}

          {/* 클릭 시 텍스트가 가운데로 슬라이드 되는 메뉴 영역 */}
          {!isRecording && (
            <div className="relative w-full flex justify-center items-center overflow-hidden">
              <motion.div
                className="flex items-center gap-3"
                animate={{ x: mode === "MEDICINE" ? 45 : -62 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <button
                  onClick={() => !isProcessing && setMode("MEDICINE")}
                  className={`transition-all duration-300 whitespace-nowrap text-body1_m_16 ${
                    mode === "MEDICINE"
                      ? "bg-white text-black px-3.5 py-1.5 rounded-full"
                      : "text-white px-3.5 py-1.5"
                  }`}
                >
                  폐의약품 인증
                </button>
                <button
                  onClick={() => !isProcessing && setMode("DROP_BIN")}
                  className={`transition-all duration-300 whitespace-nowrap text-body1_m_16 ${
                    mode === "DROP_BIN"
                      ? "bg-white text-black px-3.5 py-1.5 rounded-full"
                      : "text-white px-3.5 py-1.5"
                  }`}
                >
                  투함 인증
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {isErrorModalOpen && (
        <ErrorModal
          title={errorTitle}
          detail={errorMessage}
          onClose={closeErrorModal}
        />
      )}
    </>
  );
};

export default CameraVerify;
