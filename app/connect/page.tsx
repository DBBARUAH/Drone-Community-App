"use client"; // If you're in Next.js 13 App Router and need client-side code

import Image from 'next/image';

export default function Connect() {
  return (
    <section id="contactus" className="contactus">
      <div className="container">
        {/* Left Column: Text */}
        <div className="contact-text">
          <h2>Connect with Us</h2>
          <p>
            Whether you're looking to enhance your aerial photography skills or
            connect with professionals for aerial services, this is the place for
            you. Sign up to connect with a community of enthusiasts and
            professionals.
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
                <option value="learning">
                  Learning Drone Photography/Videography
                </option>
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

      {/* Blog Highlights Section (Renamed classes) */}
      <section className="connect-blog-highlights">
        <div className="connect-blog-container">
          <h2>BLOGS</h2>
          <p>Stay updated with the latest insights and stories from Travellers Beats.</p>

          <div className="connect-blog-grid">
            <div className="connect-blog-card">
              <Image
                src="/images/blog1.jpg"
                alt="Blog 1"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
              <div className="connect-blog-content">
                <h3>How Drones Are Transforming Industries</h3>
                <p>
                  Discover how drones are revolutionizing photography, logistics,
                  and more.
                </p>
              </div>
            </div>

            <div className="connect-blog-card">
              <img src="/images/blog2.jpg" alt="Blog 2" />
              <div className="connect-blog-content">
                <h3>Tips for Capturing Stunning Aerial Shots</h3>
                <p>Learn expert tips and tricks to take breathtaking drone photos.</p>
              </div>
            </div>

            <div className="connect-blog-card">
              <img src="/images/blog3.jpg" alt="Blog 3" />
              <div className="connect-blog-content">
                <h3>The Future of Drone Technology</h3>
                <p>Explore the latest advancements shaping the future of drones.</p>
              </div>
            </div>
          </div>

          <a href="/blog" className="connect-more-blogs">
            View More Blogs
          </a>
        </div>
      </section>
    </section>
  );
}