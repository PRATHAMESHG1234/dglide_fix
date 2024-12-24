import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-30">
            <div className="footer-text__title">Digital Glide</div>
            <div className="footer-text__body">
              Streamline your data management with our intuitive, customizable
              system, reducing training time and downtime.
            </div>
          </div>
          <div className="col-30">
            <div className="footer-text__title">Quick links</div>
            <ul className="footer-list">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#products">Products</a>
              </li>
              <li>
                <a href="#contact">Contact us</a>
              </li>
            </ul>
          </div>
          <div className="col-30">
            <div className="footer-text__title">Newsletter</div>
            <div className="footer-text__body">
              Subscribe to get latest updates and new on whiskers
            </div>
            <div className="footer-input">
              <input type="text" name="email" placeholder="Email id" />
              <div className="footer-input__icon">
                <ion-icon name="paper-plane-outline" />
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">
          Digital Glide CRM © {new Date().getFullYear()} | Built to Grow with
          You..!
        </div>
      </div>
    </footer>
  );
}

export default Footer;
