// Delivery fee structure based on location
export const DELIVERY_LOCATIONS = {
  colombo: {
    name: 'Colombo',
    fee: 0,
    description: 'Free delivery (Our location)',
    isWarehouselocation: true,
  },
  westernProvince: {
    name: 'Western Province (Outside Colombo)',
    fee: 300,
    description: 'Kandy, Gampaha, Kalutara',
  },
  centralProvince: {
    name: 'Central Province',
    fee: 500,
    description: 'Matara, Galle, Kalutara',
  },
  southernProvince: {
    name: 'Southern Province',
    fee: 600,
    description: 'Matara, Galle, Hambantota',
  },
  northernProvince: {
    name: 'Northern Province',
    fee: 800,
    description: 'Jaffna, Mullaitivu, Vavuniya',
  },
  easternProvince: {
    name: 'Eastern Province',
    fee: 700,
    description: 'Batticaloa, Trincomalee, Ampara',
  },
  ubProvince: {
    name: 'Uva Province',
    fee: 600,
    description: 'Badulla, Monaragala',
  },
  sabProvince: {
    name: 'Sabaragamuwa Province',
    fee: 500,
    description: 'Ratnapura, Kegalle',
  },
};

export const getDeliveryFee = (location) => {
  return DELIVERY_LOCATIONS[location]?.fee || 500; // Default to 500 if location not found
};

export const getLocationName = (location) => {
  return DELIVERY_LOCATIONS[location]?.name || 'Other';
};

export const getLocationDescription = (location) => {
  return DELIVERY_LOCATIONS[location]?.description || '';
};

export default DELIVERY_LOCATIONS;
