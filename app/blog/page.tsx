import React from "react";

export default function BlogPage() {
  return (
    <section id="blog" className="blog">
      <div className="container">
        <h2>Our Blog</h2>
        <p>Explore insights, stories, and updates from our team.</p>

        <div className="blog-grid">
          {/* Blog Card #1 */}
          <div className="blog-card">
            <img src="/images/blog1.jpg" alt="Blog 1" />
            <div className="blog-content">
              <h3>How Drones Are Transforming Industries</h3>
              <p>Discover how drones are revolutionizing photography, logistics, and more.</p>
              <a href="#" className="read-more">
                Read More
              </a>
            </div>
          </div>

          {/* Blog Card #2 */}
          <div className="blog-card">
            <img src="/images/blog2.jpg" alt="Blog 2" />
            <div className="blog-content">
              <h3>Tips for Capturing Stunning Aerial Shots</h3>
              <p>Learn expert tips and tricks to take breathtaking drone photos.</p>
              <a href="#" className="read-more">
                Read More
              </a>
            </div>
          </div>

          {/* Blog Card #3 */}
          <div className="blog-card">
            <img src="/images/blog3.jpg" alt="Blog 3" />
            <div className="blog-content">
              <h3>The Future of Drone Technology</h3>
              <p>Explore the latest advancements shaping the future of drones.</p>
              <a href="#" className="read-more">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}