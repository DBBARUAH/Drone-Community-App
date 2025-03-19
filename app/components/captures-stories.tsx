"use client";

import React from "react";
import { VideoPlayerProvider } from "@hooks/video-player-context";
import { ClientCard } from "@/components/ui/client-card";
import styles from "@styles/capturedStories.module.css";
import Image from 'next/image';

const clientData = [
  {
    logoSrc: "/images/texas_longhorns_1974-2004_a.png",
    logoAlt: "University of Texas Longhorns",
    videoSrc: "/videos/client1_UT_stadium.mp4",
    overlayClassName: styles["logo-overlay-longhorns"]
  },
  {
    logoSrc: "/images/Mozart_s_Logo_maroon_49a6a0a6-0b92-45e3-b8d7-06daa912d48e_300x300.png.avif",
    logoAlt: "Mozart's Coffee",
    videoSrc: "/videos/client2_mozarts.mp4",
    overlayClassName: styles["logo-overlay-mozarts"]
  },
  {
    logoSrc: "/images/tenlogo.webp",
    logoAlt: "TEN",
    videoSrc: "/videos/client3_TEN.mp4",
    overlayClassName: styles["logo-overlay-ten"]
  }
];

const CapturedStories: React.FC = () => {
  return (
    <VideoPlayerProvider>
      <section className="section-wrapper py-12 md:py-16">
        <div className="section-content">
          <div className={styles["our-clients"]}>
            <div className={styles["container"]}>
              <div className="flex flex-col items-center gap-6 mb-10">
                <h2 className="section-header light">CAPTURED STORIES</h2>
                <p className="section-description text-theme-light font-playfair text-base md:text-lg lg:text-[1.1rem] leading-[1.8] max-w-2xl">
                  Discover the Stories We've Captured and the Moments We've Elevated Through Aerial Creativity
                </p>
              </div>

              <div className={styles["client-grid"]}>
                {clientData.map((client, index) => (
                  <ClientCard
                    key={index}
                    logoSrc={client.logoSrc}
                    logoAlt={client.logoAlt}
                    videoSrc={client.videoSrc}
                    overlayClassName={client.overlayClassName}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </VideoPlayerProvider>
  );
};

export default CapturedStories;