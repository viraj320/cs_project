import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!message) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await axios.post('http://localhost:5000/api/contact/', {
          email,
          subject,
          message,
        });
        
        alert('Thank you for contacting us! We will get back to you soon.');

        // Clear form
        setEmail('');
        setSubject('');
        setMessage('');
      } catch (error) {
        console.error('Error submitting contact form:', error);
        alert('Failed to send message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div id="contact" className="py-16 bg-[#02002c] text-white flex flex-col items-center px-4">
      <h2 className="text-4xl font-bold text-orange-500 mb-4 uppercase">Contact Us</h2>
      <p className="text-2xl mb-10">Stay connected with us</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded focus:outline-none text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-400 text-sm">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Subject"
            className="w-full p-3 rounded focus:outline-none text-black"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {errors.subject && <span className="text-red-400 text-sm">{errors.subject}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full p-3 rounded focus:outline-none text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          {errors.message && <span className="text-red-400 text-sm">{errors.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
