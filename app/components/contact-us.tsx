"use client";

export default function ContactUs() {
    return (
        <section id="contactus" className="contactus">
            <div className="container">
                {/* Left Column: Text */}
                <div className="contact-text">
                    <h2 className="section-header">CONNECT WITH US</h2>
                    <p className="text-base md:text-lg lg:text-[1.1rem] leading-[1.8] text-[#ccc] font-playfair mb-8">Whether you're looking to enhance your aerial photography skills or connect with professionals for aerial services, this is the place for you. Sign up to connect with a community of enthusiasts and professionals.</p>

                    {/* Follow Our Journey */}
                    <div className="follow-journey">
                        <strong className="text-lg md:text-xl font-semibold">Follow Our Journey</strong>
                        <a href="https://instagram.com/travellers.beats" target="_blank">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://youtube.com/@travellersbeat" target="_blank">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://www.tiktok.com/@travellers.beats" target="_blank">
                            <i className="fab fa-tiktok"></i>
                        </a>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="form-container">
                    <form action="https://formspree.io/f/xgegjwqk" method="POST">
                        <input type="text" name="name" placeholder="Your Name" required />
                        <input type="email" name="email" placeholder="Your Email" required />
                        <textarea name="message" rows={4} placeholder="Anything you would like to share" required></textarea>

                        <div>
                            <label htmlFor="interests">Your Interests:</label>
                            <select name="interests" id="interests">
                                <option value="learning">Learning Drone Photography/Videography</option>
                                <option value="services">Exploring LUTs and Editing Resources</option>
                                <option value="client">Connecting with Drone Enthusiasts</option>
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