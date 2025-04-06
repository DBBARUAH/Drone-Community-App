// pages/index.js (Home Page)
import Head from 'next/head';
import Hero from "@/components/home/hero";
import ContactUs from '@/components/contact-us';
import { CommunityTestimonials } from './components/home/testimonials-section';
import { DroneFeatureSection } from './components/home/feature-section';
import { PremiumAerialGallery } from "@/components/home/inspiring-aerial-art"



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
            <DroneFeatureSection />
            <PremiumAerialGallery />
            {/* <CapturedStories /> */}
            {/* <Clients />
            <AboutUs />
            <AerialVideos />
            */
            // <Footer /> 
            }
            <CommunityTestimonials />
            <ContactUs />
        </>
    );
}
