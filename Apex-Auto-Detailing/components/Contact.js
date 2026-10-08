'use client';

import { useState } from 'react';
import { contactConfig } from '../lib/contact-config';

const fallbackMapSearch = 'https://maps.google.com/maps?q=Apex%20Auto%20Detailing%20Karachi&output=embed';
const fallbackMapLink = 'https://www.google.com/maps/search/?api=1&query=Apex%20Auto%20Detailing%20Karachi';

export default function Contact() {
  const [status, setStatus] = useState('');
  const mapLink = contactConfig.mapsUrl || fallbackMapLink;

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = [
      'Hi Apex Auto Detailing, I would like to request a quote.',
      `Name: ${formData.get('name')}`,
      `Contact: ${formData.get('contact')}`,
      `Vehicle: ${formData.get('vehicle') || 'Not specified'}`,
      `Service: ${formData.get('service')}`,
      `Message: ${formData.get('message')}`,
    ].join('\n');
    const number = contactConfig.whatsapp.replace(/\D/g, '');
    const whatsappUrl = number
      ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setStatus(number
      ? 'Your inquiry is ready in WhatsApp. Tap send to contact Apex.'
      : 'Your inquiry is ready in WhatsApp. Select Apex Auto Detailing and tap send.');
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-intro">
          <div>
            <span className="wx-tag">Get in Touch</span>
            <h2 className="wx-title">Contact <span className="accent">Apex</span></h2>
          </div>
          <p className="contact-intro-copy">Tell us about your vehicle and the service you have in mind. We can discuss the available options and a confirmed quote.</p>
        </div>

        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-fields">
              <label className="contact-field">
                <span>Your name</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label className="contact-field">
                <span>Phone or email</span>
                <input name="contact" autoComplete="tel" required />
              </label>
              <label className="contact-field">
                <span>Vehicle</span>
                <input name="vehicle" autoComplete="off" placeholder="Make and model" />
              </label>
              <label className="contact-field">
                <span>Service</span>
                <select name="service" defaultValue="Car Wash" required>
                  <option>Car Wash</option>
                  <option>Interior Detailing</option>
                  <option>Exterior Detailing &amp; Compound Polishing</option>
                  <option>Ceramic Coating</option>
                  <option>Paint Protection Film (PPF)</option>
                  <option>Oil Change</option>
                  <option>Car Sound Damping</option>
                  <option>Solar Tints</option>
                  <option>Other / Not sure</option>
                </select>
              </label>
              <label className="contact-field contact-field--message">
                <span>How can we help?</span>
                <textarea name="message" rows="4" required />
              </label>
            </div>
            <div className="contact-form-actions">
              <button className="wx-btn wx-btn--primary" type="submit">Continue in WhatsApp</button>
              <p className="contact-status" role="status" aria-live="polite">{status}</p>
            </div>
          </form>

          <div className="contact-location">
            <div className="contact-location-heading">
              <div>
                <span className="contact-location-label">Visit the studio</span>
                <h3>Karachi, Pakistan</h3>
              </div>
              <a href={mapLink} target="_blank" rel="noreferrer">Open map <span aria-hidden="true">↗</span></a>
            </div>
            <div className="contact-map-frame">
              <div className="contact-map-fallback" aria-hidden="true">
                <span className="contact-map-marker">
                  <svg viewBox="0 0 24 32" role="presentation">
                    <path d="M12 31S2 19.5 2 12a10 10 0 1 1 20 0c0 7.5-10 19-10 19Z" fill="currentColor" />
                    <circle cx="12" cy="12" r="4" fill="#fff" />
                  </svg>
                  <span className="contact-map-marker-label">Apex Auto Detailing</span>
                </span>
                <span className="contact-map-fallback-label">Karachi, Pakistan</span>
                <span className="contact-map-fallback-note">Open Maps to plan your visit</span>
              </div>
              <iframe
                className="contact-map"
                title="Map search for Apex Auto Detailing in Karachi"
                src={contactConfig.mapEmbedUrl || fallbackMapSearch}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="contact-map-note">Open the map to find Apex Auto Detailing in Karachi and get directions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
