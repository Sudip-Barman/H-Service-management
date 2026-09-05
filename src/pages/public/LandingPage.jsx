import MainLayout from "../../layouts/MainLayout";

import Navbar from "../../components/landing/NavBar";
import Hero from "../../components/landing/Hero";
import ServiceHighlights from "../../components/landing/ServiceHighlights";
import ServiceShowcase from "../../components/landing/ServiceShowcase";
import CareBanner from "../../components/landing/CareBanner";
import Doctors from "../../components/landing/Doctors";
import WhyChooseUs from "../../components/landing/WhyChooseUs";
import Testimonials from "../../components/landing/Testimonials";
import Team from "../../components/landing/Team";
import Footer from "../../components/landing/Footer";

const LandingPage = () => {
  return (
    <MainLayout>
      <Navbar />

      <main>
        <Hero />
        <ServiceHighlights />
        <ServiceShowcase />
        <CareBanner />
        <Doctors />
        <WhyChooseUs />
        <Testimonials />
        <Team />
        <Footer />
      </main>
    </MainLayout>
  );
};

export default LandingPage;