"use client";

import React from "react";
import { ClientCard } from "@components/ui/client-card";
import { MediaPlayerProvider } from "@hooks/use-media-player";
import styles from "@styles/capturedStories.module.css";
import type { ClientData } from "@/types/client";

const clientData: Partial<ClientData>[] = [
  {
    id: 1,
    logoSrc: "/images/texas_longhorns_1974-2004_a.png",
    logoAlt: "University of Texas Longhorns",
    videoSrc: "/videos/client1_UT_stadium.mp4",
    overlayClassName: styles["logo-overlay-longhorns"]
  },
  {
    id: 2,
    logoSrc: "/images/Mozart_s_Logo_maroon_49a6a0a6-0b92-45e3-b8d7-06daa912d48e_300x300.png.avif",
    logoAlt: "Mozart's Coffee",
    videoSrc: "/videos/client2_mozarts.mp4",
    overlayClassName: styles["logo-overlay-mozarts"]
  },
  {
    id: 3,
    logoSrc: "/images/tenlogo.webp",
    logoAlt: "TEN",
    videoSrc: "/videos/client3_TEN.mp4",
    overlayClassName: styles["logo-overlay-ten"]
  }
];

const CapturedStories: React.FC = () => {
  return (
    <MediaPlayerProvider>
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
                {clientData.map((client) => (
                  <ClientCard
                    key={client.id}
                    logoSrc={client.logoSrc!}
                    logoAlt={client.logoAlt!}
                    videoSrc={client.videoSrc!}
                    overlayClassName={client.overlayClassName}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MediaPlayerProvider>
  );
};

export default CapturedStories;