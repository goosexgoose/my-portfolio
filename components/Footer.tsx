'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faYoutube,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <h5>Follow Me</h5>
      <div className="underline"></div>
      <nav aria-label="Social Media">
        <ul className="social-icons">
          <li>
            <a
              href="https://www.youtube.com/channel/UCG2k7xDT_JyQhtkVQnoAs_A"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/firefloorfly/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/kaiya-li-60aa67294/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </li>
        </ul>
      </nav>

      <div className="copyright">
        &copy; 2023 – {currentYear} Kaiya Li – All Rights Reserved.
      </div>
    </footer>
  );
}
