"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/styles/projects.module.css";
import featuredData from "@/app/data/projectData.json";
import parse from "html-react-parser";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const { personalProjects, clientProjects } = useMemo(() => {
    const data = featuredData;
    return {
      personalProjects: data.personalProjects ?? [],
      clientProjects: data.clientProjects ?? [],
    };
  }, []);

  const [activeProject, setActiveProject] = useState(null);

  // refs for scroll animation
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const headerRef = useRef(null);
  const personalHeaderRef = useRef(null);


  // Close modal on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    if (activeProject) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProject]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (!activeProject) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeProject]);

  // GSAP: pin + stack (Personal Projects only)
useEffect(() => {
  if (!sectionRef.current || !pinRef.current || !headerRef.current || !personalHeaderRef.current) return;

  let ctx;
  let ScrollTrigger;

  (async () => {
    const gsapMod = await import("gsap");
    const stMod = await import("gsap/ScrollTrigger");

    const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
    ScrollTrigger = stMod.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray('[data-feature="wrap"]');
      const cards = gsap.utils.toArray('[data-feature="personal-card"]');

      if (!wraps.length || wraps.length !== cards.length) return;

      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top top",
        endTrigger: sectionRef.current,
        end: "bottom top+=250",
        pin: headerRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: () => {
          gsap.set(headerRef.current, {
            x: Math.round(gsap.getProperty(headerRef.current, "x")),
            y: Math.round(gsap.getProperty(headerRef.current, "y")),
          });
        },
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top-=100",
        endTrigger: pinRef.current,
        end: "bottom center",
        pin: personalHeaderRef.current,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      gsap.set(cards, { clearProps: "transform" });

      wraps.forEach((wrap, i) => {
        const card = cards[i];
        let scale = 1;
        let rotationX = 0;

        if (i !== cards.length - 1) {
          scale = 0.92 + 0.02 * i;
          rotationX = -8;
        }

        gsap.to(card, {
          scale,
          rotationX,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: () => `top top+=${250 + 10 * i}`,
            end: "bottom bottom",
            endTrigger: pinRef.current,
            scrub: true,
            pin: wrap,
            pinSpacing: false,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);
  })();

  return () => {
    if (ctx) ctx.revert();
    if (ScrollTrigger) ScrollTrigger.killAll(false); // optional safety
  };
}, [personalProjects.length]);




  return (
    <section ref={sectionRef} className={styles.projectsWrapper} id="projects">
      <div ref={headerRef} className={styles.projectsHeader}>
        <h2>Featured Projects</h2>
        <p className={styles.subtitle}>
          A selection of projects showcasing hands-on development and practical
          solutions.
        </p>
      </div>

      <div ref={pinRef} className={styles.pinnedStage}>

        {/* Personal Projects (Pinned + Stacked) */}
        <div className={styles.featureList}>
          <h4 ref={personalHeaderRef} className={styles.subHeader}>Personal Projects</h4>

          <div className={styles.stackArea}>
            {personalProjects.slice(0, 4).map((project, idx) => {
              const isReversed = idx % 2 === 1;

              return (
                <div
                  key={project.id ?? idx}
                  className={styles.cardWrap}
                  data-feature="wrap"
                >
                  <article
                    data-feature="personal-card"
                    className={`${styles.featureRow} ${isReversed ? styles.reverse : ""}`}
                  >
                    <div className={styles.featureMedia}>
                      <div className={styles.featureMediaFrame}>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className={styles.featureImage}
                          priority={idx === 0}
                        />
                      </div>
                    </div>

                    <div className={styles.featureContent}>
                      <h3 className={styles.featureTitle}>{project.title}</h3>
                      <p className={styles.featureDesc}>{project.description}</p>

                      <button
                        type="button"
                        className={styles.cta}
                        onClick={() => setActiveProject(project)}
                      >
                        Read More <span className={styles.ctaArrow}>→</span>
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Professional / Client Projects (4-column grid, normal scroll) */}
      <div className={styles.clientSection}>
        <h4 className={styles.subHeader}>Professional Projects</h4>

        <div className={styles.clientGrid}>
          {clientProjects.slice(0, 4).map((project) => (
            <article key={project.id} className={styles.clientCard}>
              <div className={styles.clientThumb}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={styles.clientImg}
                />
              </div>

              <div className={styles.clientInfo}>
                <h5 className={styles.clientTitle}>{project.title}</h5>

                {project.description && (
                  <p className={styles.clientDesc}>{project.description}</p>
                )}

                <button
                  type="button"
                  className={styles.clientLink}
                  onClick={() => setActiveProject(project)}
                >
                  View <span className={styles.ctaArrow}>→</span>
                </button>

              </div>
            </article>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {activeProject && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveProject(null)}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={`Project details: ${activeProject.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left */}
            <div className={styles.modalLeft}>
              <div className={styles.videoWrap}>
                {activeProject.video ? (
                  <video
                    className={styles.video}
                    controls
                    playsInline
                    preload="metadata"
                    poster={activeProject.videoPoster || activeProject.image}
                    src={activeProject.video}
                  />
                ) : (
                  <div className={styles.image}>
                    <Image
                      src={activeProject.image}
                      alt={`${activeProject.title} screenshot`}
                      className={styles.modalImg}
                      width={500}
                      height={400}
                    />
                  </div>
                )}
              </div>

              <div className={styles.gallery}>
                {(activeProject.gallery ?? []).slice(0, 6).map((src, i) => (
                  <button
                    key={`${activeProject.id}-img-${i}`}
                    type="button"
                    className={styles.galleryItem}
                    aria-label={`Open image ${i + 1}`}
                    onClick={() => { }}
                  >
                    <Image
                      src={src}
                      alt={`${activeProject.title} screenshot ${i + 1}`}
                      fill
                      className={styles.galleryImg}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className={styles.modalRight}>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setActiveProject(null)}
                aria-label="Close modal"
              >
                ✕
              </button>

              <h3 className={styles.modalTitle}>{activeProject.title}</h3>

              <p className={styles.modalDesc}>
                {parse(activeProject.longDescription || activeProject.description)}
              </p>

              <div className={styles.toolsBlock}>
                <h4 className={styles.toolsTitle}>Tools Used</h4>

                <div className={styles.toolsList}>
                  {(activeProject.tools ?? []).map((tool) => (
                    <span
                      key={`${activeProject.id}-${tool}`}
                      className={styles.toolPill}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {activeProject.href && (<a
                className={styles.cta}
                href={activeProject.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Site<span className={styles.ctaArrow}>→</span>
              </a>)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
