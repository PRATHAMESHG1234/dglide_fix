import React from 'react';

function Products() {
  return (
    <section
      id="products"
      className="flex flex-col items-center justify-center"
    >
      <div className="section-text">
        <div className="section-text__title-centered">
          Optimize with Digital Glide Services!{' '}
        </div>
        <div className="service-cards">
          <div className="service-card">
            <div className="service-card__icon">
              <ion-icon name="people-outline" />
            </div>
            <div className="service-card__text-container">
              <div className="section-text__title-small">CRM</div>
              <div className="section-text__desc">
                Boost customer relationships with our intuitive CRM tool,
                designed to streamline sales. Manage contacts, track leads, and
                monitor interactions—all from one powerful platform.
              </div>
            </div>
          </div>

          <div className="service-card active">
            <div className="service-card__icon">
              <ion-icon name="document-text-outline" />
            </div>
            <div className="service-card__text-container">
              <div className="section-text__title-small">Ticketing</div>
              <div className="section-text__desc">
                Efficiently manage support requests with our streamlined
                ticketing system, designed to enhance customer service and speed
                up response times.
              </div>
            </div>
          </div>

          <div className="service-card">
            <div className="service-card__icon">
              <ion-icon name="folder-outline" />{' '}
            </div>
            <div className="service-card__text-container">
              <div className="section-text__title-small">Data Management</div>
              <div className="section-text__desc">
                Empower environmental conservation efforts with our data storage
                and tracking solution, built to simplify data management for
                sustainable projects.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
