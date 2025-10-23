"use client";

import { useState } from "react";
import { Header } from "../../components";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
  
    try {
      const res = await fetch("contact-us/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
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
  
  

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in <span className="text-[#FF0B55]">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have a question, suggestion, or want to collaborate? <br /> We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#FF0B55] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                      <p className="text-gray-400">tanmaypatwary@gmail.com</p>
                      <p className="text-sm text-gray-500 mt-1">We'll get back to you within 48 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#FF0B55] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">GitHub</h3>
                      <p className="text-gray-400">github.com/TanCodeX</p>
                      <p className="text-sm text-gray-500 mt-1">Check out our open source projects</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#FF0B55] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Response Time</h3>
                      <p className="text-gray-400">Usually within 48 hours</p>
                      <p className="text-sm text-gray-500 mt-1">We're committed to quick responses</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/TanCodeX" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF0B55] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://x.com/TanCodeX" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF0B55] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/tanmaypatwary" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF0B55] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white font-semibold px-6 py-3 text-sm rounded-full border-2 border-transparent transition-all duration-100 ease-out inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>

                {submitStatus === "success" && (
                  <div className="text-center text-green-400 text-sm">
                    ✓ Your email client should open with the message ready to send!
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="text-center text-red-400 text-sm">
                    ✗ Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Information - Wider Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-white rounded-sm mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">OpenSc0ut</h3>
              </div>
              <div className="text-gray-400 text-sm mb-6">
                <p>Find your next project, make your first commit,</p>
                <p>and grow as a developer — all in one place.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white">tanmaypatwary@gmail.com</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">GitHub</p>
                  <p className="text-white">github.com/TanCodeX</p>
                </div>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Quick links</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/contact-us" className="hover:text-white transition-colors">Contact us</a></li>
              </ul>
            </div>
            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-6">Social</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="https://github.com/TanCodeX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://x.com/TanCodeX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://www.linkedin.com/in/tanmaypatwary" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of service</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy policy</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie policy</a></li>
                <li><a href="/license" className="hover:text-white transition-colors">MIT License</a></li>
              </ul>
            </div>
          </div>
        </div> {/* <-- This </div> now closes the max-w-7xl container */}

        {/* Bottom Border is now outside the container, so it's full-width */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          {/* Re-add the container here to keep the text centered */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm">
              © 2024 OpenSc0ut. Built with Next.js and GitHub API.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}