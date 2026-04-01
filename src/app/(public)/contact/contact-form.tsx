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

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    let isValid = true;
    const inputs = form.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("input[required], textarea[required]");

    inputs.forEach((field) => {
      field.style.backgroundColor = "";
      if (!field.value.trim()) {
        field.style.backgroundColor = "#FFDEDE";
        isValid = false;
      }
    });

    const emailField = form.querySelector<HTMLInputElement>(
      'input[type="email"]'
    );
    if (
      emailField &&
      !/^[\w.-]+@[\w-]+\.[\w-]{2,}$/.test(emailField.value.trim())
    ) {
      emailField.style.backgroundColor = "#FFDEDE";
      isValid = false;
    }

    if (!isValid) return;

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
        },
        () => {
          setResult({ type: "error" });
          setSending(false);
        }
      );
  }

  const successBg = "#e8f5e9";
  const successBorder = "#8BB63A";
  const successTitleColor = "#2e7d32";
  const errorBg = "#fbe9e7";
  const errorBorder = "#d32f2f";
  const errorTitleColor = "#c62828";

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
      {result?.type !== "success" && (
        <form
          className="contact-form"
          id="contact-form"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="row flex-box">
            <fieldset className="column column-1-2">
              <label htmlFor="contact-name">NAME</label>
              <input
                className="text-input"
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your full name"
                required
              />
              <label htmlFor="contact-email">EMAIL</label>
              <input
                className="text-input"
                id="contact-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
              <label htmlFor="contact-phone">PHONE NUMBER</label>
              <input
                className="text-input"
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                required
              />
              <label htmlFor="contact-address">ADDRESS</label>
              <input
                className="text-input"
                id="contact-address"
                name="address"
                type="text"
                placeholder="Street address"
                required
              />
              <label htmlFor="contact-city">CITY</label>
              <input
                className="text-input"
                id="contact-city"
                name="city"
                type="text"
                placeholder="City"
                required
              />
              <label htmlFor="contact-zipcode">ZIP CODE</label>
              <input
                className="text-input"
                id="contact-zipcode"
                name="zipcode"
                type="text"
                placeholder="55420"
                pattern="[0-9]{5}"
                maxLength={5}
                required
              />
            </fieldset>
            <fieldset className="column column-1-2">
              <label htmlFor="contact-message">MESSAGE</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="How can we help you?"
                required
              ></textarea>
            </fieldset>
          </div>
          <div className="row margin-top-30 margin-bottom-30">
            <div className="column column-1-1">
              <div className="row contact-form-submit margin-top-15 padding-bottom-16 align-center">
                <button
                  type="submit"
                  id="submit_btn"
                  className="more"
                  disabled={sending}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "'Raleway','Arial',sans-serif",
                  }}
                >
                  {sending ? "Sending..." : "Send message"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      {result && (
        <div
          id="contact_results"
          style={{
            textAlign: "center",
            padding: "30px 20px",
            marginTop: "20px",
            borderRadius: "6px",
            backgroundColor:
              result.type === "success" ? successBg : errorBg,
            border: `2px solid ${result.type === "success" ? successBorder : errorBorder}`,
          }}
        >
          <div className="inner">
            <div
              id="result-icon"
              style={{ fontSize: "48px", marginBottom: "15px" }}
              dangerouslySetInnerHTML={{
                __html: result.type === "success" ? "&#10004;" : "&#10006;",
              }}
            />
            <h4
              id="result-title"
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                color:
                  result.type === "success"
                    ? successTitleColor
                    : errorTitleColor,
              }}
            >
              {result.type === "success"
                ? "We've Received Your Request"
                : "Unable to Submit Your Request"}
            </h4>
            <p
              id="result-message"
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.5,
                color: "#555",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  result.type === "success"
                    ? `Thank you, <strong>${result.name}</strong>. Our team is reviewing your inquiry and will reach out to you within one business day to discuss your project.<br><br>For immediate assistance, call us at <a href='tel:9528826182' style='color:#8BB63A;font-weight:bold;'>(952) 882-6182</a>.`
                    : `We apologize for the inconvenience. Please try again in a moment or reach us directly at <a href='tel:9528826182' style='color:#8BB63A;font-weight:bold;'>(952) 882-6182</a> or <a href='mailto:camoren000@gmail.com' style='color:#8BB63A;font-weight:bold;'>camoren000@gmail.com</a>.`,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
