"use client";

import { useState } from "react";
import { PageGridBackground } from "../../components";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none resize-none";

  const getInputClass = (field: string) =>
    `${inputBase} ${
      focusedField === field
        ? "border-[#FF0B55]/60 ring-2 ring-[#FF0B55]/20 shadow-lg shadow-[#FF0B55]/10"
        : "border-white/10 hover:border-white/20"
    }`;

  const channels = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: "tanmaypatwary@gmail.com",
      sub: "Reply within 48 hours",
      href: "mailto:tanmaypatwary@gmail.com",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#FF0B55]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      label: "GitHub",
      value: "github.com/TanCodeX",
      sub: "Issues & PRs welcome",
      href: "https://github.com/TanCodeX",
    },

  ];

  const socials = [
    {
      href: "https://github.com/TanCodeX",
      label: "GitHub",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },

    {
      href: "https://www.linkedin.com/in/tanmaypatwary",
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white transition-colors duration-300 overflow-x-hidden">
      <main>

        {/* ─── HERO ─── */}
        <div className="relative min-h-[75vh] flex items-center overflow-hidden">
          <PageGridBackground />

          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-[#FF0B55]/10 blur-[120px] animate-pulse" />
          </div>

          {/* Floating orbs */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF0B55]/20 to-transparent border border-[#FF0B55]/20 blur-sm hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 16, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-24 left-16 w-20 h-20 rounded-full bg-gradient-to-br from-[#FF0B55]/15 to-transparent border border-[#FF0B55]/15 blur-sm hidden lg:block"
          />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-[#FF0B55]/30 backdrop-blur-sm mb-8 shadow-lg shadow-[#FF0B55]/10"
              >
                <span className="w-2 h-2 bg-[#FF0B55] rounded-full animate-ping" />
                <span className="w-2 h-2 bg-[#FF0B55] rounded-full absolute" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Contact Us</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 font-extrabold tracking-tight">
                <span className="text-white">Get in </span>
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0B55] via-[#ff4d7d] to-[#FF0B55] bg-[length:200%] animate-[gradientShift_3s_ease_infinite]">
                    Touch
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF0B55] to-transparent" />
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
                Questions, ideas, or collaboration — we read every message and reply when we can.
              </p>

              {/* Scroll cue */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-12 flex flex-col items-center gap-2 text-gray-500"
              >
                <span className="text-xs tracking-widest uppercase">Scroll to reach us</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-4 relative z-20">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#FF0B55] to-[#FF0B55]/30 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Reach the team</h2>
            </div>
            <p className="text-gray-400 max-w-2xl pl-4">
              Use the form or the channels below — same open tone as the rest of OpenSc0ut.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* ── LEFT: Contact info ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl pointer-events-none" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 h-full">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#FF0B55]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Contact info</h2>
                </div>

                {/* Channel list */}
                <div className="space-y-5 mb-10">
                  {channels.map((ch, i) => (
                    <motion.a
                      key={i}
                      href={ch.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-4 group/ch"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#FF0B55]/10 border border-[#FF0B55]/20 flex items-center justify-center flex-shrink-0 group-hover/ch:bg-[#FF0B55]/20 group-hover/ch:border-[#FF0B55]/40 transition-all duration-300">
                        {ch.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-0.5">{ch.label}</p>
                        <p className="text-white font-medium group-hover/ch:text-[#FF0B55] transition-colors duration-300">{ch.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{ch.sub}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-[#FF0B55]/30 via-white/10 to-transparent mb-8" />

                {/* Social links */}
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">Follow</p>
                  <div className="flex gap-3">
                    {socials.map((s) => (
                      <motion.a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.15, y: -2 }}
                        aria-label={s.label}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#FF0B55]/50 hover:text-[#FF0B55] hover:bg-[#FF0B55]/10 transition-all duration-300"
                      >
                        {s.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Decorative bottom accent */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF0B55]/30 to-transparent" />
              </div>
            </motion.div>

            {/* ── RIGHT: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3 relative group"
            >
              {/* Glow */}
              <div className="absolute -inset-2 bg-gradient-to-br from-[#FF0B55]/15 via-transparent to-[#FF0B55]/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#FF0B55]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Send a message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                        Name <span className="text-[#FF0B55]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={getInputClass("name")}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                        Email <span className="text-[#FF0B55]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={getInputClass("email")}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>



                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                      Message <span className="text-[#FF0B55]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={6}
                      className={getInputClass("message")}
                      placeholder="Tell us what you are thinking..."
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF0B55] to-[#d4004a] text-white font-bold px-6 py-3.5 hover:from-[#FF0B55]/90 hover:to-[#d4004a]/90 transition-all duration-300 shadow-lg shadow-[#FF0B55]/25 hover:shadow-[#FF0B55]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send message
                      </>
                    )}
                  </motion.button>

                  {/* Status messages */}
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-emerald-400 text-sm">Message sent! We&apos;ll be in touch soon.</p>
                    </motion.div>
                  )}
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>

          {/* ─── FAQ / Quick answers ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-widest text-[#FF0B55] uppercase mb-3 block">Quick answers</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Common questions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  q: "How fast do you reply?",
                  a: "We aim for 48 hours on emails. GitHub issues and PRs get reviewed weekly.",
                  icon: "⏱",
                },
                {
                  q: "Can I contribute to OpenSc0ut?",
                  a: "Absolutely. Open an issue or a PR on GitHub — all contributions are welcome.",
                  icon: "🤝",
                },
                {
                  q: "I found a bug. What now?",
                  a: "Open a GitHub issue with a reproduction. The clearer the report, the faster the fix.",
                  icon: "🐛",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF0B55]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-white/5 border border-white/10 group-hover:border-[#FF0B55]/30 rounded-2xl p-6 transition-all duration-300">
                    <div className="text-2xl mb-3">{faq.icon}</div>
                    <h4 className="font-bold text-white mb-2">{faq.q}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
