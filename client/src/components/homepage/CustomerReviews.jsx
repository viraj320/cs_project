import React, { useState, useEffect } from 'react';
import API from '../../services/api';

//  Import customer images
import Customer1 from '../../assets/homepagecustomerreviews/Customer1.png';
import Customer2 from '../../assets/homepagecustomerreviews/Customer2.png';
import Customer3 from '../../assets/homepagecustomerreviews/Customer3.png';
import Customer4 from '../../assets/homepagecustomerreviews/Customer4.png';

const defaultImages = [Customer1, Customer2, Customer3, Customer4];

// Helper function to map rating to stars
const getRatingStars = (rating) => {
  const ratingMap = {
    'Very Bad': 1,
    'Bad': 2,
    'Okay': 3,
    'Good': 4,
    'Excellent': 5,
  };
  return ratingMap[rating] || 3;
};

const CustomerReviews = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get('/feedback/all');
        const allFeedbacks = res.data?.data || [];
        // Filter only spare part feedbacks (no garageId) and get latest 4
        const sparePartFeedbacks = allFeedbacks
          .filter(fb => !fb.garageId && fb.feedback && fb.feedback.trim() !== '')
          .slice(0, 4)
          .map((fb, index) => ({
            text: fb.feedback,
            name: fb.name || fb.email.split('@')[0], // Use name if available, otherwise email prefix
            rating: getRatingStars(fb.rating),
            image: defaultImages[index % defaultImages.length],
          }));
        setReviews(sparePartFeedbacks);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="py-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-10 uppercase">
          What our Customer say
        </h2>
        <div className="text-center text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-10 uppercase">
          What our Customer say
        </h2>
        <div className="text-center text-gray-500">No customer reviews yet.</div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-white">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-10 uppercase">
        What our Customer say
      </h2>
      <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {reviews.map((review, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`cursor-pointer bg-white rounded-2xl shadow transition duration-300 p-6 flex flex-col justify-between border ${
              activeIndex === index
                ? 'border-orange-500 scale-105 shadow-lg'
                : 'border-gray-200 hover:shadow-md'
            }`}
          >
            <p className="text-gray-700 text-sm mb-6">{review.text}</p>
            <div className="flex items-center gap-4 mt-auto">
              <img
                src={review.image}
                alt={review.name}
                className={`${
                  activeIndex === index ? 'w-16 h-16' : 'w-12 h-12'
                } rounded-full border-2 border-orange-500 transition-all duration-300`}
              />
              <div className="text-left">
                <h4 className="text-md font-bold">{review.name}</h4>
                <div className="flex">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        starIndex < review.rating
                          ? 'text-orange-500'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.028 3.174a1 1 0 00.95.69h3.317c.969 0 1.371 1.24.588 1.81l-2.683 1.95a1 1 0 00-.364 1.118l1.028 3.174c.3.921-.755 1.688-1.538 1.118l-2.683-1.95a1 1 0 00-1.176 0l-2.683 1.95c-.783.57-1.838-.197-1.538-1.118l1.028-3.174a1 1 0 00-.364-1.118l-2.683-1.95c-.783-.57-.38-1.81.588-1.81h3.317a1 1 0 00.95-.69l1.028-3.174z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
