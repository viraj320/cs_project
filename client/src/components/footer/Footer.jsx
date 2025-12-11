import React from 'react';
import CompanyInfo from './CompanyInfo';
import UsefulLinks from './UsefulLinks';
import Newsletter from './Newsletter';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 px-6 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
        <CompanyInfo />
        <UsefulLinks />
        <Newsletter />
      </div>
    </footer>
  );
}
