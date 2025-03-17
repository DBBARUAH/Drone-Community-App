// pages/index.js (Home Page)
import Head from 'next/head';
import Hero from "@/components/hero";

import CapturedStories from "@/components/captures-stories";
// import AboutUs from '../components/AboutUs';
// import AerialVideos from '../components/AerialVideos';
import ContactUs from '@/components/contact-us';
import { ReviewSection } from './components/testimonials-section';

export default function Home() {
    return (
        <>
            <Head>
                <title>Travellers Beats</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="UTF-8" />
            </Head>
            {/* <Navbar /> */}
            <Hero />
            <CapturedStories />
            {/* <Clients />
            <AboutUs />
            <AerialVideos />
            */
            // <Footer /> 


            
            }
            <ReviewSection />
            <ContactUs />
        </>
    );
}
