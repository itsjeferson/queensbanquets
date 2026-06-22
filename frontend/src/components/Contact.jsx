import { useState } from 'react';
import { submitInquiry } from '../api/inquiries.js';
import { contactChannels } from '../data/siteContent.js';
import SectionHeading from './SectionHeading.jsx';

const initialFormState = {
  name: '',
  email: '',
  eventDate: '',
  guests: '',
  message: '',
};

function Contact() {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState('idle');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');

    try {
      await submitInquiry(formData);
      setFormData(initialFormState);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div>
        <SectionHeading eyebrow="Begin the celebration" title="Request a private consultation.">
          Share your wedding vision and guest count. The form is structured for
          API integration when the backend is connected.
        </SectionHeading>

        <ul className="contact-list">
          {contactChannels.map((channel) => (
            <li key={channel}>{channel}</li>
          ))}
        </ul>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>
        <div className="form-row">
          <label>
            Event date
            <input
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Guests
            <input
              name="guests"
              type="number"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              placeholder="150"
            />
          </label>
        </div>
        <label>
          Wedding vision
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your ceremony, reception, and banquet style."
            rows="5"
          />
        </label>

        <button className="button button-primary" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
        </button>

        {status === 'success' ? (
          <p className="form-status">Thank you. Your inquiry is ready for the Queens Banquet team.</p>
        ) : null}
        {status === 'error' ? (
          <p className="form-status form-status-error">Please try again or contact us directly.</p>
        ) : null}
      </form>
    </section>
  );
}

export default Contact;
