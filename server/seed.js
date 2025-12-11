require('dotenv').config();
const connectDB = require('./config/db');
const Garage = require('./models/Garage');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Visit = require('./models/Visit');

function toYYYYMMDD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

(async () => {
  try {
    await connectDB();

    // Clear old data
    await Promise.all([
      Garage.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Visit.deleteMany({}),
    ]);

    // Create demo garage
    const garage = await Garage.create({
      name: 'Sandaruwan Auto Care',
      location: 'Colombo',
      services: 'Oil Change, Towing, Engine Diagnostics',
      contact: '0771234567',
      availability: true,
    });

    const today = new Date();

    // Bookings (NOTE: using garageId)
    const bookings = Array.from({ length: 8 }).map((_, i) => ({
      garageId: garage._id,
      customerName: `Customer ${i + 1}`,
      service: ['Oil Change', 'Towing', 'Diagnosis'][i % 3],
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - i),
      status: ['Pending', 'Accepted', 'Rejected'][i % 3],
    }));
    await Booking.insertMany(bookings);

    // Reviews (NOTE: using garageId)
    const reviews = Array.from({ length: 5 }).map((_, i) => ({
      garageId: garage._id,
      customerName: `Reviewer ${i + 1}`,
      rating: 3 + (i % 3),
      comment: `Great service ${i + 1}`,
    }));
    await Review.insertMany(reviews);

    // Visits (NOTE: using garageId)
    const visits = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      visits.push({
        garageId: garage._id,
        date: toYYYYMMDD(d),
        count: Math.floor(Math.random() * 10) + 5,
      });
    }
    await Visit.insertMany(visits);

    console.log('✅ Seeded demo data');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();