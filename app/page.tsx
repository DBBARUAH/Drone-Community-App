// pages/index.js (Home Page)
import Head from 'next/head';
import Hero from "@/components/Hero";

import CapturedStories from "@/components/CapturesStories";
// import AboutUs from '../components/AboutUs';
// import AerialVideos from '../components/AerialVideos';
import ContactUs from '@/components/ContactUs';
import { ReviewSection } from './components/TestimonialsSection';

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
