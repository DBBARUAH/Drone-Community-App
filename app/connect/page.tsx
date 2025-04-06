"use client"; // If you're in Next.js 13 App Router and need client-side code

import Image from 'next/image';

export default function Connect() {
  return (
    <section id="contactus" className="contactus">
      <div className="container p-0">
        {/* Left Column: Text */}
        <div className="page-header-container">
          <div className="flex flex-col items-center">
            <h2 className="page-title">Contact Us</h2>
            <div className="page-title-underline"></div>
          </div>
          <p className="page-description">
            Whether you're interested in learning drone photography, exploring our
            resources, or hiring our services, we'd love to hear from you.
          </p>

          {/* Follow Our Journey */}
          <div className="follow-journey">
            <strong>Follow Our Journey</strong>
            <a
              href="https://instagram.com/travellers.beats"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com/@travellersbeat"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://www.tiktok.com/@travellers.beats"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="form-container">
          <form action="https://formspree.io/f/xgegjwqk" method="POST">
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea
              name="message"
              rows={4}
              placeholder="Anything you would like to share"
              required
            ></textarea>

            <div>
              <label htmlFor="interests">Your Interests:</label>
              <select name="interests" id="interests">
                <option value="learning">Learning Drone Photography/Videography</option>
                <option value="services">Exploring LUTs and Editing Resources</option>
                <option value="community">Connecting with Drone Enthusiasts</option>
                <option value="client">Hiring Professional Drone Services</option>
                <option value="all">Others</option>
              </select>
            </div>

            <button type="submit">Join the Community</button>
          </form>
        </div>
      </div>
    </section>
  );
}