import React, { useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import "../styles/components/Support.css";

const Support = () => {
  const [activeSection, setActiveSection] = useState("contact");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactForm({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
        priority: "medium",
      });
    }, 2000);
  };

  const faqItems = [
    {
      id: 1,
      question: "How do I set up 2FA on my account?",
      answer:
        "To set up 2FA, go to your Profile > Security > Two-Factor Authentication and toggle it on. You'll need an authenticator app like Google Authenticator or Authy to scan the QR code.",
    },
    {
      id: 2,
      question: "What should I do if I lose my authenticator device?",
      answer:
        "If you lose your authenticator device, you can use your Emergency Login Package (.elp file) to regain access. Alternatively, contact our support team with your account verification details.",
    },
    {
      id: 3,
      question: "How do I generate an Emergency Login Package?",
      answer:
        "Go to Profile > Security > Emergency Access and click 'Generate Emergency Login Package'. Store the downloaded .elp file in a secure location for emergency access.",
    },
    {
      id: 4,
      question: "Why am I getting 'Invalid TOTP code' errors?",
      answer:
        "This usually happens when your device's time is not synchronized. Ensure your device time is correct, or try generating a new code after a few seconds.",
    },
    {
      id: 5,
      question: "How secure is my data?",
      answer:
        "We use 256-bit AES encryption for all sensitive data, employ zero-knowledge architecture, and regularly undergo security audits. Your TOTP secrets are encrypted and never stored in plain text.",
    },
    {
      id: 6,
      question: "Can I export my TOTP codes to another app?",
      answer:
        "Yes, you can export your data from Profile > Preferences > Account Actions > Export Data. This will provide you with an encrypted backup of your TOTP codes.",
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>Support Center</h1>
        <p>Get help with your SecureTOTP account and 2FA setup</p>
      </div>

      <div className="support-tabs">
        <button
          className={`tab-button ${
            activeSection === "contact" ? "active" : ""
          }`}
          onClick={() => setActiveSection("contact")}
        >
          <i className="fas fa-envelope"></i>
          Contact Us
        </button>
        <button
          className={`tab-button ${activeSection === "faq" ? "active" : ""}`}
          onClick={() => setActiveSection("faq")}
        >
          <i className="fas fa-question-circle"></i>
          FAQ
        </button>
       
      </div>

      <div className="support-content">
        {activeSection === "contact" && (
          <div className="contact-section">
            {submitSuccess ? (
              <div className="success-card">
                <i className="fas fa-check-circle success-icon"></i>
                <h2>Message Sent Successfully!</h2>
                <p>
                  Thank you for contacting us. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="new-message-button"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="contact-options">
                  <div className="contact-card">
                    <i className="fas fa-clock"></i>
                    <h3>Response Time</h3>
                    <p>We typically respond within 24 hours</p>
                  </div>
                  <div className="contact-card">
                    <i className="fas fa-shield-alt"></i>
                    <h3>Security Priority</h3>
                    <p>Security issues are handled immediately</p>
                  </div>
                  <div className="contact-card">
                    <i className="fas fa-globe"></i>
                    <h3>24/7 Support</h3>
                    <p>Emergency support available anytime</p>
                  </div>
                </div>

                <div className="contact-form-card">
                  <h2>Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                          className="form-input"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                          className="form-input"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                          id="category"
                          value={contactForm.category}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="form-input"
                        >
                          <option value="general">General Question</option>
                          <option value="technical">Technical Issue</option>
                          <option value="security">Security Concern</option>
                          <option value="account">Account Problem</option>
                          <option value="feature">Feature Request</option>
                          <option value="billing">Billing Question</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                          id="priority"
                          value={contactForm.priority}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              priority: e.target.value,
                            }))
                          }
                          className="form-input"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        required
                        className="form-input"
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        required
                        className="form-textarea"
                        rows="6"
                        placeholder="Please provide detailed information about your issue or question"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-button"
                    >
                      {isSubmitting ? (
                        <>
                          <Skeleton width="16px" height="16px" />
                          <Skeleton variant="text" width="120px" />
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}

        {activeSection === "faq" && (
          <div className="faq-section">
            <div className="faq-header">
              <h2>Frequently Asked Questions</h2>
              <p>Find answers to common questions about SecureTOTP</p>
            </div>

            <div className="faq-list">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className={`faq-item ${
                    expandedFaq === item.id ? "expanded" : ""
                  }`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(item.id)}
                  >
                    <span>{item.question}</span>
                    <i
                      className={`fas fa-chevron-${
                        expandedFaq === item.id ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-footer">
              <p>Can't find what you're looking for?</p>
              <button
                onClick={() => setActiveSection("contact")}
                className="contact-us-button"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="support-footer">
        <Link to="/dashboard" className="back-link">
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Support;
