// src/app/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SitePageHero } from "../../components";
import {
  signIn,
  signUp,
  sendEmailOtp,
  checkEmailVerificationOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  useSession,
} from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  // Email OTP states
  const [email, setEmail] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isEmailOtpLoading, setIsEmailOtpLoading] = useState(false);

  // Phone states
  const [phone, setPhone] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isPhoneOtpLoading, setIsPhoneOtpLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [step, setStep] = useState<
    | "method"
    | "email-otp"
    | "phone-otp"
    | "details"
    | "verify-email"
    | "verify-phone"
  >("method");

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const { error: authError } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "Google sign up failed. Try again.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign up failed. Try again.";
      setError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    setIsGithubLoading(true);
    setError(null);
    try {
      const { error: authError } = await signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "GitHub sign up failed. Try again.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "GitHub sign up failed. Try again.";
      setError(message);
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setIsEmailOtpLoading(true);
    setError(null);
    try {
      const { error: otpError } = await sendEmailOtp({
        email,
        type: "email-verification",
      });
      if (otpError) {
        setError(otpError.message || "Failed to send OTP. Try again.");
      } else {
        setEmailOtpSent(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP. Try again.";
      setError(message);
    } finally {
      setIsEmailOtpLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setIsEmailOtpLoading(true);
    setError(null);
    try {
      const { error: verifyError } = await checkEmailVerificationOtp({
        email,
        code: emailOtp,
      });
      if (verifyError) {
        setError(verifyError.message || "Invalid OTP. Please try again.");
      } else {
        setStep("phone-otp");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(message);
    } finally {
      setIsEmailOtpLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleSendPhoneOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setIsPhoneOtpLoading(true);
    setError(null);
    try {
      const { error: otpError } = await sendPhoneOtp({
        phoneNumber: `+1${cleanPhone}`,
      });
      if (otpError) {
        setError(otpError.message || "Failed to send phone OTP. Try again.");
      } else {
        setPhoneOtpSent(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send phone OTP. Try again.";
      setError(message);
    } finally {
      setIsPhoneOtpLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setIsPhoneOtpLoading(true);
    setError(null);
    try {
      const cleanPhone = phone.replace(/\D/g, "");
      // Verify phone OTP
      const { error: verifyError } = await verifyPhoneOtp({
        phoneNumber: `+1${cleanPhone}`,
        code: phoneOtp,
        disableSession: true,
        updatePhoneNumber: false,
      });
      if (verifyError) {
        setError(verifyError.message || "Invalid OTP. Please try again.");
      } else {
        setStep("details");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(message);
    } finally {
      setIsPhoneOtpLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSigningUp(true);
    setError(null);
    try {
      const { error: signUpError } = await signUp.email({
        email,
        password,
        name,
      });

      if (signUpError) {
        setError(signUpError.message || "Sign up failed. Try again.");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed. Try again.";
      setError(message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <main>
      <SitePageHero
        badge="Create Account"
        title={
          <>
            Join <span className="text-[#FF0B55]">OpenSc0ut</span>
          </>
        }
        description="Create your account using GitHub, Google, or Email with phone verification."
        minHeightClass="min-h-[48vh]"
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-4">
            {/* Step: Method Selection */}
            {step === "method" && (
              <>
                {/* GitHub Sign Up */}
                <button
                  type="button"
                  onClick={handleGitHubSignUp}
                  disabled={isGithubLoading}
                  className={`w-full rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                    isGithubLoading
                      ? "bg-[#FF0B55]/80 text-white cursor-not-allowed opacity-90"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {isGithubLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Redirecting to GitHub...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.11.82-.26.82-.575v-2.16c-3.338.725-4.042-1.41-4.042-1.41-.545-1.385-1.332-1.75-1.332-1.75-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.235 1.84 1.235 1.07 1.835 2.805 1.305 3.495.995.105-.775.415-1.305.755-1.605-2.665-.3-5.465-1.33-5.465-5.93 0-1.31.465-2.38 1.235-3.22-.125-.305-.535-1.525.115-3.175 0 0 1.005-.32 3.3 1.23.955-.265 1.98-.4 3-.405 1.02.005 2.045.14 3 .405 2.29-1.55 3.295-1.23 3.295-1.23.655 1.65.245 2.87.12 3.175.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.425.37.81 1.1.81 2.22v3.29c0 .32.22.69.825.575C20.565 21.79 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Sign up with GitHub
                    </>
                  )}
                </button>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  className={`w-full rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                    isGoogleLoading
                      ? "bg-[#FF0B55]/80 text-white cursor-not-allowed opacity-90"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {isGoogleLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Redirecting to Google...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-500">Or sign up with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("email-otp")}
                  className="w-full rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email & Phone Verification
                </button>

                {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
              </>
            )}

            {/* Step: Email OTP */}
            {step === "email-otp" && (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Verify Your Email</h3>
                  <p className="text-sm text-gray-400">We'll send a 6-digit code to your email</p>
                </div>

                {!emailOtpSent ? (
                  <>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={isEmailOtpLoading || !email}
                      className="w-full rounded-full px-6 py-3 text-sm font-semibold bg-[#FF0B55] text-black hover:bg-[#FF0B55]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEmailOtpLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Sending OTP...
                        </span>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center text-sm text-gray-400">
                      OTP sent to <span className="text-white">{email}</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent text-center tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={isEmailOtpLoading || emailOtp.length !== 6}
                      className="w-full rounded-full px-6 py-3 text-sm font-semibold bg-[#FF0B55] text-black hover:bg-[#FF0B55]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEmailOtpLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Verifying...
                        </span>
                      ) : (
                        "Verify Email"
                      )}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep("method");
                    setEmail("");
                    setEmailOtp("");
                    setEmailOtpSent(false);
                    setError(null);
                  }}
                  className="w-full rounded-full px-6 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>

                {error && <p className="text-center text-sm text-red-400">{error}</p>}
              </>
            )}

            {/* Step: Phone OTP */}
            {step === "phone-otp" && (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Verify Your Phone</h3>
                  <p className="text-sm text-gray-400">We'll send a 6-digit code to your phone</p>
                </div>

                {!phoneOtpSent ? (
                  <>
                    <input
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={formatPhone(phone)}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        if (formatted.replace(/\D/g, "").length <= 10) {
                          setPhone(formatted);
                        }
                      }}
                      maxLength={14}
                      className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={isPhoneOtpLoading || phone.replace(/\D/g, "").length !== 10}
                      className="w-full rounded-full px-6 py-3 text-sm font-semibold bg-[#FF0B55] text-black hover:bg-[#FF0B55]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPhoneOtpLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Sending OTP...
                        </span>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center text-sm text-gray-400">
                      OTP sent to <span className="text-white">{phone}</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent text-center tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPhoneOtp}
                      disabled={isPhoneOtpLoading || phoneOtp.length !== 6}
                      className="w-full rounded-full px-6 py-3 text-sm font-semibold bg-[#FF0B55] text-black hover:bg-[#FF0B55]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPhoneOtpLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Verifying...
                        </span>
                      ) : (
                        "Verify Phone"
                      )}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep("email-otp");
                    setPhone("");
                    setPhoneOtp("");
                    setPhoneOtpSent(false);
                    setError(null);
                  }}
                  className="w-full rounded-full px-6 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>

                {error && <p className="text-center text-sm text-red-400">{error}</p>}
              </>
            )}

            {/* Step: Account Details */}
            {step === "details" && (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Create Your Account</h3>
                  <p className="text-sm text-gray-400">Set up your name and password</p>
                </div>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={handleSignUp}
                  disabled={isSigningUp}
                  className="w-full rounded-full px-6 py-3 text-sm font-semibold bg-[#FF0B55] text-black hover:bg-[#FF0B55]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningUp ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone-otp");
                    setName("");
                    setPassword("");
                    setConfirmPassword("");
                    setError(null);
                  }}
                  className="w-full rounded-full px-6 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>

                {error && <p className="text-center text-sm text-red-400">{error}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
