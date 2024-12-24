import React from 'react';

import heroImage from '../../public/images/hero-right.png';

function HeroBanner() {
  return (
    <section id="home">
      <div style={{ overflow: 'hidden' }}>
        <div className="flex flex-col items-center justify-center pt-3">
          <div className="home-text flex flex-col items-center justify-center">
            <div className="section-text__title-big">
              Glide with Data, Soar to Success!
            </div>

            <div className="section-text__body">
              Intuitive, fully customizable data management tool powered by
              machine learning and AI, delivering actionable business analytics
              and process flow management with minimal training time and cost
            </div>
            <a href="#contact" className="download-btn">
              Get Started
            </a>
          </div>

          <div className="section-image">
            <img
              src={heroImage}
              alt="App Preview"
              style={{
                maxHeight: '650px',
                marginTop: '-90px'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
