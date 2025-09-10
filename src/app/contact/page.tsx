// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText("leomazive01@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // tooltip disappears after 2s
  };

  return (
    <div
      className=" relative overflow-hidden bg-cover bg-center text-gray-900"
      style={{ backgroundImage: "url('/contact.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <Navbar />

      {/* Floating shapes / decorative blobs */}
      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-green-400/30 rounded-full filter blur-3xl animate-blob z-0"></div>
      <div className="absolute bottom-[-60px] right-[-40px] w-72 h-72 bg-blue-400/30 rounded-full filter blur-3xl animate-blob animation-delay-2000 z-0"></div>

      {/* Contact Section */}
      <section className="relative z-10 flex flex-col items-center justify-center py-24 px-6 sm:px-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center text-white">
          Get in Touch
        </h1>
        <p className="text-lg md:text-xl text-center mb-12 max-w-2xl text-gray-200">
          Have a question, suggestion, or just want to say hello? Fill out the
          form below and we&apos;ll get back to you soon!
        </p>

        {!submitted ? (
          <form
            action="https://formspree.io/f/xgvlrrdy"
            method="POST"
            onSubmit={() => setSubmitted(true)}
            className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 flex flex-col gap-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="p-4 rounded border border-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="p-4 rounded border border-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="p-4 rounded border border-gray-300 focus:ring-2 focus:ring-green-400 h-32 resize-none"
            />
            <button
              type="submit"
              className="py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
            <p>
              Your message has been sent successfully. We&apos;ll get back to you
              soon.
            </p>
          </div>
        )}

        {/* Social Icons */}
        <div className="flex gap-6 mt-12 text-white text-2xl relative">
          <div className="relative">
            <FaEnvelope
              onClick={handleEmailClick}
              className="cursor-pointer hover:text-green-400 transition"
            />
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                Email copied!
              </span>
            )}
          </div>

          <a
            href="https://www.linkedin.com/in/leo-mazive-b470a535b"
            target="_blank"
            className="hover:text-blue-500 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/Leo-Mazive-123/folktale-app.git"
            target="_blank"
            className="hover:text-gray-400 transition"
          >
            <FaGithub />
          </a>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      <Footer />
    </div>
  );
}
