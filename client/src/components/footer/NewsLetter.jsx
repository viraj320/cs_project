import { useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import API from '../../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      setBusy(true);
      const res = await API.post("/newsletter", { email });
      alert(res.data?.message || "Subscribed successfully.");
      setEmail('');
    } catch (err) {
      console.error("Newsletter subscribe error", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h3 className="text-gray-800 font-semibold mb-4 text-lg">Join Our Newsletter Now</h3>
      <p className="text-gray-600 mb-4">Get E-mail updates about our latest shop and special offers.</p>
      <form onSubmit={handleSubmit} className="flex mb-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your Email..."
          className="flex-grow px-4 py-2 border border-gray-300 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-blue-600 text-white px-4 py-2 uppercase text-sm font-semibold disabled:opacity-60"
        >
          {busy ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      <div className="flex space-x-4">
        <a
          href="https://www.facebook.com/sanduni.wathsala.14203544?mibextid=ZbWKwL"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600"
        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/sanduni-wathsala-90894a254"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600"
        >
          <FaLinkedinIn size={20} />
        </a>
        <a
          href="https://www.instagram.com/sanduni_wathsala_sw/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600"
        >
          <FaInstagram size={20} />
        </a>
      </div>
    </div>
  );
}
