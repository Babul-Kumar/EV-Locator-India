import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Station Correction / Suggestion',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate contact submission with instant feedback
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      
      {/* Header Banner */}
      <section className="border-b border-brand-border bg-gradient-to-b from-background-secondary to-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
            We Are Here To Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            Contact & Community Support
          </h1>
          <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or noticed a charging station that needs updated information? Reach out to our operations desk.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-soft-sm space-y-5">
              <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
                Operations Desk
              </h3>

              <div className="space-y-4 text-xs text-brand-muted">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-brand-green flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-text">Hub Locations</h4>
                    <p className="leading-relaxed mt-0.5">Connaught Place, New Delhi & Indiranagar, Bengaluru, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-brand-green flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-text">Email Helpdesk</h4>
                    <p className="leading-relaxed mt-0.5">support@evlocatorindia.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-brand-green flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-text">Helpline</h4>
                    <p className="leading-relaxed mt-0.5">+91 1800-EV-INDIA (9 AM - 8 PM IST)</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Are you an EV charging network operator? Administrators can log in through the secure admin portal to manage official listings.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-soft-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-brand-green">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-brand-text">Message Received</h3>
                  <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
                    Thank you for contributing to India\'s EV charging accuracy. Our verification team will review your message promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'Station Correction / Suggestion', message: '' });
                    }}
                    className="px-4 py-2 rounded-xl bg-silver-light hover:bg-silver text-brand-dark text-xs font-semibold border border-silver transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider mb-2">
                    Send Us a Message
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-text">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-text bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-text">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-text bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-text">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-text bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    >
                      <option value="Station Correction / Suggestion">Station Correction / Suggestion</option>
                      <option value="Report Inactive Station">Report Inactive Station</option>
                      <option value="Charging Speed Discrepancy">Charging Speed Discrepancy</option>
                      <option value="Operator Partnership Inquiry">Operator Partnership Inquiry</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-text">Message & Station Details</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Provide station location, city, connector type or any updates..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-text bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold transition-colors shadow-soft-sm"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
