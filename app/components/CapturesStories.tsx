"use client";

import React from "react";
import { VideoPlayerProvider } from "@hooks/video-player-context";
import ClientCard from "@components/ui/ClientCard";
import styles from "@styles/capturedStories.module.css";

const CapturedStories: React.FC = () => {
  return (
    <VideoPlayerProvider>
      <section className={styles["our-clients"]}>
        <div className={styles["container"]}>
          <h2 className={styles["ourClientsH2"]}>CAPTURED STORIES</h2>
          <p className={styles["ourClientsP"]}>
            Discover the Stories We’ve Captured and the Moments We’ve Elevated Through Aerial Creativity
          </p>

          <div className={styles["client-grid"]}>
            <ClientCard
              logoSrc="/images/texas_longhorns_1974-2004_a.png"
              logoAlt="Client 1 Logo"
              videoSrc="/videos/client1_UT_stadium.mp4"
              overlayClassName={styles["logo-overlay-longhorns"]}
            />
            <ClientCard
              logoSrc="/images/Mozart_s_Logo_maroon_49a6a0a6-0b92-45e3-b8d7-06daa912d48e_300x300.png.avif"
              logoAlt="Client 2 Logo"
              videoSrc="/videos/client2_mozarts.mp4"
              overlayClassName={styles["logo-overlay-mozarts"]}
            />
            <ClientCard
              logoSrc="/images/tenlogo.webp"
              logoAlt="Client 3 Logo"
              videoSrc="/videos/client3_TEN.mp4"
              overlayClassName={styles["logo-overlay-ten"]}
            />
          </div>
        </div>
      </section>
    </VideoPlayerProvider>
  );
};

export default CapturedStories;