"use client"; // Only if you're in the new app/ directory and need client-side code.

import React from "react";
import Head from "next/head"; // For injecting tags into the <head>
import Link from "next/link";
import Image from "next/image";

// Simple example: mailto handler
function handleEmailClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  window.location.href = "mailto:contact@travellersbeats.com";
}

export default function Navbar() {
  return (
    <>
      {/* Head section with Font Awesome */}
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </Head>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="logo">
          {/* Use Link from Next.js for client-side transitions */}
          <Link href="/">
            <Image
              src="/images/logo_color.jpg"
              alt="Travellers Beats Logo"
              width={150}
              height={50}
              priority
              className="w-auto h-auto"
            />
          </Link>
        </div>

        <div className="nav-center">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <Link href="/store" className="nav-link">
            Store
          </Link>
          <Link href="/connect" className="nav-link">
            Connect
          </Link>
        </div>

        {/* Contact Email */}
        <div className="contact-email">
          <a href="#" className="email-link" onClick={handleEmailClick}>
            <i className="far fa-envelope" aria-hidden="true"></i>
            <span className="email-text">Email Us</span>
          </a>
        </div>
      </nav>
    </>
  );
}