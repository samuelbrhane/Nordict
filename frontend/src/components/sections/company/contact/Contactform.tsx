"use client";

import { useState, useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TOPICS = [
  { id: "general", label: "General inquiry" },
  { id: "sales", label: "Pricing & plans" },
  { id: "support", label: "Technical support" },
  { id: "feedback", label: "Feedback & suggestions" },
  { id: "partnership", label: "Partnership opportunity" },
  { id: "other", label: "Other" },
];

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get auth token if user is logged in
      const tokens = localStorage.getItem("tokens");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (tokens) {
        const { access } = JSON.parse(tokens);
        if (access) {
          headers["Authorization"] = `Bearer ${access}`;
        }
      }

      const response = await fetch(`${API_URL}/api/v1/contact/submit/`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || data.error || "Failed to send message");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pb-20 dark:bg-black"
    >
      <div className="relative z-10 mx-auto max-w-2xl px-6">
        {!isSubmitted ? (
          <div
            className={`rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-8 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error message */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Name & Email row */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-900 dark:text-white mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-900 dark:text-white mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-neutral-900 dark:text-white mb-2"
                >
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 transition-all focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {TOPICS.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-neutral-900 dark:text-white mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  minLength={10}
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl py-3 text-sm font-medium text-black transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
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
                  "Send message"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success state */
          <div
            className={`rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-12 text-center transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <svg
                className="h-8 w-8 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
              Message sent!
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Thanks for reaching out. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: "", email: "", topic: "", message: "" });
              }}
              className="mt-6 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand)" }}
            >
              Send another message
            </button>
          </div>
        )}

        {/* Alternative contact */}
        <div
          className={`mt-8 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Or reach out directly
          </p>
          <div className="flex justify-center gap-4">
            {/* Email */}
            <a
              href="mailto:hello@nordict.com"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"
            >
              <svg
                className="h-4 w-4"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              hello@nordict.com
            </a>
          </div>
        </div>

        {/* FAQ link */}
        <div
          className={`mt-8 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Looking for quick answers?{" "}
            <a
              href="/pricing#faq"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand)" }}
            >
              Check the FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
