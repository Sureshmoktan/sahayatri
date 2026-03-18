import React, { useState, useRef } from "react";

const OtpModal = ({ email, onVerify, onClose, onResend }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);
  const timerRef = useRef(null);

  // Start countdown on mount
  React.useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setCanResend(false);
    setResendTimer(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(new Array(6).fill(""));
    inputsRef.current[0]?.focus();
    startTimer();

    if(onResend) await onResend();
    // call your resend OTP service here if needed
  };

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
        const prevOtp = [...otp];
        prevOtp[index - 1] = "";
        setOtp(prevOtp);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;
    onVerify(otpCode);
  };

  const filled = otp.join("").length;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-blue-200/60 border border-blue-100 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />

        <div className="p-8">

          {/* Icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Verify Your Email</h2>
            <p className="text-slate-400 text-sm mt-2 text-center leading-relaxed">
              We sent a 6-digit code to
            </p>
            <p className="text-blue-600 font-bold text-sm mt-0.5 text-center break-all">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">

            {/* OTP inputs */}
            <div className="flex justify-center gap-2.5">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={data}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-11 h-13 py-3 text-center text-xl font-black rounded-xl border-2 outline-none transition-all duration-200
                    ${data
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                      : "border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    }`}
                />
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5">
              {otp.map((d, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${d ? "w-5 bg-blue-500" : "w-1.5 bg-slate-200"}`}
                />
              ))}
            </div>

            {/* Verify button */}
            <button
              type="submit"
              disabled={filled !== 6}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200
                ${filled === 6
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              {filled === 6 ? "Verify OTP →" : `Enter ${6 - filled} more digit${6 - filled > 1 ? "s" : ""}`}
            </button>

            {/* Resend */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-slate-400 text-sm">Didn't receive the code?</p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue-600 font-bold text-sm hover:underline transition-colors"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-slate-400 text-sm">
                  Resend in{" "}
                  <span className="text-blue-600 font-bold tabular-nums">{resendTimer}s</span>
                </p>
              )}
            </div>

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl border-2 border-slate-200 hover:border-blue-300 text-slate-500 hover:text-blue-600 font-semibold text-sm transition-all duration-200"
            >
              Cancel
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;