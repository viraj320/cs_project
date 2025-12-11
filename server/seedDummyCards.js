const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const DummyCard = require('./models/DummyCard');

const seedDummyCards = async () => {
  try {
    // Get MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', mongoUri ? 'Connected' : 'NOT FOUND');

    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env file');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);

    console.log('MongoDB connected for seeding...');

    // Clear existing dummy cards
    await DummyCard.deleteMany({});
    console.log('Cleared existing dummy cards');

    // Dummy cards for testing
    const dummyCards = [
      {
        cardNumber: '4111111111111111',
        cardholderName: 'JOHN DOE',
        expiryMonth: '10',
        expiryYear: '26',
        cvv: '123',
        cardType: 'Visa',
        status: 'active',
        description: 'Test Visa card - Success',
      },
      {
        cardNumber: '4111111111111112',
        cardholderName: 'JANE SMITH',
        expiryMonth: '12',
        expiryYear: '27',
        cvv: '456',
        cardType: 'Visa',
        status: 'declined',
        description: 'Test Visa card - Declined for testing',
      },
      {
        cardNumber: '5555555555554444',
        cardholderName: 'BOB JOHNSON',
        expiryMonth: '06',
        expiryYear: '25',
        cvv: '789',
        cardType: 'Mastercard',
        status: 'expired',
        description: 'Test Mastercard - Expired',
      },
      {
        cardNumber: '5555555555554445',
        cardholderName: 'ALICE WILLIAMS',
        expiryMonth: '08',
        expiryYear: '28',
        cvv: '321',
        cardType: 'Mastercard',
        status: 'active',
        description: 'Test Mastercard - Success',
      },
      {
        cardNumber: '378282246310005',
        cardholderName: 'CHARLES BROWN',
        expiryMonth: '09',
        expiryYear: '26',
        cvv: '654',
        cardType: 'Amex',
        status: 'active',
        description: 'Test Amex card - Success',
      },
    ];

    // Insert dummy cards
    const insertedCards = await DummyCard.insertMany(dummyCards);
    console.log(`✅ ${insertedCards.length} dummy cards seeded successfully!`);

    // Display inserted cards
    console.log('\n📋 Dummy Cards in Database:');
    console.log('─'.repeat(80));
    insertedCards.forEach((card) => {
      console.log(`
Card Number: ${card.cardNumber}
Name: ${card.cardholderName}
Expiry: ${card.expiryMonth}/${card.expiryYear}
CVV: ${card.cvv}
Type: ${card.cardType}
Status: ${card.status}
Description: ${card.description}
─`.repeat(1));
    });

    console.log('─'.repeat(80));
    console.log('\n✅ Seeding complete!');
    console.log('\nYou can now use these cards for testing:');
    console.log('✓ 4111111111111111 (Visa - Success)');
    console.log('✗ 4111111111111112 (Visa - Declined)');
    console.log('✗ 5555555555554444 (Mastercard - Expired)');
    console.log('✓ 5555555555554445 (Mastercard - Success)');
    console.log('✓ 378282246310005 (Amex - Success)');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('Error seeding dummy cards:', error);
    process.exit(1);
  }
};

seedDummyCards();
