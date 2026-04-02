import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <>
      <section className="play-tonight-cta-section">
        <div className="content_container">
          <div className="column_row">
            <div className="column_container column-1_1">
              <div className="column-inner">
                <div className="empty_space h-5_3em"></div>
                <div className="cta3-container">
                  <div className="general cta3 cta3-style-classic cta3-shape-square cta3-align-center cta3-color-classic cta3-icon-size-md cta3-actions-center brd-3px_red">
                    <div className="cta3_content-container">
                      <div className="cta3-content-header">
                        <h2>UNLOCK YOUR TRUE NEW LIFE 2.0 TODAY WITH PLAY TONIGHT!</h2>
                      </div>
                      <div className="cta3-content">
                        <p>
                          Meant to Boost Stamina, Power, Increases Testosterone & Reduce Fatigue.
                        </p>
                        <p>
                          Enriched with a potent blend of herbal extracts, essential minerals, and natural energy boosters, these tablets are designed to help modern men stay active, confident, and energized throughout the day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="empty_space h-3em"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-simple">
        <div className="footer-container">
          <div className="footer-links">
            <a href="#disclaimer">Disclaimer</a>
            <span className="separator">|</span>
            <a href="#terms">Terms & Conditions</a>
            <span className="separator">|</span>
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="#refund">Refund & Cancellation Policy</a>
          </div>
          <div className="footer-copyright">
            © 2025, Zeen Mediconnect OPC Pvt Ltd. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
