import { useState } from 'react';
import { submitInquiry } from '../api/inquiries.js';
import { useLandingContent } from '../content/LandingContentContext.jsx';

const initialFormState = {
  name: '',
  email: '',
  eventDate: '',
  coordinationNeed: 'Heirloom Package',
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

  const backgroundUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDDDXUR_h5yKPGO5YeX2JajGaGA5Xm1rlmcx1YbzQVQsUorvnCNmqpCGg5gUGFSTLfWZUoi28VpO3tZN2b4to7sMZABBn3exvbqUPKlWmKOPLrvEwNi7fRHDFboYb7vE7exozls-2BlwdbvEDGsoN1spVamA8pi9KTnDaO75wpxN5Bk75z9hPl3z0M-64fBsSfizpmprXNWrd4Nk1GCEl7_kfWp8pAJbD6mqUONHC6pny8CLbx0VNUi2husdKrgbSnnhbN5uw9SzfI';

  return (
    <section className="relative py-section-y overflow-hidden" id="contact">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        />
      </div>
      <div className="max-w-3xl mx-auto px-page-x relative z-10 text-center">
        <span className="text-primary font-label-sm uppercase tracking-widest mb-4 block">
          Access Excellence
        </span>
        <h2 className="font-headline-lg text-[clamp(1.65rem,4vw,2rem)] md:text-headline-lg mb-6 sm:mb-8 text-center mx-auto text-balance">
          Request an Invitation
        </h2>
        <p className="font-body-lg text-[1rem] sm:text-body-lg text-tertiary mb-10 sm:mb-16 leading-relaxed text-pretty">
          Due to our commitment to exclusivity, we accept a limited number of clients per quarter. Share your vision, and our director will reach out for a private consultation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            <div className="relative group min-w-0">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact-field w-full bg-transparent border-0 border-b border-outline-variant py-3 sm:py-4 focus:ring-0 focus:border-primary transition-all text-on-surface text-[16px]"
                placeholder="Your distinguished name"
                type="text"
                required
              />
            </div>
            <div className="relative group min-w-0">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-field w-full bg-transparent border-0 border-b border-outline-variant py-3 sm:py-4 focus:ring-0 focus:border-primary transition-all text-on-surface text-[16px]"
                placeholder="Preferred contact channel"
                type="email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            <div className="relative group min-w-0">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Desired Date
              </label>
              <input
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="contact-field w-full bg-transparent border-0 border-b border-outline-variant py-3 sm:py-4 focus:ring-0 focus:border-primary transition-all text-on-surface text-[16px]"
                type="date"
                required
              />
            </div>
            <div className="relative group min-w-0">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Service Interest
              </label>
              <select
                name="coordinationNeed"
                value={formData.coordinationNeed}
                onChange={handleChange}
                className="contact-field w-full bg-transparent border-0 border-b border-outline-variant py-3 sm:py-4 focus:ring-0 focus:border-primary transition-all text-on-surface text-[16px]"
              >
                <option>Sovereign Package</option>
                <option>Heirloom Package</option>
                <option>Royal Signature</option>
                <option>Custom Concierge</option>
              </select>
            </div>
          </div>

          <div className="relative group">
            <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
              The Vision
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="contact-field w-full bg-transparent border-0 border-b border-outline-variant py-3 sm:py-4 focus:ring-0 focus:border-primary transition-all resize-none text-on-surface text-[16px]"
              placeholder="Describe the atmosphere you wish to create..."
              rows="4"
              required
            />
          </div>

          <div className="flex flex-col items-stretch sm:items-center mt-8 sm:mt-12">
            <button
              className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-5 bg-inverse-surface text-inverse-on-surface font-label-md uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 shadow-xl disabled:opacity-50 text-[12px] sm:text-label-md"
              type="submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting Request...' : 'Submit Request'}
            </button>

            {status === 'success' && (
              <p className="text-green-700 dark:text-green-400 font-semibold mt-6 text-[14px] text-center">
                {contactContent.successMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-700 dark:text-red-400 font-semibold mt-6 text-[14px] text-center">
                Please try again or contact us directly.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;
