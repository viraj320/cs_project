import React, { useState, useEffect } from 'react';
import axios from "axios";

const FeedbackPopup = ({ onClose }) => {
  const [rating, setRating] = useState('');
  const [recommend, setRecommend] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Get user data from localStorage
  useEffect(() => {
    const userData = (typeof window !== "undefined" && (localStorage.getItem("userData") || localStorage.getItem("user"))) || null;
    const user = userData ? JSON.parse(userData) : null;
    if (user) {
      setEmail(user.email || '');
      setName(user.name || '');
    }
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!rating || !feedback || !recommend || !email) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    
     try {
      const response = await axios.post("http://localhost:5000/api/feedback/", {
        rating,
        feedback,
        recommend: Number(recommend),
        email,
        name,
      });

      console.log("Submitted:", response.data);
      alert("Thank you for your feedback!");

      // Reset form
      setRating('');
      setFeedback('');
      setRecommend('');
      setEmail('');
      
      onClose(); // Close popup
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback: " + (error.response?.data?.message || error.message));
    }
  };

  const emojis = [
    { label: 'Very Bad', symbol: '😠' },
    { label: 'Bad', symbol: '😟' },
    { label: 'Okay', symbol: '😐' },
    { label: 'Good', symbol: '😊' },
    { label: 'Excellent', symbol: '😍' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-xl relative">
        
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6">Send Feedback</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Emoji Rating */}
          <div className="text-center space-x-4">
            <p className="mb-2 font-semibold">Please rate your overall experience below</p>
            <div className="flex justify-center gap-4">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(emoji.label)}
                  className={`text-4xl ${rating === emoji.label ? 'scale-125' : ''} transition-transform`}
                >
                  {emoji.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Feedback */}
          <div>
            <label className="font-semibold block mb-2">Please write your feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows="4"
              required
            />
          </div>

          {/* Likert Scale */}
          <div className="text-center">
            <p className="font-semibold mb-2">How likely are you to recommend us to your friends and colleagues?</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRecommend(num)}
                  className={`w-10 h-10 rounded-full border ${
                    recommend === num ? 'bg-blue-500 text-white' : 'text-gray-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm mt-2 text-gray-500">
              <span>Not very likely</span>
              <span>Very likely</span>
            </div>
          </div>

          {/* Name and Email Fields - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label className="font-semibold block mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Your name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="font-semibold block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Your email"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;
