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

    const requiredFields = ["name", "email", "phone", "address", "city", "zipcode", "message"];
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

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:ring-red-400"
        : "border-gray-300 bg-white focus:ring-[#8BB63A]"
    } focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-[#1a1a1a] placeholder-gray-400`;

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

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
          Send Us a Message
        </h2>

        {/* Success Banner */}
        {result?.type === "success" && (
          <div className="mb-6 rounded-xl bg-green-50 border-2 border-[#8BB63A] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#8BB63A] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">
                  We&apos;ve Received Your Request
                </h3>
                <p className="text-green-700 mt-2 leading-relaxed">
                  Thank you, <strong>{result.name}</strong>. Our team is
                  reviewing your inquiry and will reach out to you within one
                  business day to discuss your project.
                </p>
                <p className="text-green-700 mt-2 text-sm">
                  For immediate assistance, call us at{" "}
                  <a
                    href="tel:9528826182"
                    className="font-bold text-[#8BB63A] hover:underline"
                  >
                    (952) 882-6182
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {result?.type === "error" && (
          <div className="mb-6 rounded-xl bg-red-50 border-2 border-red-400 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
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
                <h3 className="text-lg font-bold text-red-800">
                  Unable to Submit Your Request
                </h3>
                <p className="text-red-700 mt-2 leading-relaxed">
                  We apologize for the inconvenience. Please try again in a
                  moment or reach us directly at{" "}
                  <a
                    href="tel:9528826182"
                    className="font-bold text-[#8BB63A] hover:underline"
                  >
                    (952) 882-6182
                  </a>{" "}
                  or{" "}
                  <a
                    href="mailto:camoren000@gmail.com"
                    className="font-bold text-[#8BB63A] hover:underline"
                  >
                    camoren000@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {result?.type !== "success" && (
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                  className={inputClass("name")}
                  onChange={() =>
                    errors.name && setErrors((e) => ({ ...e, name: false }))
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className={inputClass("email")}
                  onChange={() =>
                    errors.email && setErrors((e) => ({ ...e, email: false }))
                  }
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  required
                  className={inputClass("phone")}
                  onChange={() =>
                    errors.phone && setErrors((e) => ({ ...e, phone: false }))
                  }
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="contact-address"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-address"
                  name="address"
                  type="text"
                  placeholder="Street address"
                  required
                  className={inputClass("address")}
                  onChange={() =>
                    errors.address &&
                    setErrors((e) => ({ ...e, address: false }))
                  }
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="contact-city"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-city"
                  name="city"
                  type="text"
                  placeholder="City"
                  required
                  className={inputClass("city")}
                  onChange={() =>
                    errors.city && setErrors((e) => ({ ...e, city: false }))
                  }
                />
              </div>

              {/* Zip Code */}
              <div>
                <label
                  htmlFor="contact-zipcode"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Zip Code <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-zipcode"
                  name="zipcode"
                  type="text"
                  placeholder="55420"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                  className={inputClass("zipcode")}
                  onChange={() =>
                    errors.zipcode &&
                    setErrors((e) => ({ ...e, zipcode: false }))
                  }
                />
              </div>
            </div>

            {/* Message */}
            <div className="mt-5">
              <label
                htmlFor="contact-message"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="How can we help you? Tell us about your project..."
                required
                rows={6}
                className={inputClass("message")}
                onChange={() =>
                  errors.message &&
                  setErrors((e) => ({ ...e, message: false }))
                }
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="mt-6 w-full py-4 px-6 rounded-lg bg-[#8BB63A] hover:bg-[#7aa832] text-white font-bold text-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              {sending ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
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
                "Send Message"
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
