import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const MapView = ({ centerLocation, garages, userLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "your_api_key",
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      center={centerLocation} 
      zoom={15}
      mapContainerClassName="w-full h-[400px] rounded-lg mb-6"
    >
      {/* User marker */}
      <Marker position={userLocation} label="You" />

      {/* Garage markers */}
      {garages.map((garage) => (
        <Marker
          key={garage._id}
          position={{
            lat: garage.location.coordinates[1],
            lng: garage.location.coordinates[0],
          }}
          label={garage.name}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;
