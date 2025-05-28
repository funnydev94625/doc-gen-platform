// pages/verify-email.tsx or app/verify-email/page.tsx
'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying...")
  const [showResend, setShowResend] = useState(false)
  const [resendStatus, setResendStatus] = useState("")
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const emailParam = params.get("email")
    if (emailParam) setEmail(emailParam)

    if (!token) {
      setMessage("Invalid verification link.")
      setShowResend(true)
      return;
    }
    api.get(`/api/auth/verify-email?token=${token}`)
      .then(res => {
        const data = res.data
        setMessage(data.msg || "Verification failed.")
        if (data.msg && data.msg.toLowerCase().includes("success")) {
          setSuccess(true)
        }
        if (data.msg && data.msg.toLowerCase().includes("invalid")) {
          setShowResend(true)
        }
      })
      .catch(() => {
        setMessage("Verification failed.")
        setShowResend(true)
      });
  }, []);

  const handleResend = async () => {
    setResendStatus("Sending...");
    try {
      const res = await api.post("/api/auth/resend-verification", { email });
      setResendStatus(res.data.msg || "Failed to resend email.");
    } catch {
      setResendStatus("Failed to resend email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow text-center w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/october-security-logo.png"
            alt="October Security"
            width={160}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p>{message}</p>
        {success && (
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              Go to Sign In
            </Link>
          </div>
        )}
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
  )
}