import React from 'react';
import '../styles/search-results.css';

export default function SearchResultsPage() {
  return (
    <div className="results-page">
      <div className="results-topnav">
        <div className="nav-inner">
          <div className="brand">Komodo Cruises</div>
          <a className="back-link" href="/">‹ Back to komodocruises.com</a>
        </div>
      </div>
      <div className="results-container">
        <h1 className="results-heading">Your Search Results</h1>

        <p className="results-note">Unfortunately, we do not have availability for your dates.</p>
        <p className="results-note">
          We have a team of Komodo Cruises Travel Advisors who are ready to assist you with planning your trip. Simply
          select your preferences and submit your enquiry below, alternatively, please try new dates.
        </p>
        <p className="results-disclaimer">
          <strong>Note:</strong> These results indicate availability and do not guarantee a booking.
        </p>

        <section className="enquiry-section">
          <h2 className="enquiry-heading">Submit Enquiry</h2>
          <div className="section-divider" />
          <p className="lead">
            Please complete the form below and one of our Travel Advisors will contact you shortly to plan your trip.
          </p>

          <form className="enquiry-form" onSubmit={(e) => e.preventDefault()}>
            {/* Row 1 */}
            <div className="form-row three-cols">
              <div className="form-field">
                <label htmlFor="title">Title</label>
                <select id="title" defaultValue="">
                  <option value="" disabled>—</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                  <option>Dr</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" />
              </div>
              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row two-cols">
              <div className="form-field">
                <label htmlFor="phone">Contact Number</label>
                <div className="phone-input">
                  <select aria-label="Country code" defaultValue="+1">
                    <option>+1</option>
                    <option>+44</option>
                    <option>+62</option>
                    <option>+61</option>
                    <option>+65</option>
                  </select>
                  <input id="phone" type="tel" placeholder="" />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="country">Country</label>
                <select id="country" defaultValue="">
                  <option value="" disabled>Select country</option>
                  <option>Indonesia</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Singapore</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="form-row two-cols">
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" />
              </div>
              <div className="form-field">
                <label htmlFor="confirmEmail">Confirm Email Address</label>
                <input id="confirmEmail" type="email" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="form-row one-col">
              <div className="form-field">
                <label htmlFor="iam">I am a:</label>
                <select id="iam" defaultValue="">
                  <option value="" disabled>Choose one</option>
                  <option>Traveller</option>
                  <option>Travel Agent</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Row 5 */}
            <div className="form-row one-col">
              <div className="form-field">
                <label htmlFor="message">Is there anything else you'd like to let us know?</label>
                <textarea id="message" rows={4} />
              </div>
            </div>

            {/* Row 6 - checkboxes */}
            <div className="form-row one-col">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Sign up to receive news and blog posts from Komodo Cruises</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" />
                <span>I consent to my submitted data being collected and stored</span>
              </label>
            </div>

            <p className="results-disclaimer small">
              PLEASE NOTE: These results indicate availability and do not guarantee a booking. One of our Komodo Cruises
              Travel Advisors will contact you shortly to plan your trip.
            </p>

            <div className="form-actions">
              <button type="submit" className="btn-send">SEND ENQUIRY</button>
            </div>

            <p className="captcha-note">
              This form is protected by reCAPTCHA Enterprise and the Google Privacy Policy and Terms of Service apply.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
