import { Link } from 'react-router-dom';
import { ALL_TOOL_ROUTES } from '../config/seoRoutes';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span>📄</span> Images to <span className="highlight">PDF</span>
            </div>
            <p className="footer-tagline">
              100% Free, secure, client-side in-browser image to PDF conversion.
              Your files never leave your device.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Conversion Tools</h4>
            <ul className="footer-links-list">
              {ALL_TOOL_ROUTES.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="footer-link">
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-privacy-col">
            <h4 className="footer-col-title">Security & Privacy</h4>
            <p className="footer-privacy-note">
              🔒 Powered by client-side Web APIs and jsPDF. Files are processed locally inside your web browser. No cloud uploads, no tracking, and zero data logging.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Images to PDF. Built with React, jsPDF & dnd-kit.</p>
          <div className="footer-badges">
            <span className="footer-pill">Client-Side Engine</span>
            <span className="footer-pill">Zero Server Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
