import { useEffect, useState } from "react";
import MapView from "../../../components/garagelocator/MapView";
import GarageCard from "../../../components/garagelocator/GarageCard";
import garagesMock from "../../../data/garagesMock";




const FindGaragesPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [centerLocation, setCenterLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(current);
        setCenterLocation(current); // 🧠 center initially at user's location
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const handleLocateGarage = (garage) => {
    const garageLocation = {
      lat: garage.location.coordinates[1],
      lng: garage.location.coordinates[0],
    };
    setCenterLocation(garageLocation);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Find Nearby Garages</h1>

      {userLocation ? (
        <>
          <MapView
            centerLocation={centerLocation}
            garages={garagesMock}
            userLocation={userLocation}
          />
          <div>
            {garagesMock.map((garage) => (
              <GarageCard
                key={garage._id}
                garage={garage}
                userLocation={userLocation}
                onLocate={handleLocateGarage}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center">Fetching your location...</p>
      )}
    </div>
  );
};

export default FindGaragesPage;
