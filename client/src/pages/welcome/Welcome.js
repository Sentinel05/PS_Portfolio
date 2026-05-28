import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaUserShield } from "react-icons/fa";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("cards"); // "cards" | "guest-name"
  const [guestName, setGuestName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    const trimmed = guestName.trim();
    if (!trimmed) { setError("Please enter your name to continue."); return; }
    setError("");
    setSubmitting(true);
    try {
      await fetch("/api/v1/ps-portfolio/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
    } catch (_) {
      // Non-blocking — still let visitor through
    }
    sessionStorage.setItem("guestName", trimmed);
    navigate("/portfolio");
  };

  return (
    <div className="wlc">
      {/* Background glows */}
      <div className="wlc__glow wlc__glow--1" />
      <div className="wlc__glow wlc__glow--2" />

      <motion.div
        className="wlc__container"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="wlc__header">
          <motion.p className="wlc__greeting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Welcome to
          </motion.p>
          <motion.h1 className="wlc__name" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            Priyanshu Sarkar
          </motion.h1>
          <motion.p className="wlc__tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            Software Engineer · Full-Stack Developer
          </motion.p>
          <div className="wlc__divider" />
          <motion.p className="wlc__prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            {step === "cards" ? "How would you like to continue?" : "Just one step before you explore"}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {step === "cards" && (
            <motion.div
              key="cards"
              className="wlc__cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ delay: 0.65, duration: 0.45 }}
            >
              {/* Guest */}
              <motion.button
                className="wlc__card wlc__card--guest"
                onClick={() => setStep("guest-name")}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <div className="wlc__card-glow wlc__card-glow--guest" />
                <FaUser className="wlc__card-icon" />
                <h2 className="wlc__card-title">Guest</h2>
                <p className="wlc__card-desc">
                  Browse the full portfolio — education, work experience, projects, and more.
                </p>
                <div className="wlc__card-footer">
                  <span className="wlc__badge wlc__badge--guest">No login required</span>
                  <span className="wlc__arrow">Enter →</span>
                </div>
              </motion.button>

              {/* Admin */}
              <motion.button
                className="wlc__card wlc__card--admin"
                onClick={() => navigate("/admin/login")}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <div className="wlc__card-glow wlc__card-glow--admin" />
                <FaUserShield className="wlc__card-icon" />
                <h2 className="wlc__card-title">Admin</h2>
                <p className="wlc__card-desc">
                  Add, edit, and delete portfolio content — education, work, skills, and projects.
                </p>
                <div className="wlc__card-footer">
                  <span className="wlc__badge wlc__badge--admin">Login required</span>
                  <span className="wlc__arrow">Login →</span>
                </div>
              </motion.button>
            </motion.div>
          )}

          {step === "guest-name" && (
            <motion.div
              key="guest-name"
              className="wlc__name-panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <FaUser className="wlc__name-icon" />
              <h2 className="wlc__name-heading">What's your name?</h2>
              <p className="wlc__name-sub">This helps personalise your experience and lets the site owner know who's visiting.</p>
              <form className="wlc__name-form" onSubmit={handleGuestSubmit} noValidate>
                <input
                  className={`wlc__name-input${error ? " wlc__name-input--error" : ""}`}
                  type="text"
                  placeholder="Enter your name"
                  value={guestName}
                  onChange={(e) => { setGuestName(e.target.value); if (error) setError(""); }}
                  autoFocus
                  maxLength={80}
                />
                {error && <p className="wlc__name-error">{error}</p>}
                <div className="wlc__name-actions">
                  <button
                    type="button"
                    className="wlc__name-btn wlc__name-btn--back"
                    onClick={() => { setStep("cards"); setError(""); setGuestName(""); }}
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <button
                    type="submit"
                    className="wlc__name-btn wlc__name-btn--go"
                    disabled={submitting}
                  >
                    {submitting ? "Loading…" : <>Explore Portfolio <FiArrowRight /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Welcome;
