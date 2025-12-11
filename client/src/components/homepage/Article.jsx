import React from 'react';

import Article1 from '../../assets/homepagearticle/Article1.png';
import Article2 from '../../assets/homepagearticle/Article2.png';
import Article3 from '../../assets/homepagearticle/Article3.png';

// Dummy Articles Data
const articles = [
  {
    title: "Waking Up the Roads: Why Driving an EV Feels So Right",
    image: Article1,
    link: "https://noorhantrdg.com/the-ultimate-guide-to-car-spare-parts/",
  },
  {
    title: "Saving the world, one charge at a time",
    image: Article2,
    link: "https://www.idolz.com/en/most-important-vehicle-spare-parts/",
  },
  {
    title: "It's time to plug-in to the new road ahead",
    image: Article3,
    link: "https://www.gemsons.com/exploring-automobile-spare-parts-their-importance-and-usage/",
  },
];

const RecentArticles = () => {
  return (
    <div className="py-10 bg-[#f9f9f9]">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Recent Articles and News
      </h2>
      
      <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-300 border border-gray-200">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-6 flex flex-col justify-between h-[150px]">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {article.title}
                </h3>
              </div>
              <a
                href={article.link}
                className="text-orange-500 text-sm font-semibold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentArticles;
