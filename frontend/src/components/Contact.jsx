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
    <section className="relative py-40 overflow-hidden" id="contact">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        />
      </div>
      <div className="max-w-3xl mx-auto px-margin-mobile relative z-10 text-center">
        <span className="text-primary font-label-sm uppercase tracking-widest mb-4 block">
          Access Excellence
        </span>
        <h2 className="font-headline-lg text-headline-lg mb-8 text-center mx-auto">
          Request an Invitation
        </h2>
        <p className="font-body-lg text-tertiary mb-16 leading-relaxed">
          Due to our commitment to exclusivity, we accept a limited number of clients per quarter. Share your vision, and our director will reach out for a private consultation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative group">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-primary placeholder:text-tertiary/40 transition-all text-on-surface"
                placeholder="Your distinguished name"
                type="text"
                required
              />
            </div>
            <div className="relative group">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-primary placeholder:text-tertiary/40 transition-all text-on-surface"
                placeholder="Preferred contact channel"
                type="email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative group">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Desired Date
              </label>
              <input
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-primary transition-all text-tertiary"
                type="date"
                required
              />
            </div>
            <div className="relative group">
              <label className="font-label-sm uppercase text-on-surface-variant mb-2 block text-[12px] tracking-wider">
                Service Interest
              </label>
              <select
                name="coordinationNeed"
                value={formData.coordinationNeed}
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-primary transition-all text-tertiary"
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
              className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-primary placeholder:text-tertiary/40 transition-all resize-none text-on-surface"
              placeholder="Describe the atmosphere you wish to create..."
              rows="4"
              required
            />
          </div>

          <div className="flex flex-col items-center mt-12">
            <button
              className="px-16 py-5 bg-on-surface text-white font-label-md uppercase tracking-[0.2em] hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 shadow-xl disabled:opacity-50"
              type="submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting Request...' : 'Submit Request'}
            </button>

            {status === 'success' && (
              <p className="text-green-700 font-semibold mt-6 text-[14px]">
                {contactContent.successMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-700 font-semibold mt-6 text-[14px]">
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
