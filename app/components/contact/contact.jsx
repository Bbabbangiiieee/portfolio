"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "@/app/styles/contact.module.css";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState({ state: "idle", msg: "" });
    const [captchaToken, setCaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            setStatus({ state: "error", msg: "Please complete the captcha first." });
            return;
        }

        setStatus({ state: "sending", msg: "Sending..." });

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, captchaToken }),
            });

            const data = await res.json();
            if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to send.");

            setStatus({
                state: "success",
                msg: "Thank you for sending a message! I'll get back to you soon.",
            });
            setForm({ name: "", email: "", subject: "", message: "" });

            // reset captcha after success
            setCaptchaToken(null);
            recaptchaRef.current?.reset?.();
        } catch (err) {
            setStatus({
                state: "error",
                msg: err?.message || "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <section className={styles.contactSection} id="contact">
            <h2>Get in Touch</h2>
            <p className={styles.subtitle}>
                Have a project in mind or want to collaborate? Feel free to reach out.
            </p>

            <div className={styles.contactGrid}>
                {/* LEFT */}
                <div className={styles.contactInfo}>
                    <h4>Contact Details</h4>

                    <ul className={styles.infoList}>
                        {/* Email */}
                        <li>
                            <svg
                                className={styles.icon}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M22 6 12 13 2 6" />
                            </svg>

                            <div>
                                <span>Email</span>
                                <a href="mailto:cmgerzon@gmail.com">cmgerzon@gmail.com</a>
                            </div>
                        </li>

                        {/* LinkedIn */}
                        <li>
                            <svg
                                className={styles.icon}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.99h3.96V24H.5zM8.5 8.99h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V24h-3.96v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V24H8.5z" />
                            </svg>

                            <div>
                                <span>LinkedIn</span>
                                <a
                                    href="https://linkedin.com/in/christina-mae-gerzon-87458b232"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Christina Mae Gerzon
                                </a>
                            </div>
                        </li>

                        {/* WhatsApp */}
                        <li>
                            <svg
                                className={styles.icon}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.52 3.48A11.82 11.82 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.03L0 24l6.2-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 21.9c-1.89 0-3.74-.5-5.37-1.45l-.38-.22-3.68.97.98-3.58-.24-.37A9.88 9.88 0 012.1 12c0-5.46 4.44-9.9 9.9-9.9s9.9 4.44 9.9 9.9-4.44 9.9-9.9 9.9zm5.46-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.57-.49-.49-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.48.71.3 1.26.48 1.69.61.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
                            </svg>

                            <div>
                                <span>WhatsApp</span>
                                <p
                                    href="https://wa.me/639970776044"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    +63 997 077 6044
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>


                {/* RIGHT */}
                <form className={styles.contactForm} onSubmit={onSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="name">Name</label>
                        <input id="name" name="name" value={form.name} onChange={onChange} required />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="subject">Subject</label>
                        <input
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={form.message}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className={styles.captchaRow}>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={(token) => setCaptchaToken(token)}
                            onExpired={() => setCaptchaToken(null)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={status.state === "sending"}
                    >
                        {status.state === "sending" ? "Sending..." : "Send Message"}
                    </button>

                    {status.state !== "idle" && (
                        <p
                            className={`${styles.formStatus} ${status.state === "success" ? styles.success : styles.error
                                }`}
                        >
                            {status.msg}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}
