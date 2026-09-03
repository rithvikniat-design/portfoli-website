"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
          Get in Touch
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">
          Contact
        </h1>
        <p className="text-charcoal-400 max-w-xl">
          For inquiries about projects, collaborations, or representation.
        </p>
        <div className="gold-divider mt-8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 max-w-5xl">
        {/* Form */}
        <div>
          {submitted ? (
            <div className="bg-charcoal-900/50 border border-gold-400/30 rounded-xl p-10 text-center">
              <CheckCircle
                size={48}
                className="text-gold-400 mx-auto mb-4"
              />
              <h3 className="font-display text-2xl text-white mb-2">
                Message Sent
              </h3>
              <p className="text-charcoal-400">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-gold-400 text-sm hover:text-gold-300 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="admin-label">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="admin-input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="admin-label">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="admin-input"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="admin-label">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="admin-input"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="admin-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="admin-input resize-none"
                  placeholder="Your message..."
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gold-400 text-charcoal-950 font-medium rounded-lg hover:bg-gold-300 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6">
            <h3 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              Representation
            </h3>
            <p className="text-sm text-charcoal-300 leading-relaxed">
              For business inquiries, please reach out via the contact form or
              email directly.
            </p>
          </div>

          <div className="bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6">
            <h3 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              Social
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
              >
                IMDb ↗
              </a>
              <a
                href="#"
                className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
              >
                Letterboxd ↗
              </a>
              <a
                href="#"
                className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
              >
                Instagram ↗
              </a>
              <a
                href="#"
                className="block text-sm text-charcoal-300 hover:text-gold-400 transition-colors"
              >
                X / Twitter ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
