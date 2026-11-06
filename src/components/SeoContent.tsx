import type { RouteSEOConfig } from '../config/seoRoutes';
import './SeoContent.css';

interface SeoContentProps {
  config: RouteSEOConfig;
}

export function SeoContent({ config }: SeoContentProps) {
  return (
    <section className="seo-section" aria-labelledby="seo-main-heading">
      {/* Privacy Guarantee Highlight Box */}
      <div className="privacy-card">
        <div className="privacy-card-icon">🔒</div>
        <div className="privacy-card-body">
          <h2 id="seo-main-heading" className="privacy-title">
            100% Client-Side Privacy Guarantee
          </h2>
          <p className="privacy-description">
            {config.privacySummary}
          </p>
          <div className="privacy-checklist">
            <span className="check-item">✓ Zero server uploads</span>
            <span className="check-item">✓ No account required</span>
            <span className="check-item">✓ Works offline</span>
            <span className="check-item">✓ No watermarks</span>
          </div>
        </div>
      </div>

      {/* Overview & Format Information */}
      <article className="seo-overview-card">
        <h3 className="overview-title">{config.seoHeading}</h3>
        <p className="overview-text">{config.seoDescription}</p>

        {/* Core Value Props Grid */}
        <div className="features-grid">
          {config.features.map((feature, idx) => (
            <div key={idx} className="feature-item">
              <span className="feature-icon">{feature.icon}</span>
              <div className="feature-text">
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* How It Works Steps */}
      <section className="how-it-works-section" aria-label="Step by step instructions">
        <h3 className="section-subtitle">
          How to Convert {config.shortName} to PDF in 3 Easy Steps
        </h3>
        <div className="steps-container">
          {config.steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-num">{step.stepNumber}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="faq-section" aria-label="Frequently Asked Questions">
        <h3 className="section-subtitle">Frequently Asked Questions</h3>
        <div className="faq-grid">
          {config.faq.map((item, idx) => (
            <div key={idx} className="faq-card">
              <h4 className="faq-question">❓ {item.question}</h4>
              <p className="faq-answer">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
