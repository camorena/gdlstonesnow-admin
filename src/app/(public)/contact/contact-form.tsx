"use client";

import { useRef, useState, useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void;
      send: (
        serviceId: string,
        templateId: string,
        params: Record<string, string>
      ) => Promise<void>;
    };
  }
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    name?: string;
  } | null>(null);
  const [emailjsReady, setEmailjsReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  function validate(): boolean {
    const form = formRef.current;
    if (!form) return false;

    const newErrors: Record<string, boolean> = {};
    let valid = true;

    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "zipcode",
      "message",
    ];
    requiredFields.forEach((fieldName) => {
      const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${fieldName}"]`
      );
      if (el && !el.value.trim()) {
        newErrors[fieldName] = true;
        valid = false;
      }
    });

    const emailField = form.querySelector<HTMLInputElement>('[name="email"]');
    if (emailField && emailField.value.trim()) {
      if (!/^[\w.-]+@[\w-]+\.[\w-]{2,}$/.test(emailField.value.trim())) {
        newErrors["email"] = true;
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const form = formRef.current;
    if (!form) return;

    setSending(true);

    const params: Record<string, string> = {};
    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        "input, textarea"
      )
      .forEach((el) => {
        if (el.name) params[el.name] = el.value.trim();
      });

    if (!emailjsReady || !window.emailjs) {
      setResult({ type: "error" });
      setSending(false);
      return;
    }

    window.emailjs
      .send("service_r6kvm1r", "template_ygg00i5", params)
      .then(
        () => {
          setResult({ type: "success", name: params.name });
          setSending(false);
          setErrors({});
        },
        () => {
          setResult({ type: "error" });
          setSending(false);
        }
      );
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.emailjs.init("loA9ug2uKJpadrcQA");
          setEmailjsReady(true);
        }}
      />

      <div className="rounded-2xl bg-white dark:bg-[#1e1e1e] p-8 shadow-xl dark:shadow-black/20 lg:p-10">
        {/* Title with green underline */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">
            Tell Us About Your Project
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-[#8BB63A]" />
        </div>

        {/* Success State with animated checkmark */}
        {result?.type === "success" && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-6">
              <svg
                className="h-20 w-20"
                viewBox="0 0 80 80"
                fill="none"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#8BB63A"
                  strokeWidth="3"
                  className="animate-[draw-circle_0.6s_ease-out_forwards]"
                  style={{
                    strokeDasharray: 226,
                    strokeDashoffset: 226,
                    animation: "draw-circle 0.6s ease-out forwards",
                  }}
                />
                <path
                  d="M24 40l10 10 22-22"
                  stroke="#8BB63A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 50,
                    animation: "draw-check 0.4s ease-out 0.5s forwards",
                  }}
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">
              Thank You, {result.name}!
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
              We received your message and a member of our team will get back to
              you within one business day with your free estimate.
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Need a faster response? Call us directly at{" "}
              <a
                href="tel:9528826182"
                className="font-semibold text-[#8BB63A] hover:underline"
              >
                (952) 882-6182
              </a>
            </p>

            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes draw-circle {
                    to { stroke-dashoffset: 0; }
                  }
                  @keyframes draw-check {
                    to { stroke-dashoffset: 0; }
                  }
                `,
              }}
            />
          </div>
        )}

        {/* Error State */}
        {result?.type === "error" && (
          <div className="rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
                  We Couldn&apos;t Send Your Message
                </h3>
                <p className="mt-2 leading-relaxed text-red-700 dark:text-red-400">
                  Don&apos;t worry — you can try again below, or reach us directly
                  at{" "}
                  <a
                    href="tel:9528826182"
                    className="font-bold text-[#8BB63A] hover:underline"
                  >
                    (952) 882-6182
                  </a>
                </p>
                <button
                  onClick={() => setResult(null)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-100 dark:bg-red-900/40 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 transition-colors hover:bg-red-200 dark:hover:bg-red-900/60"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {result?.type !== "success" && result?.type !== "error" && (
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name */}
              <div className="relative">
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder=" "
                  required
                  className={`peer w-full rounded-lg border px-4 pb-3 pt-6 text-[#1a1a1a] dark:text-white transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.name
                      ? "border-red-400 bg-red-50 focus:ring-red-400"
                      : "border-gray-300 bg-white focus:ring-[#8BB63A]"
                  }`}
                  onChange={() =>
                    errors.name && setErrors((e) => ({ ...e, name: false }))
                  }
                />
                <label
                  htmlFor="contact-name"
                  className={`pointer-events-none absolute left-4 top-5 origin-left text-gray-400 dark:text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-[0.85] peer-focus:text-[#8BB63A] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.85] ${
                    errors.name ? "text-red-400" : ""
                  }`}
                >
                  Name <span className="text-red-400">*</span>
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder=" "
                  required
                  className={`peer w-full rounded-lg border px-4 pb-3 pt-6 text-[#1a1a1a] dark:text-white transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.email
                      ? "border-red-400 bg-red-50 focus:ring-red-400"
                      : "border-gray-300 bg-white focus:ring-[#8BB63A]"
                  }`}
                  onChange={() =>
                    errors.email && setErrors((e) => ({ ...e, email: false }))
                  }
                />
                <label
                  htmlFor="contact-email"
                  className={`pointer-events-none absolute left-4 top-5 origin-left text-gray-400 dark:text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-[0.85] peer-focus:text-[#8BB63A] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.85] ${
                    errors.email ? "text-red-400" : ""
                  }`}
                >
                  Email <span className="text-red-400">*</span>
                </label>
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder=" "
                  required
                  className={`peer w-full rounded-lg border px-4 pb-3 pt-6 text-[#1a1a1a] dark:text-white transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.phone
                      ? "border-red-400 bg-red-50 focus:ring-red-400"
                      : "border-gray-300 bg-white focus:ring-[#8BB63A]"
                  }`}
                  onChange={() =>
                    errors.phone && setErrors((e) => ({ ...e, phone: false }))
                  }
                />
                <label
                  htmlFor="contact-phone"
                  className={`pointer-events-none absolute left-4 top-5 origin-left text-gray-400 dark:text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-[0.85] peer-focus:text-[#8BB63A] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.85] ${
                    errors.phone ? "text-red-400" : ""
                  }`}
                >
                  Phone <span className="text-red-400">*</span>
                </label>
              </div>

              {/* Address */}
              <div className="relative">
                <input
                  id="contact-address"
                  name="address"
                  type="text"
                  placeholder=" "
                  required
                  className={`peer w-full rounded-lg border px-4 pb-3 pt-6 text-[#1a1a1a] dark:text-white transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.address
                      ? "border-red-400 bg-red-50 focus:ring-red-400"
                      : "border-gray-300 bg-white focus:ring-[#8BB63A]"
                  }`}
                  onChange={() =>
                    errors.address &&
                    setErrors((e) => ({ ...e, address: false }))
                  }
                />
                <label
                  htmlFor="contact-address"
                  className={`pointer-events-none absolute left-4 top-5 origin-left text-gray-400 dark:text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-[0.85] peer-focus:text-[#8BB63A] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.85] ${
                    errors.address ? "text-red-400" : ""
                  }`}
                >
                  Address <span className="text-red-400">*</span>
                </label>
              </div>

              {/* City */}
              <div className="relative">
                <input
                  id="contact-city"
                  name="city"
                  type="text"
                  placeholder=" "
                  required
                  className={`peer w-full rounded-lg border px-4 pb-3 pt-6 text-[#1a1a1a] dark:text-white transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.city
                      ? "border-red-400 bg-red-50 focus:ring-red-400"
                      : "border-gray-300 bg-white focus:ring-[#8BB63A]"
                  }`}
                  onChange={() =>
                    errors.city && setErrors((e) => ({ ...e, city: false }))
                  }
                />
                <label
                  htmlFor="contact-city"
                  className={`pointer-events-none absolute left-4 top-5 origin-left text-gray-400 dark:text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-[0.85] peer-focus:text-[#8BB63A] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.85] ${
                    errors.city ? "text-red-400" : ""
                  }`}
                >
                  City <span className="text-red-400">*</span>
                </label>
              </div>

              {/* Zip Code */}
              <div className="relative">
                <input
                  id="contact-zipcode"
                  name="zipcode"
                  type="text"
                  placeholder=" "
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                  className={`peer w-full rounded-lg border px-4 pb-3 pt-6 text-[#1a1a1a] dark:text-white transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.zipcode
                      ? "border-red-400 bg-red-50 focus:ring-red-400"
                      : "border-gray-300 bg-white focus:ring-[#8BB63A]"
                  }`}
                  onChange={() =>
                    errors.zipcode &&
                    setErrors((e) => ({ ...e, zipcode: false }))
                  }
                />
                <label
                  htmlFor="contact-zipcode"
                  className={`pointer-events-none absolute left-4 top-5 origin-left text-gray-400 dark:text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-[0.85] peer-focus:text-[#8BB63A] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.85] ${
                    errors.zipcode ? "text-red-400" : ""
                  }`}
                >
                  Zip Code <span className="text-red-400">*</span>
                </label>
              </div>
            </div>

            {/* Message */}
            <div className="relative mt-6">
              <textarea
                id="contact-message"
                name="message"
                placeholder=" "
                required
                rows={5}
                className={`peer w-full rounded-lg border px-4 pb-3 pt-6 text-[#1a1a1a] dark:text-white transition-all focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                  errors.message
                    ? "border-red-400 bg-red-50 dark:bg-red-900/20 focus:ring-red-400"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-[#8BB63A]"
                }`}
                onChange={() =>
                  errors.message &&
                  setErrors((e) => ({ ...e, message: false }))
                }
              />
              <label
                htmlFor="contact-message"
                className={`pointer-events-none absolute left-4 top-5 origin-left text-gray-400 dark:text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-[0.85] peer-focus:text-[#8BB63A] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.85] ${
                  errors.message ? "text-red-400" : ""
                }`}
              >
                Message <span className="text-red-400">*</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-[#8BB63A] px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-[#8BB63A]/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-[#8BB63A]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send My Request
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
