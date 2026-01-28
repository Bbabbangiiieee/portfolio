"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/styles/home.module.css";
import { startBadgeAnimations, startDotAnimations, startDividerAnimation, startToolsIconsAnimation, startTimelineAnimation } from "@/app/animations/animations";
import { gsap } from "gsap";
import aboutData from "@/app/data/aboutBoxes.json";
import toolData from "@/app/data/toolsLogo.json";
import timelineData from "@/app/data/timelineData.json";
import Projects from "@/app/components/projects/projects";
import Contact from "@/app/components/contact/contact";

export default function Home() {
  const containerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const items = Array.isArray(aboutData) ? aboutData : aboutData.items;
  const tools = Array.isArray(toolData) ? toolData : toolData.tools;
  const timelineItems = Array.isArray(timelineData) ? timelineData : timelineData.items;
  const icons = aboutData.icons || toolData.icons || {};

  useEffect(() => {
  const checkScreen = () => {
    setIsDesktop(window.innerWidth >= 1200);
  };

  checkScreen(); // initial check
  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);

  const SvgIcon = ({ name, icons }) => {
    const shapes = icons?.[name];
    if (!shapes) return null;

    return shapes.map((s, i) =>
      React.createElement(s.tag, {
        key: i,
        ...(s.attrs || {}),
      })
    );
  };


  const renderIcon = (
    item,
    {
      icons,
      size = 48,
      color = "inherit",
      strokeWidth = 2,
      filled = false,
      viewBox = "0 0 24 24",
      classname = "aboutIcon"
    } = {}
  ) => {
    if (!item?.icon) return null;

    const iconSpec = item.icon;

    const finalSize = iconSpec.size ?? size;
    const finalColor = iconSpec.color ?? color;
    const finalStroke = iconSpec.strokeWidth ?? strokeWidth;
    const isFilled = iconSpec.filled ?? filled;
    const finalViewBox = iconSpec.viewBox ?? viewBox;
    const finalClassname = iconSpec.classname ? styles.toolsIcon : styles.aboutIcon;

    if (iconSpec.type === "svg") {
      return (
        <div
          className={finalClassname}
          aria-hidden
          style={{
            ["--icon-size"]: `${finalSize}px`,
            ["--icon-color"]: finalColor,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={finalSize}
            height={finalSize}
            viewBox={finalViewBox}
            fill={isFilled ? "currentColor" : "none"}
            stroke={isFilled ? "none" : "currentColor"}
            strokeWidth={isFilled ? undefined : finalStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <SvgIcon name={iconSpec.name} icons={icons} />
          </svg>
        </div>
      );
    }

    if (iconSpec.type === "emoji") {
      return (
        <div
          className={styles.aboutIcon}
          aria-hidden
          style={{
            ["--icon-size"]: `${finalSize}px`,
            ["--icon-color"]: finalColor,
          }}
        >
          <span style={{ fontSize: finalSize, color: finalColor }}>
            {iconSpec.value}
          </span>
        </div>
      );
    }

    return null;
  };


  useEffect(() => {
    const cleanup = startBadgeAnimations(styles.badge);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = startDotAnimations(containerRef.current, { total: 150 });
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = startDividerAnimation(styles.aboutDividerInner, styles.about, { start: "top center", toggleActions: "play reverse play reverse", duration: 3 });
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = startToolsIconsAnimation(styles.toolsItem, styles.tools);
    return () => cleanup();
  }, []);

  useEffect(() => {
    const cleanup = startTimelineAnimation({
      start: "top center",
      end: "bottom center",
    });
    return () => cleanup?.();
  }, []);



  return (
    <>
      {isDesktop && (
        <>
          <div className={styles.hero}>
            <div ref={containerRef} style={{ position: "absolute", inset: 0 }}></div>
            <div className={styles.glowBall} aria-hidden="true"></div>
            <h1 className={styles.title}>CHRISTINA</h1>
            <div className={styles.flexHorizontal}>
              <div>
                <div className={styles.badge}>
                  <p>Web Developer</p>
                </div>
                <div className={styles.badge}>
                  <p>Automation Specialist</p>
                </div>
                <div className={styles.badge}>
                  <p>Product Manager</p>
                </div>
              </div>
              <Image
                src="/assets/images/profile.png"
                alt="Christina's Profile"
                className={styles.profileImage}
                width={500}
                height={500}
              />
              <div>
                <p>I build practical web applications and systems that solve real operational problems across business workflows. My work focuses on creating scalable, reliable solutions that improve efficiency and support day-to-day operations.</p>
                <div className={styles.ctaButtons}>
                  <a href="#projects" className={`${styles.button} ${styles.ctaPrimary}`}>See My Work</a>
                  <a href="#contact" className={`${styles.button} ${styles.ctaSecondary}`}>Get in Touch</a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.about}>
            <h2 className={styles.aboutHeading}>My Services</h2>
            <p className={styles.aboutSubtitle}>Here&apos;s how I can work with you to build reliable systems, streamline workflows, and improve day-to-day operations through technology.</p>

            <div className={styles.aboutInner}>
              <div className={styles.aboutColumn}>
                {items.filter((_, i) => i % 2 === 0).map((item) => (
                  <article key={item.id} className={styles.aboutBox}>
                    <div className={styles.aboutContent}>
                      <h3 className={styles.aboutTitle}>{item.title}</h3>
                      <p className={styles.aboutText}>{item.text}</p>
                    </div>
                    {renderIcon(item, {
                      icons: aboutData.icons,
                    })}

                  </article>
                ))}
              </div>

              <div className={styles.aboutDivider} aria-hidden>
                <div className={styles.aboutDividerInner} />
              </div>

              <div className={styles.aboutColumn}>
                {items.filter((_, i) => i % 2 === 1).map((item) => (
                  <article key={item.id} className={styles.aboutBox}>
                    <div className={styles.aboutContent}>
                      <h3 className={styles.aboutTitle}>{item.title}</h3>
                      <p className={styles.aboutText}>{item.text}</p>
                    </div>
                    {renderIcon(item, {
                      icons: aboutData.icons,
                    })}

                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.tools}>
            <h2>Technologies I Use</h2>
            <p className={styles.aboutSubtitle}>I use various technologies and best practices to simplify workflows, boost functionality, and deliver reliable digital solutions.</p>

            <div className={styles.toolsGrid}>
              {tools.map((tool) => (
                <article key={tool.id} className={styles.toolsItem}>
                  {renderIcon(tool, {
                    icons: toolData.icons,
                    size: 64,
                  })}
                </article>
              ))}
            </div>

          </div>

          <div className={`${styles.timeline} tl-section`}>
            <div className={`${styles.timelineHeader}`}>
              <h2>My Education & Experience</h2>
              <p className={styles.aboutSubtitle}>
                My academic background and work experience help me create solutions that actually work.
              </p>
            </div>

            <div className={`${styles.tlWrapper} tl-wrapper`}>
              <div className={`${styles.tlLeft} tl-left`}>
                <div className={`${styles.tlYearStack} tl-yearStack`}>
                  {timelineItems.map((item, idx) => (
                    <div key={idx} className={`${styles.tlYear} tl-year`} data-index={idx}>
                      <div className={`${styles.tlYearText} tl-yearText`}>
                        <span className="tl-digit">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.tlRight} tl-right`}>
                {timelineItems.map((item, idx) => (
                  <article key={idx} className={`${styles.tlCard} tl-card`} data-index={idx}>
                    <span className={`${styles.tlDot} tl-dot`} aria-hidden />
                    <div className={styles.tlCardContent}>
                      <h3 className={styles.title}>{item.title}</h3>
                      <p>{item.location}</p>
                      <ul className={styles.tlList}>
                        {item.description.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <Projects />
          <Contact />
        </>
      )}


      {!isDesktop && (
        <div className={styles.desktopNotice}>
          <h2>Best viewed on desktop</h2>
          <p>
            Mobile version is currently ongoing.
            Please visit this site on a larger screen for the best experience.
          </p>
        </div>
      )}

    </>
  );
}
