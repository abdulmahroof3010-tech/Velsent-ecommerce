import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

function VerifyOtp() {
  const { verifyOtp, resendOtp, } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  if (!email) return null;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [resend, setResend] = useState(false);
  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  useEffect(() => {
    if(timeLeft <=0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  
  }, [timeLeft]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    setError("");

    const result = await verifyOtp(email, finalOtp);

    if (result.success) {
      toast.success("Register successful");

      navigate("/");
    } else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(email);
      toast.success("New OTP sent");

      setTimeLeft(30);
      setResend(false);
      setOtp(["","","",""]);
        setError("");
      inputsRef.current[0]?.focus();
      
    }catch(e){
      toast.error("Failed to send otp")
    
    }
  }

return (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="max-w-sm w-full bg-black rounded-xl shadow-sm border border-neutral-800 overflow-hidden">

      {/* Header */}
      <div className="bg-black p-6 text-center border-b border-neutral-800">
        <h3 className="text-xl font-semibold text-white">VERIFY OTP</h3>
        <p className="text-neutral-400 text-sm mt-1">
          Enter the code sent to your email
        </p>
      </div>

      {/* Body */}
      <div className="p-6 text-center">

        {/* OTP Inputs */}
        <div className="flex justify-between mb-5">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg bg-neutral-900 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-white"
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs mb-3">{error}</p>
        )}

        {/* Timer + Verify */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-400">
            {timeLeft > 0 ? (
              `Expires in ${formatTime()}`
            ) : (
              <span className="text-red-400">Expired</span>
            )}
          </p>

          <button
            onClick={handleSubmit}
            className="bg-white hover:bg-neutral-300 text-black px-4 py-2 rounded-md font-medium transition"
          >
            Verify
          </button>
        </div>

        {/* Resend */}
        <button
          onClick={handleResend}
          disabled={!resend}
          className={`text-sm font-medium transition ${
            resend
              ? "text-white hover:text-neutral-300"
              : "text-neutral-600 cursor-not-allowed"
          }`}
        >
          Resend OTP
        </button>

      </div>
    </div>
  </div>
);
}

export default VerifyOtp;
