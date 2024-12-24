import React, { useState } from 'react';

import { useScrollYPosition } from 'react-use-scroll-position';
import '../styles/navbar.css';

function Navbar({ links }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollY = useScrollYPosition();

  const stickeyTrigger = window.innerHeight / 2.75;

  return (
    <div
      className={`nav${scrollY > stickeyTrigger ? ' nav-stickey' : ''}${
        menuOpen ? ' nav-open' : ''
      }`}
    >
      <div className="nav-content">
        <nav className="nav-links__container">
          {links &&
            links.map((link, i) => (
              <a className="nav-link" href={link.href} key={i}>
                <div className="nav-link__text">{link.title}</div>
                <div className="nav-link__background" />
              </a>
            ))}
        </nav>
        <div className="nav-logo">Digital Glide</div>
      </div>
    </div>
  );
}

Navbar.defaultProps = {
  links: [
    { title: 'Home', href: '#home' },
    { title: 'Products', href: '#products' },
    { title: 'About us', href: '#about' },
    // { title: "Pricing", href: "#pricing" },
    { title: 'Contact us', href: '#contact' }
  ]
};

export default Navbar;
