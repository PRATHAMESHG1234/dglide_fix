import React from "react";
import "../styles/contact-us.css";

function ContactUs() {
  return (
    <section id="contact">
      <div className="contact-upper">
        <div className="section-text__title-centered">Contact Us</div>
      </div>
      <div className="contact-lower">
        <form className="contact-form">
          <div className="contact-form__group">
            <label htmlFor="name" className="contact-form__label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="contact-form__input"
              required
            />
          </div>

          <div className="contact-form__group">
            <label htmlFor="email" className="contact-form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="contact-form__input"
              required
            />
          </div>

          <div className="contact-form__group">
            <label htmlFor="message" className="contact-form__label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="contact-form__textarea"
              required
            />
          </div>

          <button type="submit" className="download-btn2">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactUs;
