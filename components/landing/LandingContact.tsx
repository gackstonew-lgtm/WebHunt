"use client";

import React, { useState } from "react";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function LandingContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate sending or POST to contact endpoint
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Failed to send your message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28 bg-surface/30 border-y border-subtle/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Questions? Let&apos;s Connect.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Whether you need assistance choosing a plan, requesting custom trade scraping, or exploring agency enterprise access, we are here to help.
          </p>
        </div>

        {/* Contact Container */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 rounded-3xl border border-subtle/70 bg-surface/70 p-6 sm:p-8 flex flex-col justify-between shadow-lg space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Direct Support Channel</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Our engineering and support team monitors messages continuously.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-surface-elevated/70 border border-subtle/50">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Email Support</div>
                    <a href="mailto:support@webhunt.delta" className="text-xs text-primary font-medium hover:underline">
                      support@webhunt.delta
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-surface-elevated/70 border border-subtle/50">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Response SLA</div>
                    <div className="text-xs text-muted-foreground">Typically within 12-24 business hours</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-surface-elevated/70 border border-subtle/50">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Headquarters &amp; Coverage</div>
                    <div className="text-xs text-muted-foreground">Nairobi, Kenya • Global Distributed Team</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/[0.05] border border-primary/20 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">Custom Bulk Extraction:</span> Running an agency looking for tailored nationwide lead dumps? Reach out for custom enterprise feeds.
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 rounded-3xl border border-subtle/70 bg-surface p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Message Received!</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you for reaching out. Our team has received your message and will respond to your email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/60 text-foreground font-bold text-xs hover:bg-surface transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Send Us a Message</h3>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@agency.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Agency Plan Inquiry or Feature Question"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your agency or what questions you have about WebHunt Delta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-subtle/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-brand-btn transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
