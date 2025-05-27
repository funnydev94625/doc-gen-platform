// pages/verify-email.tsx or app/verify-email/page.tsx
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying...");
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);

    if (!token) {
      setMessage("Invalid verification link.");
      setShowResend(true);
      return;
    }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        setMessage(data.msg || "Verification failed.");
        if (data.msg && data.msg.toLowerCase().includes("invalid")) {
          setShowResend(true);
        }
      })
      .catch(() => {
        setMessage("Verification failed.");
        setShowResend(true);
      });
  }, []);

  const handleResend = async () => {
    setResendStatus("Sending...");
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setResendStatus(data.msg || "Failed to resend email.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p>{message}</p>
        {showResend && (
          <div className="mt-6">
            <input
              type="email"
              className="border px-3 py-2 rounded mb-2"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleResend}
              disabled={!email || resendStatus === "Sending..."}
            >
              Resend verification email
            </button>
            {resendStatus && <div className="mt-2 text-sm">{resendStatus}</div>}
          </div>
        )}
      </div>
    </div>
  );
}