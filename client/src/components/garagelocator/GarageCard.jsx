 // (Adjust the path based on your project structure)

import { getDistanceFromLatLonInKm } from "../../utils/getDistance";

//import { getDistanceFromLatLonInKm } from "../../utils/getDistance";

const GarageCard = ({ garage, userLocation, onLocate }) => {
  if (!userLocation || !garage?.location?.coordinates) {
    return null; // 🛡️ prevent crashes if data is missing
  }

  const distance = getDistanceFromLatLonInKm(
    userLocation.lat,
    userLocation.lng,
    garage.location.coordinates[1], // latitude
    garage.location.coordinates[0]  // longitude
  ).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 hover:shadow-lg transition">
      <h2 className="text-lg font-bold">{garage.name}</h2>
      <p className="text-gray-500 mb-2">{distance} km away</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => onLocate(garage)}
      >
        Locate Me
      </button>
    </div>
  );
};

export default GarageCard;
