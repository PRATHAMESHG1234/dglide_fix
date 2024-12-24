import React from 'react';
import './src/styles/styles.css';

import Navbar from './src/components/Navbar';
import HeroBanner from './src/components/HeroBanner';
import Footer from './src/components/Footer';
import ContactUs from './src/components/ContactUs';
import About from './src/components/About';
import Products from './src/components/Products';

const Website = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <Products />
        <About />
        <ContactUs />
      </main>
      <Footer />
    </>
  );
};
export default Website;
