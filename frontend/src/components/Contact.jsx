import { useState } from 'react';
import { CalendarCheck, MessagesSquare, Send, ShieldCheck } from 'lucide-react';
import { submitInquiry } from '../api/inquiries.js';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';
import SectionHeading from './SectionHeading.jsx';

const contactPromises = [
  { icon: MessagesSquare, text: 'A reply within one business day' },
  { icon: CalendarCheck, text: 'A short call to align on your date and needs' },
  { icon: ShieldCheck, text: 'No pressure, just clear next steps' },
];

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  meetingDate: '',
  eventDate: '',
  coordinationNeed: 'Wedding coordination',
  guests: '',
  message: '',
};

function Contact() {
  const {
    content: { contactContent },
  } = useLandingContent();
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
    <section className="section section-alt" id="contact">
      <div className="section-inner contact-grid">
        <ScrollReveal as="div" className="contact-panel theme-dark" variant="fade-left">
          <SectionHeading eyebrow={contactContent.eyebrow} title={contactContent.title}>
            {contactContent.description}
          </SectionHeading>

          <ul className="contact-promise-list">
            {contactPromises.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <p className="contact-panel-note">
            Prefer to reach out directly? Full contact details are in the footer below.
          </p>
        </ScrollReveal>

        <ScrollReveal as="form" className="contact-form" delay={120} onSubmit={handleSubmit} variant="fade-right">
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
          <label>
            Phone or Viber
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0917 767 7812"
            />
          </label>
          <div className="form-row">
            <label>
              Preferred meeting date
              <input
                name="meetingDate"
                type="date"
                value={formData.meetingDate}
                onChange={handleChange}
              />
            </label>
            <label>
              Coordination need
              <select name="coordinationNeed" value={formData.coordinationNeed} onChange={handleChange}>
                <option>Wedding coordination</option>
                <option>On-the-day coordination</option>
                <option>Planning consultation</option>
                <option>Reception program support</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Wedding or event date
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
            Notes for Marou
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what coordination help you need, your venue, supplier status, and program concerns."
              rows="5"
            />
          </label>

          <button className="button button-primary" type="submit" disabled={status === 'submitting'}>
            <Send aria-hidden="true" size={18} strokeWidth={1.7} />
            {status === 'submitting' ? 'Sending...' : 'Request Meeting'}
          </button>

          {status === 'success' ? (
            <p className="form-status">{contactContent.successMessage}</p>
          ) : null}
          {status === 'error' ? (
            <p className="form-status form-status-error">Please try again or contact us directly.</p>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  );
}

export default Contact;
